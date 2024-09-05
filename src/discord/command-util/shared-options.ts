import type {bool, int} from '#src/data/types-pure.ts';
import type {CID} from '#src/data/types.ts';
import {getAliasTag} from '#src/discord/command-util/get-alias-tag.ts';
import {
    getExhaustive,
    getFrom,
    getLimit,
    getNShow,
    getPlayerInfo,
    getTo,
} from '#src/discord/command-util/default-options.ts';

export type SharedOptions = {
    cid1 : CID;
    cid2?: CID;

    limit: int;
    from : int;
    to   : int;

    showCurrent: bool;
    showN      : bool;
    exhaustive : bool;
};

export const getSharedOptions = (body): SharedOptions => ({
    cid1       : getAliasTag(body.data.options.clan),
    limit      : getLimit(body),
    from       : getFrom(body),
    to         : getTo(body),
    showCurrent: getPlayerInfo(body),
    showN      : getNShow(body),
    exhaustive : getExhaustive(body),
});
