import {callClashKing, callPreviousWars} from '#src/api/clash-king.ts';
import {DFFP_CLANS, DFFP_CLANS_ALIAS} from '#src/lambdas/temp-constants.ts';
import {show} from '../../../../util.ts';
import type {APIChatInputApplicationCommandInteraction} from 'discord-api-types/v10';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {pipe} from 'fp-ts/function';
import {filter, filterWithIndex, flatMap, map, reduce, reduceWithIndex, sort, zip} from 'fp-ts/Array';
import {ingestCkWar} from '#src/data/ingest/ingest-ck-wars.ts';
import {deriveWar} from '#src/data/derive/derive.ts';
import {accumulateWarData, optimizeGraphModel} from '#src/data/optimize/optimize-graph-model.ts';
import {toArray, filter as filterRecords, map as mapRecords, reduce as reduceRecords} from 'fp-ts/Record';
import {fromCompare} from 'fp-ts/Ord';
import {Ord} from 'fp-ts/number';
import type {ClanWarMember} from 'clashofclans.js';
import {descriptiveHitRates} from '#src/data/model/descriptive-hit-rates.ts';
import {initEmbedAcc} from '#src/lambdas/app_discord/build-embed.ts';

export const warOpponent = async (body: APIChatInputApplicationCommandInteraction) => {
    const [{value: clan}] = body.data.options!.filter((o) => o.name === 'clan') as {value: string}[];
    const [toVal] = body.data.options!.filter((o) => o.name === 'to') as ({value?: number} | undefined)[];
    const [fromVal] = body.data.options!.filter((o) => o.name === 'from') as ({value?: number} | undefined)[];

    const to = Number.parseInt(String(toVal?.value ?? '50'));
    const from = Number.parseInt(String(fromVal?.value ?? '1'));

    const alias = clan.replaceAll(' ', '').toLowerCase();

    const clanTag = alias in DFFP_CLANS_ALIAS
        ? DFFP_CLANS_ALIAS[alias]
        : clan;

    const currentWar = await api_coc.getCurrentWar(clanTag);

    if (!currentWar) {
        return 'no current war data available';
    }

    if (currentWar.isWarEnded) {
        return 'current war has already ended';
    }

    const opponentTag = currentWar.opponent.tag;
    const opponentPlayers = pipe(
        currentWar.opponent.members,
        sort(fromCompare<ClanWarMember>((a, b) => Ord.compare(a.mapPosition, b.mapPosition))),
    );
    const clanPlayers = pipe(
        currentWar.clan.members,
        sort(fromCompare<ClanWarMember>((a, b) => Ord.compare(a.mapPosition, b.mapPosition))),
    );

    const wars = [
        ...(await callPreviousWars(clanTag)).contents,
        ...(await callPreviousWars(currentWar.opponent.tag)).contents,
    ];

    const graphModel = pipe(
        wars,
        map(ingestCkWar),
        map(deriveWar),
        accumulateWarData,
        optimizeGraphModel,
    );

    const clanRates = descriptiveHitRates(clanTag, clanPlayers, graphModel);
    const opponentRates = descriptiveHitRates(opponentTag, opponentPlayers, graphModel);

    return pipe(
        zip(clanRates, opponentRates),
        filterWithIndex((idx) => idx >= from - 1 && idx <= to - 1),
        reduceWithIndex(
            initEmbedAcc(`${currentWar.clan.name} vs. ${currentWar.opponent.name}`, 'hit/def rate vs. hit/def rate\n'),
            (idx, acc, [p1, p2]) => {
                const i = String(idx + 1).padEnd(2);
                const p1Name = p1[0].name;
                const p1hr = (p1[1][0] * 100).toPrecision(3);
                const p1dr = (p1[2][0] * 100).toPrecision(3);
                const p1hrn = String(p1[1][1]);
                const p1drn = String(p1[2][1]);
                const p2Name = p2[0].name;
                const p2hr = (p2[1][0] * 100).toPrecision(3);
                const p2dr = (p2[2][0] * 100).toPrecision(3);
                const p2hrn = String(p2[1][1]);
                const p2drn = String(p2[2][1]);

                acc.desc = acc.desc
                    .concat([`#${i} **${p1Name}** vs. **${p2Name}**\n`])
                    .concat([`-# ${p1hr}%, ${p1dr}%  (n=${p1hrn},${p1drn}) vs. ${p2hr}%, ${p2dr}%  (n=${p2hrn},${p2drn})\n`]);

                return acc;
            },
        ),
    );

    // descriptiveHitRates()
    //     .reduce(
    //         (acc, hr, idx) => acc
    //         + `**#${idx + 1} ${hr[0].name}**\n`
    //         + `-# hit/def rate:  ${(hr[1][0] * 100).toPrecision(3)}%  (n=${hr[1][1]}),  ${(hr[2][0] * 100).toPrecision(3)}%  (n=${hr[2][1]})\n`,
    //         '',
    //     );
};
