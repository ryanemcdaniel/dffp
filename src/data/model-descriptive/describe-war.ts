import type {OptimizedWar} from '#src/data/pipeline/optimize-types.ts';
import type {CID} from '#src/data/types.ts';
import {pipe} from 'fp-ts/function';
import {toValuesKV} from '#src/data/pure-kv.ts';
import {filterL} from '#src/data/pure-list.ts';

export const describeWar = (criteria: CID) => (war: OptimizedWar) => {
    const [clan] = pipe(war.clans, toValuesKV, filterL((c) => c.data.cid === criteria));
};
