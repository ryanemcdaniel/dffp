import type {CK_War, CK_War_Clan} from '#src/api/clash-king.ts';
import type {DispatchedClan, DispatchedHit, DispatchedPlayer, DispatchedWar} from '#src/data/dispatch/dispatch-types.ts';
import {pipe} from 'fp-ts/function';
import {map, flatMap} from 'fp-ts/Array';
import {attachModelId} from '#src/data/types.ts';

const dispatchCkWarPlayer = (clan: CK_War_Clan): DispatchedPlayer[] => pipe(
    clan.members,
    map((m) => attachModelId({
        pid   : m.tag,
        name  : m.name,
        pos   : m.mapPosition,
        th_lvl: m.townhallLevel,
    })),
);

const dispatchCkWarHits = (clan: CK_War_Clan): DispatchedHit[] => pipe(
    clan.members,
    flatMap((m) => m.attacks ?? []),
    map((a) => attachModelId({
        a_pid   : a.attackerTag,
        d_pid   : a.defenderTag,
        order   : a.order,
        stars   : a.stars,
        dmg_prct: a.destructionPercentage,
        duration: a.duration,
    })),
);

const dispatchCkWarClan = (clan: CK_War_Clan): DispatchedClan => attachModelId({
    cid  : clan.name,
    name : clan.name,
    level: clan.clanLevel,
});

export const dispatchCkWar = (war: CK_War): DispatchedWar => attachModelId({
    rules_size : war.teamSize,
    rules_atks : war.attacksPerMember,
    rules_prep : war.preparationStartTime,
    rules_start: war.startTime,
    rules_end  : war.endTime,
    clans      : pipe([war.clan, war.opponent], map(dispatchCkWarClan)),
    players    : pipe([war.clan, war.opponent], flatMap(dispatchCkWarPlayer)),
    hits       : pipe([war.clan, war.opponent], flatMap(dispatchCkWarHits)),
});
