import type {_DFFP} from '#src/data/ingest/df-fp.ts';
import type {FromHit} from '#src/data/ingest/from-hit.ts';
import type {FromClan} from '#src/data/ingest/from-clan.ts';
import type {FromClanWarPlayer} from '#src/data/ingest/from-player.ts';

export type FromWar
    = _DFFP
    & {
        id         : string;
        time       : string;
        rules_prep : string;
        rules_start: string;
        rules_end  : string;
        rules_team : number;
        rules_atks : number;
        clans      : FromClan[];
        players    : FromClanWarPlayer[];
        hits       : FromHit[];
    };

export type FromClanWarLeagueWar
    = _DFFP
    & FromWar
    & {

    };

export type FromClanWarLeague
    = _DFFP
    & FromWar
    & {

    };
