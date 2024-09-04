import type {int, isodate, unixdate, url} from '#src/data/types-pure.ts';
import {callClashKing, CK_LIMIT} from '#src/data/api/api-ck.ts';

export type CK_War_Member = {
    tag               : string;
    name              : string;
    townhallLevel     : int;
    mapPosition       : int;
    attacks?          : CK_War_Hit[];
    opponentAttacks   : int;
    bestOpponentAttack: CK_War_Hit;
};

export type CK_War_Clan = {
    tag      : string;
    name     : string;
    badgeUrls: {
        small : url;
        large : url;
        medium: url;
    };
    clanLevel            : int;
    attacks              : int;
    stars                : int;
    destructionPercentage: int;
    members              : CK_War_Member[];
};

export type CK_War_Hit = {
    attackerTag          : string;
    defenderTag          : string;
    stars                : int;
    destructionPercentage: int;
    order                : int;
    duration             : int;
};

export type CK_War = {
    state               : string;
    teamSize            : int;
    attacksPerMember?   : int;
    battleModifier      : string;
    preparationStartTime: isodate;
    startTime           : isodate;
    endTime             : isodate;
    status_code         : int;
    timestamp           : unixdate;
    _response_retry     : 120;
    clan                : CK_War_Clan;
    opponent            : CK_War_Clan;
};

export const callPreviousWars = async (tag: string) => await callClashKing<CK_War[]>({
    method: 'GET',
    path  : `/war/${encodeURIComponent(tag)}/previous`,
    query : {
        timestamp_start: 0,
        timestamp_end  : 9999999999,
        limit          : CK_LIMIT,
    },
});

export const callCkWarsByClan = async (cids: string[]): Promise<CK_War[]> => {
    const wars = [] as CK_War[];

    for (const cid of cids) {
        wars.push(...(await callPreviousWars(cid)).contents);
    }

    return wars;
};
