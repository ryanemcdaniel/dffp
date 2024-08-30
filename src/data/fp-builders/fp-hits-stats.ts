import type {Hits} from '#src/data/fp-builders/fp-hits.ts';
import {d1_stats} from '#src/pure/pure-stats.ts';
import {flow} from 'fp-ts/function';

export const toHitsStats = flow(
    (h: Hits) => ({
        a_pid: h.a_pid,
        a_cid: h.a_pid,

        a_thl: d1_stats(h.a_thl),
        a_pos: d1_stats(h.a_pos),
        d_pid: h.d_pid,
        d_cid: h.d_cid,
        d_thl: d1_stats(h.d_thl),
        d_pos: d1_stats(h.d_pos),
        h_ord: d1_stats(h.h_ord),
        h_str: d1_stats(h.h_str),
        h_dmg: d1_stats(h.h_dmg),
        h_dur: d1_stats(h.h_dur),

        c_ore0: d1_stats(h.c_ore0),
        c_ore1: d1_stats(h.c_ore1),
        c_ccre: d1_stats(h.c_ccre),
        c_thld: d1_stats(h.c_thld),
        c_posd: d1_stats(h.c_posd),
        c_hnum: d1_stats(h.c_hnum),
    }),
);
