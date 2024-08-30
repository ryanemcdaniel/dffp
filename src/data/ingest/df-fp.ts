import {flow, pipe} from 'fp-ts/function';
import {v4} from 'uuid';
import {addKV, type KV} from '#src/pure/kv.ts';

export type _DFFP = {
    _id: string;
    _tm: number;
};

export const dffp = flow(<T extends KV>(data: T): _DFFP & T => pipe(data, addKV(() => ({
    _dv: 0,
    _ev: 0,
    _id: v4(),
    _tm: Date.now(),
    _rf: {},
}))));
