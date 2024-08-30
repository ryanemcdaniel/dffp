import {flow, pipe} from 'fp-ts/function';
import type {CK_War, CK_Clan} from '#src/clashking/types.ts';
import {flatMap, map} from 'fp-ts/Array';
import {dffp} from '#src/data/ingest/df-fp.ts';
import type {Ingest, IngestWarHits, IngestWarPlayers} from '#src/data/ingest/ingest.ts';
import type {FromWar} from '#src/data/ingest/from-war.ts';

export const fromCkWarPlayer: IngestWarPlayers<CK_Clan> = (c) => pipe(
    c.members,
    map(dffp),
    map((m) => ({
        _id : m._id,
        _tm : m._tm,
        id  : '',
        time: '',
        pid : m.tag,
        cid : c.tag,
        name: c.name,
        th  : m.townhallLevel,
        pos : m.mapPosition,
        atks: m.attacks?.length ?? 0,
        defs: m.opponentAttacks,
    })),
);

export const fromCkHit: IngestWarHits<CK_Clan> = (c1, c2) => pipe(
    c1.members,
    flatMap((m) => m.attacks ?? []),
    map(dffp),
    map((a) => ({
        _id     : a._id,
        _tm     : a._tm,
        id      : '',
        time    : '',
        order   : a.order,
        atkr_pid: a.attackerTag,
        atkr_cid: c1.tag,
        defn_pid: a.defenderTag,
        defn_cid: c2.tag,
        stars   : a.stars,
        damage  : a.destructionPercentage,
        duration: a.duration,
    })),
);

export const fromCkWar: Ingest<CK_War, FromWar> = flow(dffp, (w) => ({
    _id        : w._id,
    _tm        : w._tm,
    id         : '',
    time       : '',
    state      : w.state,
    rules_prep : w.preparationStartTime,
    rules_start: w.startTime,
    rules_end  : w.endTime,
    rules_team : w.teamSize,
    rules_atks : w.attacksPerMember,
    clans      : pipe(
        [w.clan, w.opponent],
        map((c: CK_Clan) => ({
            id  : c.tag,
            name: c.name,
            lvl : c.clanLevel,
        })),
        map(dffp),
    ),
    players: [...fromCkWarPlayer(w.clan), ...fromCkWarPlayer(w.opponent)],
    hits   : [...fromCkHit(w.clan, w.opponent), ...fromCkHit(w.opponent, w.clan)],
}));
