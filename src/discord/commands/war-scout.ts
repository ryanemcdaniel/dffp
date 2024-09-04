import {buildCommand} from '#src/discord/types.ts';
import {COMMANDS} from '#src/discord/commands.ts';
import {buildGraphModel} from '#src/data/build-graph-model.ts';
import {pipe} from 'fp-ts/function';
import {queryAttacksByClan, queryClan, queryWarsByClan} from '#src/data/query/graph-query.ts';
import {filterL, flatMapL, mapIdxL, mapL, numL, reduceL} from '#src/data/pure-list.ts';
import type {num} from '#src/data/types-pure.ts';
import {mean} from 'simple-statistics';
import {
    dBold,
    dCode,
    dHdr1, dHdr2,
    dHdr3,
    dLines, dLink,
    dNotA, dSubC,
    dSubH,
    nIdex,
    nNatr, nNatT,
    nPrct,
} from '#src/discord/command-util/message.ts';
import {dTable} from '#src/discord/command-util/table.ts';
import {descriptiveHitRates} from '#src/data/model-descriptive/descriptive-hit-rates.ts';
import {concat, flatMap, reverse} from 'fp-ts/Array';

export const warScout = buildCommand(COMMANDS.WAR_SCOUT, async (body) => {
    const graph = await buildGraphModel(body.data.options.clan);

    const wars = pipe(graph.model, queryWarsByClan(graph.opponentTag));
    const attacks = pipe(graph.model, queryAttacksByClan(graph.opponentTag));

    const record = pipe(graph.model, queryClan(graph.opponentTag), reduceL([0, 0, 0], (rs, c) => {
        if (c.data.stars > c.enemy.data.stars) {
            rs[0] += 1;
        }
        else if (c.data.stars === c.enemy.data.stars) {
            if (c.data.dmg > c.enemy.data.dmg) {
                rs[0] += 1;
            }
            else if (c.data.dmg === c.enemy.data.dmg) {
                rs[2] += 1;
            }
            else if (c.data.dmg < c.enemy.data.dmg) {
                rs[1] += 1;
            }
        }
        else if (c.data.stars < c.enemy.data.stars) {
            rs[1] += 1;
        }

        return rs;
    }));

    const trojanHorseIndex = pipe(attacks, reduceL(numL(), (as, a) => as.concat([a.data.order_norm])), mean);

    const hitsAttempt = pipe(attacks, filterL((a) => a.data.ore1 === 0));
    const hitsOre = pipe(attacks, filterL((a) => a.data.ore1 > 0));
    const hitsCcReveal = pipe(attacks, filterL((a) => a.data.ccre > 0));
    const hitsPossible = pipe(wars, reduceL(0, (ws, w) => ws + (w.data.rules_size * w.data.rules_atks * 2)));

    const hitRates = descriptiveHitRates(graph.opponentTag, graph.opponentMembers, graph.model);

    // const clanAttackStats = pipe(
    //     graph.model,
    //     queryAttacksByClan(graph.clanTag),
    //     describeHits1D,
    // );
    //
    // const clanDefenseStats = pipe(
    //     graph.model,
    //     queryAttacksByClan(graph.clanTag),
    //     describeHits1D,
    // );

    return [{
        title: '',
        desc : dLines([
            dHdr3(`${graph.currentWar.clan.name} vs ${graph.currentWar.opponent.name}`),
        ].flat()),
    }, {
        title: '',
        desc : dLines([
            dHdr2(`War Log Analysis n=${wars.length}`),
            '',
            dBold('basic info'),
            pipe(dTable([
                [`name`, graph.currentWar.opponent.name],
                [`tag`, graph.currentWar.opponent.tag],
                [`W-L-D`, `${nNatr(record[0])}-${nNatr(record[1])}-${nNatr(record[2])}`],
            ]), mapL(dSubC)),
            '',
            dBold('scouting index'),
            pipe(dTable([
                ['w/l ratio', nIdex(record[0] / (record[0] + record[1] + record[2])), ''],
                ['trojan', nIdex(trojanHorseIndex), '0 = early, 1 = late'],
                ['sequence', dNotA(), '0 = 1-man-army'],
                ['attack 𝞰', dNotA(), ''],
                ['defend 𝞰', dNotA(), ''],
                ['weight 𝞰', dNotA(), '0 = maxers'],
            ]), mapL(dSubC)),
            '',
            dBold('war averages'),
            pipe(dTable([
                ['3 star attempts', nNatr(hitsAttempt.length / wars.length), nPrct((hitsAttempt.length) / hitsPossible)],
                ['hits missed', nNatr((hitsPossible - attacks.length) / wars.length), nPrct((hitsPossible - attacks.length) / hitsPossible)],
                ['ore hits', nNatr(hitsOre.length / wars.length), nPrct((hitsOre.length) / hitsPossible)],
                ['cc reveal hits', nNatr(hitsCcReveal.length / wars.length), nPrct((hitsCcReveal.length) / hitsPossible)],
            ]), mapL(dSubC)),
        ].flat()),
    }, {
        title: '',
        desc : dLines([
            dHdr2(`War Rank Analysis`),
            pipe(
                [['rk', 'th', 'hit rate', 'def rate', 'name']],
                concat(pipe(
                    hitRates,
                    mapL(([p, hr, dr]) => [nNatT(p.mapPosition), nNatT(p.townHallLevel), `${nPrct(hr[0])} n=${nNatr(hr[1])}`, `${nPrct(dr[0])} n=${nNatr(dr[1])}`, ((p.name))]),
                )),
                dTable,
                mapL(dSubC),
            ),
        ].flat()),
    }];
});
