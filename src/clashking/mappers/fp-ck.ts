import type {CK_Hit, CK_Member} from '#src/clashking/types.ts';
import {fromCompare} from 'fp-ts/Ord';
import N from 'fp-ts/number';
import S from 'fp-ts/string';
import type {fpCkWar} from '#src/clashking/mappers/fp-ck-war.ts';

type FP_CK_War = ReturnType<ReturnType<typeof fpCkWar>>;

export const hitOrd = fromCompare<CK_Hit>((a, b) => N.Ord.compare(a.order, b.order));
export const warOrd = fromCompare<FP_CK_War>((a, b) => S.Ord.compare(a.rules[0].toString(), b.rules[0].toString()));
