import type {_DFFP} from '#src/data/ingest/df-fp.ts';

export type FromClan
    = _DFFP
    & {
        id  : string;
        name: string;
        lvl : number;
    };

export type FromFullClan
    = _DFFP
    & {
        id  : string;
        name: string;
        lvl : number;
    };

export type FromWarClan
    = _DFFP
    & FromClan
    & {
        stars: number;
    };

export type FromClanWarLeagueClan
    = _DFFP
    & FromClan
    & FromWarClan
    & {

    };
