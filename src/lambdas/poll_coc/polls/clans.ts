import {api_coc} from '#src/lambdas/client-api-coc.ts';

export const pollClans = async (tags: string[]) => {
    const clans = await api_coc.getClans(tags);

    await Promise.all(clans.map(async (clan) => {
        clan.
    }));
};
