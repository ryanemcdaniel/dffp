import type {AnyKV, unixdate} from '#src/data/types-pure.ts';
import {v4} from 'uuid';

export type UUID = string;
export type CID = string;
export type PID = string;
export type IGNAME = string;

export type _Model = {
    _id: UUID;
    _tm: unixdate;
};

export const attachModelId = <T extends AnyKV = AnyKV>(kv: T): T & _Model => {
    kv._id = v4();
    kv._tm = Date.now();
    return kv as T & _Model;
};
