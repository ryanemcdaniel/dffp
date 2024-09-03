import type {n_bool, num} from '#src/data/types-pure.ts';
import type {DispatchedClan, DispatchedHit, DispatchedPlayer, DispatchedWar} from '#src/data/ingest/ingest-types.ts';
import type {UUID} from '#src/data/types.ts';

export type DerivedWar =
    & DispatchedWar
    & {
        clans: (DispatchedClan & {
            _id_war: UUID;
        })[];
        players: (DispatchedPlayer & {
            _id_war : UUID;
            _id_clan: UUID;
        })[];
        hits: (DispatchedHit & {
            _id_war          : UUID;
            _id_attacker     : UUID;
            _id_attacker_clan: UUID;
            _id_defender     : UUID;
            _id_defender_clan: UUID;
            order_norm       : num;
            ore0             : n_bool; // all hits after are an ore hit
            ore1             : n_bool; // is current hit an ore hit
            ccre             : n_bool; // is current hit a cc reveal
        })[];
    };

export type DerivedHit = DerivedWar['hits'][number];
export type DerivedClan = DerivedWar['clans'][number];
export type DerivedPlayer = DerivedWar['players'][number];
