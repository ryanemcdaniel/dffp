import {
    map as mapL,
    mapWithIndex as mapIdxL,
    flatMap as flatMapL,
    flatten as flattenL,
    filter as filterL,
    filterWithIndex as filterIdxL,
    reduce as reduceL,
    reduceWithIndex as reduceIdxL,
} from 'fp-ts/Array';
import type {num} from '#src/data/types-pure.ts';

export {
    mapL,
    mapIdxL,
    flatMapL,
    flattenL,
    filterL,
    filterIdxL,
    reduceL,
    reduceIdxL,
};

export const numL = () => [] as num[];
