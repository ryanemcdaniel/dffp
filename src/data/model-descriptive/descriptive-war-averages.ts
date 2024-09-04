import type {OptimizedHit, GraphModel} from '#src/data/pipeline/optimize-types.ts';
import {pipe} from 'fp-ts/function';
import type {IDKV} from '#src/data/types.ts';
import {reduceRec} from '#src/data/pure-kv.ts';

const averageTimeSkew = (hits: IDKV<OptimizedHit>) => pipe(
    hits,
    reduceRec(),
);

export const descriptiveWarAverages = (cid: string, model: GraphModel) => {

};
