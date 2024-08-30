import {flow} from 'fp-ts/function';
import type {FromWar} from '#src/data/ingest/from-war.ts';
import type {Override, PM} from '#src/pure/pure.ts';
import type {FromHit} from '#src/data/ingest/from-hit.ts';
import type {FromClanWarPlayer} from '#src/data/ingest/from-player.ts';

export type RefinedHit = Override<FromHit, {
    war_id      : string;
    atkr_clan_id: string;
    atkr_th     : number;
    atkr_pos    : number;
    defn_clan_id: string;
    defn_th     : number;
    defn_pos    : number;
}>;

export type RefinedWar = Override<FromWar, {
    players_mirrors: [FromClanWarPlayer[], FromClanWarPlayer[]];
    players_by_tag : PM<FromClanWarPlayer>;
    atks_by_player : PM<RefinedHit>;
    defs_by_player : PM<RefinedHit>;
}>;

export const refineWar = flow((w: FromWar) => {
    const [];

    return {
        ...w,

    } satisfies RefinedWar;
});
