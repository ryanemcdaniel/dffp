import type {_DFFP} from '#src/data/ingest/df-fp.ts';

export type FromHit
    = _DFFP
    & {
        id      : string;
        time    : string;
        order   : number;
        atkr_pid: string;
        atkr_cid: string;
        defn_pid: string;
        defn_cid: string;
        stars   : number;
        damage  : number;
        duration: number;
    };
