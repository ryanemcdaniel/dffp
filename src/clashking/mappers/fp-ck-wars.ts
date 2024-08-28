import type {CK_War} from '#src/clashking/types.ts';
import {pipe} from 'fp-ts/function';
import {concat, map, reduce, sort} from 'fp-ts/Array';
import {fpCkWar} from '#src/clashking/mappers/fp-ck-war.ts';
import {toArray} from 'fp-ts/Record';
import {enu, type PM} from '#src/model/pure.ts';
import type {Hit} from '#src/model/fp-hit.ts';
import {warOrd} from '#src/clashking/mappers/fp-ck.ts';
import {toHits, toHitsStats} from '#src/model/fp-hits.ts';

export const fpCkWars = (us_clan: string) => (wars: CK_War[]) => {
    const ckWars = pipe(wars, map(fpCkWar(us_clan)), sort(warOrd));

    return {
        wars: pipe(
            ckWars,
            map((w) => pipe(
                w.hits_ms,
                toArray,
                map(([k, v]) => [k, pipe(
                    v,
                    toHits,
                    toHitsStats,
                )]),
            )),
        ),
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
