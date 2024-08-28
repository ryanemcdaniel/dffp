import {flow} from 'fp-ts/function';
import {flatMap, of, reduce} from 'fp-ts/Array';
import {type n_bool, n_frombool, n_opposite, type PM} from '#src/model/pure.ts';
import type {Mem} from '#src/model/fp-member.ts';
import {type Hit} from '#src/model/fp-hit.ts';
import type {CK_Hit} from '#src/clashking/types.ts';

type HitAccumulator = {
    ore: PM<n_bool>;
    hst: PM<n_bool>;
    hs : Hit[];
};

const accumumulator = (): HitAccumulator => ({
    ore: {},
    hst: {},
    hs : [],
});

export const fpCkHits = flow((ms_kpid: PM<Mem>) => flow(
    reduce(accumumulator(), (hs, h: CK_Hit) => {
        const [att, def] = [ms_kpid[h.attackerTag], ms_kpid[h.defenderTag]];

        let c_ore0: n_bool = 0;

        const c_ore1 = n_opposite(hs.ore[def.pid]);
        const c_thld = def.thl - att.thl;
        const c_posd = def.pos - att.pos;

        if (h.stars === 3 && !c_ore1) {
            c_ore0 = hs.ore[def.pid] = 1;
        }

        hs.hs.push({
            a_pid: att.pid,
            a_cid: att.cid,
            a_thl: att.thl,
            a_pos: att.pos,
            d_pid: def.pid,
            d_cid: def.cid,
            d_thl: def.thl,
            d_pos: def.pos,
            h_ord: h.order,
            h_str: h.stars,
            h_dmg: h.destructionPercentage,
            h_dur: h.duration,

            c_ore0,
            c_ore1,
            c_ccre: n_frombool(!c_ore0 && c_thld >= 2 && c_posd >= 10),
            c_thld,
            c_posd,

            // todo hit nums
            c_hnum: 0,
        });
        return hs;
    }),
    of,
    flatMap((hs) => hs.hs),
));
