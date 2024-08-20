import {AssetURL, ClanTag, ISOTimeStamp, PlayerTag, RecordKey, TownHallLevel, WarRank, ZipIndex} from './types';
import {Player} from './types.player';

interface Hash {
    clan: ClanTag;
}

interface Range {
    timestamp: ISOTimeStamp;
}

type WarKey = RecordKey<Hash, Range>;

interface WarRecord extends WarKey {
    clan                 : ClanTag;
    clan_name            : string;
    clan_badge           : AssetURL;
    clan_player_ids      : ZipIndex<WarRank, PlayerTag>;
    clan_player_snapshots: ({
        rank: WarRank;
    } & Player)[];

    enemy                 : ClanTag;
    enemy_name            : string;
    enemy_badge           : AssetURL;
    enemy_player_ids      : PlayerTag[];
    enemy_player_snapshots: ({
        rank: WarRank;
    } & Player)[];

    rules: {
        type : 'regular' | 'cwl' | 'friendly';
        size : number; // # vs. #
        hits : 1 | 2;
        prep : ISOTimeStamp;
        start: ISOTimeStamp;
        end  : ISOTimeStamp;
    };

    clan_stars: number;
    clan_prct : number;
    clan_time : number;

    enemy_stars: number;
    enemy_prct : number;
    enemy_time : number;
}
