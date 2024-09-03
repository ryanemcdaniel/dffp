import {callClashKing, callPreviousWars} from '#src/api/clash-king.ts';
import {DFFP_CLANS, DFFP_CLANS_ALIAS} from '#src/lambdas/temp-constants.ts';
import {show} from '../../../../util.ts';
import type {APIChatInputApplicationCommandInteraction} from 'discord-api-types/v10';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {pipe} from 'fp-ts/function';
import {filter, flatMap, map, reduce, sort} from 'fp-ts/Array';
import {ingestCkWar} from '#src/data/ingest/ingest-ck-wars.ts';
import {deriveWar} from '#src/data/derive/derive.ts';
import {accumulateWarData, optimizeGraphModel} from '#src/data/optimize/optimize-graph-model.ts';
import {toArray, filter as filterRecords, map as mapRecords, reduce as reduceRecords} from 'fp-ts/Record';
import {fromCompare} from 'fp-ts/Ord';
import {Ord} from 'fp-ts/number';
import type {ClanWarMember} from 'clashofclans.js';
import {descriptiveHitRates} from '#src/data/model/descriptive-hit-rates.ts';

export const warOpponent = async (body: APIChatInputApplicationCommandInteraction) => {
    const [{value: clan}] = body.data.options!.filter((o) => o.name === 'clan') as {value: string}[];

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
        map((m) => m.tag),
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

    return descriptiveHitRates(opponentTag, opponentPlayers, graphModel);
};
