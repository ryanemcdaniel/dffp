import type {OptimizedHit} from '#src/data/pipeline/optimize-types.ts';
import {pipe} from 'fp-ts/function';
import {mapL} from '#src/data/pure-list.ts';

export const describeHits = (hits: OptimizedHit[]) => {
    pipe(
        hits,
        mapL());
};
