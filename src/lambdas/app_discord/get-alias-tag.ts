import {DFFP_CLANS_ALIAS} from '#src/lambdas/temp-constants.ts';
import type {CID} from '#src/data/types.ts';

export const getAliasTag = (cid?: CID): CID => {
    if (!cid) {
        return '#2GR2G0PGG';
    }

    const alias = cid.replaceAll(' ', '').toLowerCase();

    return alias in DFFP_CLANS_ALIAS
        ? DFFP_CLANS_ALIAS[alias as keyof typeof DFFP_CLANS_ALIAS]
        : alias;
};