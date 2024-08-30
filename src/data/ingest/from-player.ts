import type {_DFFP} from '#src/data/ingest/df-fp.ts';
import type {PID} from '#src/data/ingest/ingest.ts';

export type FromPlayer
    = _DFFP
    & {
        id  : string;
        pid : PID;
        name: string;
        th  : number;
    };

export type FromFullPlayer
    = _DFFP
    & FromPlayer
    & {
        cups     : string;
        heroes   : number[];
        equipment: number[];
        troops   : number[];
        spells   : number[];
    };

export type FromClanWarPlayer
    = _DFFP
    & FromPlayer
    & {
        cid : string;
        pos : number;
        atks: number;
    };

export type FromClanWarLeaguePlayer
    = _DFFP
    & FromPlayer
    & {
        stars: number;
    };
