import {type n_bool, n_frombool, n_opposite, type P, type PM} from '#src/pure/pure.ts';
import type {CK_Hit} from '#src/clashking/types.ts';
import {flow} from 'fp-ts/function';
import {partition, reduce} from 'fp-ts/Array';
import type {Mem} from '#src/data/fp-builders/fp-member.ts';

export type Hit = P<{
    a_pid : string; // attacker
    a_cid : string;
    a_thl : number;
    a_pos : number;
    d_pid : string; // defender
    d_cid : string;
    d_thl : number;
    d_pos : number;
    h_ord : number; // hit stats
    h_str : number;
    h_dmg : number;
    h_dur : number;
    c_ore0: n_bool; // 3* success, all hits after are ore hits
    c_ore1: n_bool; // ore hit
    c_ccre: n_bool; // cc reveal hit
    c_thld: number; // th lvl difference
    c_posd: number; // war position difference
    c_hnum: number;
}>;

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

const accessR = flow(
    <T extends Record<string, unknown>, B>
    (f: (a: T) => B) => (a: T): B => f(a),
);

export const toHit = flow((ms_kpid: PM<Mem>) => flow(
    reduce(accumumulator(), (hs, h: CK_Hit) => {
        const [att, def] = [ms_kpid[h.attackerTag], ms_kpid[h.defenderTag]];

        let c_ore0: n_bool = 0;

        const c_ore1 = n_opposite(hs.ore[def.pid]);
        const c_thld = def.thl - att.thl;
        const c_posd = def.pos - att.pos;

        if (h.stars === 3 && !c_ore1) {
            c_ore0 = hs.ore[def.pid] = 1;
        }

        hs.hst[att.cid] ??= 0;
        hs.hst[att.cid]++;

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
            c_ccre: n_frombool(!c_ore0 && c_thld >= 2),
            c_thld,
            c_posd,
            c_hnum: hs.hst[att.cid],
        });
        return hs;
    }),
    accessR((hs) => hs.hs),
));

export const partitionHitsDefenses = flow((tag: string) => partition((h: Hit) => h.a_cid === tag));
