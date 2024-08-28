/* eslint-disable @stylistic/indent,@stylistic/multiline-ternary */

import {option} from 'fp-ts';
import {flow} from 'fp-ts/function';
import {map, reduce} from 'fp-ts/Array';
import {toArray} from 'fp-ts/Record';

export type n_bool =
    | 1
    | 0;
export const n_opposite = (n: n_bool) => n === 1 ? 0 : 1;
export const n_frombool = (n: boolean) => n ? 1 : 0;

export type num = number;

export type PM<T> = {[K in string]: T};
export type PMB = PM<n_bool>;
export type DynamicEnum = PM<string>;

export const enu = () => ({}) as DynamicEnum;

export type P<T>
    = T extends (infer A)[] ? readonly A[]
    : T extends Record<infer K, unknown> ? {readonly [k in K]: T[k]}
    : never;

export type GuessHigherKind<T> = {
    readonly [K in keyof T]: T[K] extends number ? T[K][] : T[K]
};

export type Override<T, O>
    = Omit<T, keyof O>
    & O;

export const def0 = option.getOrElse(() => 0);

export const reduceKV = flow(
    <T extends Record<string, any>>
    (k: keyof T) => reduce<T, PM<T>>({}, (kvs, kv) => {
        kvs[kv[k]] = kv;
        return kvs;
    }),
);

export const reduceKVs = flow(
    <T extends Record<string, any>>
    (k: keyof T) => reduce({} as PM<T[]>, (kvs, kv: T) => {
        kvs[kv[k]] ??= [];
        kvs[kv[k]].push(kv);
        return kvs;
    }),
);
