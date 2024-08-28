import {concat, foldMap} from 'fp-ts/Array';
import type {Hit} from '#src/model/fp-hit.ts';
import type {GuessHigherKind, Override} from '#src/model/pure.ts';
import type {Monoid} from 'fp-ts/Monoid';
import {stats} from '#src/model/pure-stats.ts';

export type Hits = Override<GuessHigherKind<Hit>, {
    readonly d_pid: string[];
    readonly d_cid: string[];
}>;

const EMPTY_HITS: Hits = {
    a_pid : '',
    a_cid : '',
    a_thl : [],
    a_pos : [],
    d_pid : [],
    d_cid : [],
    d_thl : [],
    d_pos : [],
    h_ord : [],
    h_str : [],
    h_dmg : [],
    h_dur : [],
    c_ore0: [],
    c_ore1: [],
    c_ccre: [],
    c_thld: [],
    c_posd: [],
    c_hnum: [],
};

const HitsMonoid = {
    empty : EMPTY_HITS,
    concat: (h1, h2) => ({
        a_pid: h1.a_pid,
        a_cid: h1.a_pid,

        a_thl: concat(h1.a_thl)(h2.a_thl),
        a_pos: concat(h1.a_pos)(h2.a_pos),

        d_pid: concat(h1.d_pid)(h2.d_pid),
        d_cid: concat(h1.d_cid)(h2.d_cid),
        d_thl: concat(h1.d_thl)(h2.d_thl),
        d_pos: concat(h1.d_pos)(h2.d_pos),

        h_ord: concat(h1.h_ord)(h2.h_ord),
        h_str: concat(h1.h_str)(h2.h_str),
        h_dmg: concat(h1.h_dmg)(h2.h_dmg),
        h_dur: concat(h1.h_dur)(h2.h_dur),

        c_ore0: concat(h1.c_ore0)(h2.c_ore0),
        c_ore1: concat(h1.c_ore1)(h2.c_ore1),
        c_ccre: concat(h1.c_ccre)(h2.c_ccre),
        c_thld: concat(h1.c_thld)(h2.c_thld),
        c_posd: concat(h1.c_posd)(h2.c_posd),
        c_hnum: concat(h1.c_hnum)(h2.c_hnum),
    }),
} as const satisfies Monoid<Hits>;

export const toHits = foldMap(HitsMonoid)((h: Hit) => ({
    a_pid: h.a_pid,
    a_cid: h.a_pid,

    a_thl: [h.a_thl],
    a_pos: [h.a_pos],
    d_pid: [h.d_pid],
    d_cid: [h.d_cid],
    d_thl: [h.d_thl],
    d_pos: [h.d_pos],
    h_ord: [h.h_ord],
    h_str: [h.h_str],
    h_dmg: [h.h_dmg],
    h_dur: [h.h_dur],

    c_ore0: [h.c_ore0],
    c_ore1: [h.c_ore1],
    c_ccre: [h.c_ccre],
    c_thld: [h.c_thld],
    c_posd: [h.c_posd],
    c_hnum: [h.c_hnum],
}));

export const toHitsStats = (h: Hits) => ({
    a_pid: h.a_pid,
    a_cid: h.a_pid,

    a_thl: stats(h.a_thl),
    a_pos: stats(h.a_pos),
    d_pid: stats(h.d_pid),
    d_cid: stats(h.d_cid),
    d_thl: stats(h.d_thl),
    d_pos: stats(h.d_pos),
    h_ord: stats(h.h_ord),
    h_str: stats(h.h_str),
    h_dmg: stats(h.h_dmg),
    h_dur: stats(h.h_dur),

    c_ore0: stats(h.c_ore0),
    c_ore1: stats(h.c_ore1),
    c_ccre: stats(h.c_ccre),
    c_thld: stats(h.c_thld),
    c_posd: stats(h.c_posd),
    c_hnum: stats(h.c_hnum),
});
