import type {_DFFP} from '#src/data/ingest/df-fp.ts';
import type {Override} from '#src/pure/pure.ts';
import type {FromHit} from '#src/data/ingest/from-hit.ts';
import type {KV} from '#src/pure/kv.ts';
import type {FromClan} from '#src/data/ingest/from-clan.ts';
import type {FromPlayer} from '#src/data/ingest/from-player.ts';
import type {FromWar} from '#src/data/ingest/from-war.ts';

type Graph<V, E = string> = Record<E, V>;

type Vertex<V, E> = {
    node: V;
    edge: E;
};

type ClanModel = {
    data    : FromClan;
    wars    : Graph<WarModel>;
    players : Graph<PlayerModel>;
    attacks : Graph<HitModel>;
    defenses: Graph<HitModel>;

};

type WarModel = {
    data    : FromWar;
    clans   : Graph<ClanModel>;
    players : Graph<PlayerModel>;
    attacks : Graph<HitModel>;
    defenses: Graph<HitModel>;
};

type PlayerModel = {
    data    : FromPlayer;
    next    : PlayerModel;
    previous: PlayerModel;
    clan    : ClanModel;
    clans   : Graph<ClanModel>;
    attacks : Graph<HitModel>;
    defenses: Graph<HitModel>;
};

type HitModel = {
    data         : FromHit;
    next         : HitModel;
    previous     : HitModel;
    attacker     : PlayerModel;
    attacker_clan: ClanModel;
    defender     : PlayerModel;
    defender_clan: ClanModel;
    war          : WarModel;
};

export type WarGraphModel
    = _DFFP
    & {
        hits: HitModel[];
    };
