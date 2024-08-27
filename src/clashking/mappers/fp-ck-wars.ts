import type {CK_War} from '#src/clashking/types.ts';
import {pipe} from 'fp-ts/function';
import {concat, map, reduce, sort} from 'fp-ts/Array';
import {fpCkWar, type HitData} from '#src/clashking/mappers/fp-ck-war.ts';
import {toArray} from 'fp-ts/Record';
import {type PM, warOrd} from '#src/clashking/mappers/fp-ck.ts';

export const fpCkWars = (us_clan: string) => (wars: CK_War[]) => {
    const ckWars = pipe(wars, map(fpCkWar(us_clan)), sort(warOrd));

    const all_attackers = pipe(ckWars, reduce({} as PM<HitData[]>, (ws, w) => pipe(
        w.hit_lookup.att,
        toArray,
        reduce(ws, (as, [ak, av]) => {
            as[ak] ??= [];
            as[ak].push(...av);
            return as;
        }),
    )));

    const all_defenders = pipe(ckWars, reduce({} as PM<HitData[]>, (ws, w) => pipe(
        w.hit_lookup.def,
        toArray,
        reduce(ws, (as, [ak, av]) => {
            as[ak] ??= [];
            as[ak].push(...av);
            return as;
        }),
    )));

    const player_names = pipe(toArray(all_attackers), concat(toArray(all_defenders)), reduce({} as PM<string>, (ns, [nk, [nv]]) => {
        ns[nk] ??= nv.att[2];
        return ns;
    }));

    const clan_names = pipe(ckWars, reduce({} as PM<string>, (ns, n) => {
        ns[n.us.tag] ??= n.us.name;
        ns[n.vs.tag] ??= n.vs.name;
        return ns;
    }));

    return {
        wars     : ckWars,
        attackers: all_attackers,
        defenders: all_defenders,
        player_names,
        clan_names,
    };
};

// const ope = () => pipe(
//     mappedWars,
//     reduce([{}, {}, {}, {}], ([as, ds, dos, hos], w) => [
//         pipe(w.hit_lookup.att, toArray, reduce(as, (kvs, [k, v]) => {
//             kvs[k] ??= [];
//             kvs[k].push(...v);
//             return kvs;
//         })),
//         pipe(w.hit_lookup.def, toArray, reduce(ds, (kvs, [k, v]) => {
//             kvs[k] ??= [];
//             kvs[k].push(...v);
//             return kvs;
//         })),
//         pipe(w.hit_lookup.def_ore, toArray, reduce(dos, (kvs, [k, v]) => {
//             kvs[w.vs.tag] ??= {};
//             kvs[w.vs.tag][k] ??= v;
//             return kvs;
//         })),
//         pipe(w.hit_lookup.ord, reduce(hos, (kvs, h) => {
//             kvs[w.vs.tag] ??= [];
//             kvs[w.vs.tag].push(h);
//             return kvs;
//         })),
//     ]),
// );
