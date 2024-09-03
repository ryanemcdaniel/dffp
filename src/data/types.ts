import type {AnyKV, KV, unixdate} from '#src/data/types-pure.ts';
import {v4} from 'uuid';

export type UUID = string;
export type CID = string;
export type PID = string;
export type IGNAME = string;

export type IDKV<T > = Record<string, T>;

export type _Model = {
    _id: UUID;
    _tm: unixdate;
};

export const attachModelId = <T extends AnyKV = AnyKV>(kv: T): T & _Model => {
    kv._id = kv._id ?? v4();
    kv._tm = kv._tm ?? Date.now();
    return kv as T & _Model;
};
