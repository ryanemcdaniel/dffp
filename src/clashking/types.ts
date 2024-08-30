export interface CK_BasicWar {
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
    preparationStartTime: string;
    startTime           : string;
    endTime             : string;
    clan: {
        tag                  : string;
        name                 : string;
        clanLevel            : number;
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
        clanLevel            : number;
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

export type CK_Clan = CK_War['clan'];
export type CK_Member = CK_War['clan']['members'][number];
export type CK_Hit = Required<CK_War['clan']['members'][number]>['attacks'][number];
