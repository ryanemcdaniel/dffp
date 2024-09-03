import {pipe} from 'fp-ts/function';
import {filterWithIndex, reduceWithIndex, zip} from 'fp-ts/Array';
import {descriptiveHitRates} from '#src/data/model/descriptive-hit-rates.ts';
import {initEmbedAcc} from '#src/lambdas/app_discord/build-embed.ts';
import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {buildGraphModel} from '#src/data/build-graph-model.ts';

export const warOpponent = buildCommand(COMMANDS.WAR_OPPONENT, async (body) => {
    const graph = await buildGraphModel(body.data.options.clan);

    const clanRates = descriptiveHitRates(graph.clanTag, graph.clanMembers, graph.model);
    const opponentRates = descriptiveHitRates(graph.opponentTag, graph.opponentMembers, graph.model);

    const from = Number(String(body.data.options.from ?? '1'));
    const to = Number(String(body.data.options.to ?? '50'));

    return pipe(
        zip(clanRates, opponentRates),
        filterWithIndex((idx) => idx >= from - 1 && idx <= to - 1),
        reduceWithIndex(
            initEmbedAcc(`${graph.currentWar.clan.name} vs. ${graph.currentWar.opponent.name}`, 'hit/def rate vs. hit/def rate\n'),
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

                return {
                    ...acc,
                    desc: acc.desc
                        .concat([`#${i} **${p1Name}** vs. **${p2Name}**\n`])
                        .concat([`-# ${p1hr}%, ${p1dr}%  (n=${p1hrn},${p1drn}) vs. ${p2hr}%, ${p2dr}%  (n=${p2hrn},${p2drn})\n`]),
                };
            },
        ),
    );
});
