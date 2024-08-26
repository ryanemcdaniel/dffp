import {callClashKing} from '#src/clashking/api/base.ts';

interface CK_BasicWar {
    clans: string[];
}

export interface CK_War {
    // status_code         : number;
    // timestamp           : number;
    // _response_retry     : number;
    // battleModifier      : string;
    state               : string;
    teamSize            : number;
    attacksPerMember    : number;
    preparationStartTime: Date;
    startTime           : Date;
    endTime             : Date;
    clan: {
        tag                  : string;
        name                 : string;
        clanLevel            : string;
        attacks              : number;
        stars                : number;
        destructionPercentage: number;
        members: {
            tag                : string;
            name               : string;
            townhallLevel      : number;
            mapPosition        : number;
            opponentAttacks    : number;
            bestOpponentAttack?: {
                attackerTag          : string;
                defenderTag          : string;
                stars                : number;
                destructionPercentage: number;
                order                : number;
                duration             : number;
            };
            attacks?: {
                attackerTag          : string;
                defenderTag          : string;
                stars                : number;
                destructionPercentage: number;
                order                : number;
                duration             : number;
            }[];
        }[];
    };
    opponent: {
        tag                  : string;
        name                 : string;
        clanLevel            : string;
        attacks              : number;
        stars                : number;
        destructionPercentage: number;
        members: {
            tag                : string;
            name               : string;
            townhallLevel      : number;
            mapPosition        : number;
            opponentAttacks    : number;
            bestOpponentAttack?: {
                attackerTag          : string;
                defenderTag          : string;
                stars                : number;
                destructionPercentage: number;
                order                : number;
                duration             : number;
            };
            attacks?: {
                attackerTag          : string;
                defenderTag          : string;
                stars                : number;
                destructionPercentage: number;
                order                : number;
                duration             : number;
            }[];
        }[];
    };
};

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
        limit          : 10,
    },
});
