/* eslint-disable @stylistic/multiline-ternary */
import type {CK_War} from '#src/clashking/types.ts';
import {fpCkWars} from '#src/clashking/mappers/fp-ck-wars.ts';
import {pipe} from 'fp-ts/function';
import {filter, findFirst, map, reduce} from 'fp-ts/Array';
import {toArray} from 'fp-ts/Record';

export const fpCkWarsAnalysis = (us_clan: string, wars: CK_War[]) => {
    const data = fpCkWars(us_clan)(wars);

    const attackers = pipe(
        data.attackers,
        toArray,
        filter(([k]) => pipe(data.wars[0].mems, findFirst(([m]) => m.tag === k))._tag === 'Some'),
    );

    const defenders = pipe(
        data.defenders,
        toArray,
        filter(([k]) => pipe(data.wars[0].mems, findFirst(([m]) => m.tag === k))._tag === 'Some'),
    );

    return {
        defender_stats: defenders,
        attacker_stats: pipe(attackers, map(([ak, av]) => {
            const begin = {
                hits   : 0,
                ore    : 0,
                ore_1st: 0,
                cc     : 0,

            };

            const together = pipe(av, reduce(begin, (hs, h) => {
                hs.hits++;
                hs.ore += h.chr[0] ? 1 : 0;
                hs.ore_1st += h.chr[1] ? 1 : 0;
                hs.cc += h.chr[2] ? 1 : 0;
                return hs;
            }));

            return together;
        })),
    };
};
