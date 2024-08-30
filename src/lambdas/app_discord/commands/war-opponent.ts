import {callClashKing} from '#src/api/clash-king.ts';
import {DFFP_CLANS} from '#src/lambdas/temp-constants.ts';
import {show} from '../../../../util.ts';

type CKWars = {
    state               : string;
    teamSize            : number;
    attacksPerMember    : 0 | 1;
    preparationStartTime: string;
    startTime           : string;
    endTime             : string;
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
}[];

export const warOpponent = async () => {
    const currentWar = await callClashKing<{clans: string[]}>({
        method: 'GET',
        path  : `/war/${encodeURIComponent(DFFP_CLANS[0])}/basic`,
    });

    const [opponent] = currentWar.contents.clans.filter((c) => c !== DFFP_CLANS[0]);

    const previous = await callClashKing<CKWars>({
        method: 'GET',
        path  : `/war/${encodeURIComponent(opponent)}/previous`,
        query : {
            timestamp_start: 0,
            timestamp_end  : 9999999999,
            limit          : 10,
        },
    });

    show(previous.contents.map((cw) => {
        const [current, vs] = cw.clan.tag === opponent
            ? [cw.clan, cw.opponent]
            : [cw.opponent, cw.clan];

        return {
            size           : cw.teamSize,
            current_stars  : current.stars,
            current_attacks: current.members
                .reduce((acc, m) => {
                    m.attacks.forEach((a) => {
                        acc.push({
                            order  : a.order,
                            att_tag: m.tag,
                            att_pos: m.mapPosition,
                            def_tag: a.defenderTag,
                            stars  : a.stars,
                            dmg    : a.destructionPercentage,
                            dur    : a.duration,
                        });
                    });

                    return acc;
                }, [])
                .sort((a, b) => a.order - b.order),

            vs_stars  : vs.stars,
            vs_attacks: vs.members
                .reduce((acc, m) => {
                    m.attacks.forEach((a) => {
                        acc.push({
                            order  : a.order,
                            att_tag: m.tag,
                            att_pos: m.mapPosition,
                            def_tag: a.defenderTag,
                            stars  : a.stars,
                            dmg    : a.destructionPercentage,
                            dur    : a.duration,
                        });
                    });

                    return acc;
                }, [])
                .sort((a, b) => a.order - b.order),
        };
    }));
};
