import type {P, PM} from '#src/model/pure.ts';
import type {CK_Member} from '#src/clashking/types.ts';
import {fromCompare} from 'fp-ts/Ord';
import N from 'fp-ts/number';

export type Mem = P<{
    pid: string;
    cid: string;
    nm : string;
    thl: number;
    pos: number;
}>;
export type MemR = PM<Mem>;
export type MemRS = PM<Mem[]>;

export const memOrd = fromCompare<Mem>((a, b) => N.Ord.compare(a.pos, b.pos));

export const memCK = (cid: string) => (m: CK_Member) => ({
    pid: m.tag,
    cid,
    nm : m.name,
    thl: m.townhallLevel,
    pos: m.mapPosition,
});
