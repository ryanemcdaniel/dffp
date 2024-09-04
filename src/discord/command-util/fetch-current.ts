import {getAliasTag} from '#src/discord/command-util/get-alias-tag.ts';
import {api_coc} from '#src/lambdas/client-api-coc.ts';
import {notFound} from '@hapi/boom';

export const fetchCurrentClanWar = async (cid?: string) => {
    const clanTag = getAliasTag(cid);
    const war = await api_coc.getCurrentWar(clanTag);

    if (!war) {
        throw notFound('no current war data available');
    }
    if (war.isWarEnded) {
        throw notFound('current war has already ended');
    }

    return war;
};
