import type {int, isodate, unixdate} from '#src/data/types-pure.ts';
import type {_Model, CID, IGNAME, PID} from '#src/data/types.ts';

export type DispatchedWar =
    & _Model
    & {
        rules_size : int;
        rules_atks : int;
        rules_prep : isodate;
        rules_start: isodate;
        rules_end  : isodate;
        clans      : DispatchedClan[];
        players    : DispatchedPlayer[];
        hits       : DispatchedHit[];
    };

export type DispatchedClan =
    & _Model
    & {
        cid  : CID;
        name : IGNAME;
        level: int;
    };

export type DispatchedPlayer =
    & _Model
    & {
        pid   : PID;
        name  : IGNAME;
        pos   : int;
        th_lvl: int;
    };

export type DispatchedHit =
    & _Model
    & {
        a_pid   : PID;
        d_pid   : PID;
        order   : int;
        stars   : int;
        dmg_prct: int;
        duration: int;
    };
