import type {num} from '#src/data/types-pure.ts';
import type {Descriptive1D} from '#src/data/model-descriptive/model-descriptive-types.ts';
import {max, mean, median, min, mode, standardDeviation} from 'simple-statistics';
import type {OptimizedHit} from '#src/data/pipeline/optimize-types.ts';
import {pipe} from 'fp-ts/function';
import {mapL, reduceL} from '#src/data/pure-list.ts';
import {mapKV, reduceKV} from '#src/data/pure-kv.ts';
import {toEntries} from 'fp-ts/Record';
import {fromEntries} from 'fp-ts/ReadonlyRecord';

export const describe1D = (ns: num[]): Descriptive1D => ({
    n_samples: ns.length,
    mean     : mean(ns),
    median   : median(ns),
    mode     : mode(ns),
    std_dev  : standardDeviation(ns),
    min      : min(ns),
    max      : max(ns),
});

export const describeHits1D = (hits: OptimizedHit[]) => pipe(
    hits,
    mapL((h) => ({
        a_th_lvl  : [h.attacker.data.th_lvl],
        a_pos     : [h.attacker.data.pos],
        d_th_lvl  : [h.defender.data.th_lvl],
        d_pos     : [h.defender.data.pos],
        order     : [h.data.order],
        order_norm: [h.data.order_norm],
        ore0      : [h.data.ore0],
        ore1      : [h.data.ore1],
        ccre      : [h.data.ccre],
        stars     : [h.data.stars],
        duration  : [h.data.duration],
        dmg_prct  : [h.data.dmg_prct],
    })),
    reduceL({
        a_th_lvl  : [] as number[],
        a_pos     : [] as number[],
        d_th_lvl  : [] as number[],
        d_pos     : [] as number[],
        order     : [] as number[],
        order_norm: [] as number[],
        ore0      : [] as number[],
        ore1      : [] as number[],
        ccre      : [] as number[],
        stars     : [] as number[],
        duration  : [] as number[],
        dmg_prct  : [] as number[],
    }, (hs, h) => pipe(h, toEntries, mapL(([k, v]) => [k, hs[k].concat(v)]), fromEntries)),
    mapKV(describe1D),
);
