import {bindApiCall} from '#src/api/api-call.ts';
import type {int, isodate, unixdate, url} from '#src/data/types-pure.ts';

export const callClashKing = bindApiCall('https://api.clashking.xyz');

export type CK_War_Member = {
    tag               : string;
    name              : string;
    townhallLevel     : int;
    mapPosition       : int;
    attacks?          : CK_War_Hit[];
    opponentAttacks   : 1;
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
    state               : 'warEnded';
    teamSize            : int;
    attacksPerMember    : int;
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
    path  : `/war/${encodeURIComponent(tag)}/previous?timestamp_start=0&timestamp_end=9999999999&limit=100`,
});
