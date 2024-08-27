import type {CK_Hit, CK_Member} from '#src/clashking/types.ts';
import {fromCompare} from 'fp-ts/Ord';
import N from 'fp-ts/number';
import S from 'fp-ts/string';
import {flow} from 'fp-ts/function';
import {filter, map, sort} from 'fp-ts/Array';
import type {fpCkWar, HitData} from '#src/clashking/mappers/fp-ck-war.ts';

export type PM<T> = {[K in string]: T};
export type TaggedMem = CK_Member & {c_tag: string};

type FP_CK_War = ReturnType<ReturnType<typeof fpCkWar>>;

export const memOrd = fromCompare<TaggedMem>((a, b) => N.Ord.compare(a.mapPosition, b.mapPosition));
export const hitOrd = fromCompare<CK_Hit>((a, b) => N.Ord.compare(a.order, b.order));
export const warOrd = fromCompare<FP_CK_War>((a, b) => S.Ord.compare(a.w_t_start.toString(), b.w_t_start.toString()));

export const tagAndSort = (c_tag: string) => flow(map((m: CK_Member) => ({...m, c_tag})), sort(memOrd));

export const mem = () => ({} as PM<TaggedMem>);
export const hit = () => ({} as PM<HitData[]>);
