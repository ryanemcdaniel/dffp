import {pipe} from 'fp-ts/function';
import {queryAttacksByClan, queryClan, queryWarsByClan} from '#src/data/query/graph-query.ts';
import {filterL, flatMapL, flattenL, mapL, numL, reduceL, sortL} from '#src/data/pure-list.ts';
import {mean, median} from 'simple-statistics';
import {descriptiveHitRates} from '#src/data/model-descriptive/descriptive-hit-rates.ts';
import type {buildGraphModel} from '#src/data/build-graph-model.ts';
import {orderHits, OrdN, OrdS} from '#src/data/pure.ts';
import {flatMap, head, of} from 'fp-ts/Array';
import {filterKV, mapKV, sizeKV} from '#src/data/pure-kv.ts';
import {collect} from 'fp-ts/Record';
import {right} from 'fp-ts/Either';
import {fromCompare} from 'fp-ts/Ord';
import type {OptimizedHit} from '#src/data/pipeline/optimize-types.ts';

export const describeScout = (graph: Awaited<ReturnType<typeof buildGraphModel>>) => {
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

    const trojanHorseIndex = pipe(attacks, mapL((a) => a.data.order_norm), mean);

    const sequenceIndex = pipe(
        wars,
        mapL((w) => pipe(
            w.hits,
            collect(OrdS)((_, h) => h),
            // filterL(h => h._id_attacker_clan )
            sortL(fromCompare<OptimizedHit>((a, b) => OrdN.compare(a.data.order, b.data.order))),
            reduceL([0, 1, 0], ([contN, isCont, hN], h) => {
                if (h.attacker.clan.data.cid !== graph.opponentTag) {
                    isCont = 0;
                }
                if (isCont) {
                    contN += 1;
                }
                if (h.attacker.clan.data.cid === graph.opponentTag) {
                    isCont = 1;
                    hN += 1;
                }
                return [contN, isCont, hN];
            }),
            of,
            mapL(([contN,,hN]) => hN === 0
                ? 0
                : contN / hN),
        )),
        flattenL,
        mean,
    );

    const hitsAttempt = pipe(attacks, filterL((a) => a.data.ore1 === 0));
    const hitsOre = pipe(attacks, filterL((a) => a.data.ore1 > 0));
    const hitsCcReveal = pipe(attacks, filterL((a) => a.data.ccre > 0));
    const hitsPossible = pipe(wars, reduceL(0, (ws, w) => ws + w.data.rules_size * w.data.rules_atks));

    const hitRates = descriptiveHitRates(graph.opponentTag, graph.opponentMembers, graph.model);

    const warsizes = pipe(wars, mapL((w) => w.data.rules_size));

    const averageWarSize = pipe(warsizes, mean, (n) => n / 5, Math.round, (n) => Math.trunc(n * 5));
    const medianWarSize = median(warsizes);

    return {
        wars,
        attacks,
        record: {
            total : record.reduce((rs, r) => rs + r, 0),
            wins  : record[0],
            losses: record[1],
            draws : record[2],
        },
        trojanHorseIndex,
        sequenceIndex,
        hitsAttempt,
        hitsOre,
        hitsCcReveal,
        hitsPossible,
        hitRates,
        graph: graph,
        averageWarSize,
        medianWarSize,
    };
};
