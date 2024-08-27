import {callClashKing} from '#src/clashking/api/base.ts';
import type {CK_BasicWar, CK_War} from '#src/clashking/types.ts';

export const ck_getCurrentWar = async (clan: string) => await callClashKing<CK_BasicWar>({
    method: 'GET',
    path  : `/war/${encodeURIComponent(clan)}/basic`,
});

export const ck_getPreviousWars = async (clan: string) => await callClashKing<CK_War[]>({
    method: 'GET',
    path  : `/war/${encodeURIComponent(clan)}/previous`,
    query : {
        timestamp_start: 0,
        timestamp_end  : 9999999999,
        limit          : 20,
    },
    show: false,
});
