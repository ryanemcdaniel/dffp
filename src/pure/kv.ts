import {flow} from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import {filter} from 'fp-ts/Array';

export type AnyKV = {[k in any]: any};

export type KV<A extends AnyKV = AnyKV> = {[k in keyof A]: A[k]};

export const kvUnsetFalsey = <A extends KV>(kv: A): A =>
    pipe(
        kv,
        Object.entries,
        filter(([,v]) => Boolean(v)),
        Object.fromEntries,
    ) as A;

export const addConstKV = <A extends KV, B extends KV >(a: A) => (b: B) => ({...a, ...b});

export const addKV = <A extends KV, B extends KV >(fa: () => A) => (b: B) => ({...fa(), ...b});

export const removeKV = <T extends KV>(k: keyof T) => (kv: T) => {
    const {[k]: _, ...rest} = kv;

    return rest;
};
