import {flow, pipe} from 'fp-ts/function';
import {descriptiveHitRates} from '#src/data/model-descriptive/descriptive-hit-rates.ts';
import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {buildGraphModel} from '#src/data/build-graph-model.ts';
import {concatL, filterIdxL, flatMapL, flattenL, mapIdxL, zipL} from '#src/data/pure-list.ts';
import {getFromTo} from '#src/discord/command-util/default-options.ts';
import {
    dCrss, dEmpL,
    dHdr3,
    dLines,
    dNewL,
    dSubC,
    dSUCr,
    dSUnC,
    nNatr,
    nNatT,
    nPrct,
} from '#src/discord/command-util/message.ts';
import {dTable} from '#src/discord/command-util/message-table.ts';
import {identity} from 'fp-ts';

export const warOpponent = buildCommand(COMMANDS.WAR_OPPONENT, async (body) => {
    const graph = await buildGraphModel(body.data.options.clan);

    const clanRates = descriptiveHitRates(graph.clanTag, graph.clanMembers, graph.model);
    const opponentRates = descriptiveHitRates(graph.opponentTag, graph.opponentMembers, graph.model);

    const [from, to] = getFromTo(body);

    const rates = pipe(
        zipL(clanRates, opponentRates),
        filterIdxL((idx) => idx >= from - 1 && idx <= to - 1),
    );

    return [{
        desc: pipe(
            [
                dHdr3(`${graph.currentWar.clan.name} vs. ${graph.currentWar.opponent.name}`),
            ],
            concatL(pipe(
                [
                    ['rk', 'th', ' % hr', ' % dr', 'name'],
                    [''],
                ],
                concatL(pipe(
                    rates,
                    mapIdxL((idx, [p1, p2]) => [
                        [nNatT(idx + from), nNatT(p1[0].townHallLevel), `${nPrct(p1[1][0])} n=${nNatr(p1[1][1])}`, `${nPrct(p1[2][0])} n=${nNatr(p1[2][1])}`, (p1[0].name)],
                        ['', nNatT(p2[0].townHallLevel), `${nPrct(p2[1][0])} n=${nNatr(p2[1][1])}`, `${nPrct(p2[2][0])} n=${nNatr(p2[2][1])}`, (p2[0].name)],
                        [''],
                    ]),
                    flattenL,
                )),
                dTable,
                mapIdxL((idx, t) => idx % 3 === 1
                    ? dEmpL()
                    : dSubC(t)),
            )),
            dLines,
        ),
    }];
});
