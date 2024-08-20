import {PlayerTag, TownHallLevel} from './types';

export interface PlayerSnapshot {
    id  : PlayerTag;
    name: string;
    th  : TownHallLevel;

    h_bk: number;
    h_aq: number;
    h_gw: number;
    h_rc: number;

    e_gg : number;
    e_sb : number;
    e_eqb: number;
    e_vs : number;
    e_bpu: number;
    e_rv : number;
    e_ga : number;
    e_hpu: number;
    e_iv : number;
    e_mm : number;
    e_fa : number;
    e_apu: number;
    e_fb : number;
    e_et : number;
    e_ht : number;
    e_lg : number;
    e_rg : number;
    e_ss : number;
    e_hv : number;
    e_hog: number;
    e_rs : number;

    p_la: number;
    p_eo: number;
    p_my: number;
    p_u : number;
    p_f : number;
    p_pl: number;
    p_d : number;
    p_p : number;
    p_sf: number;
    p_aj: number;

    t_barb  : number;
    t_arch  : number;
    t_giant : number;
    t_gob   : number;
    t_wb    : number;
    t_loon  : number;
    t_wiz   : number;
    t_heal  : number;
    t_drag  : number;
    t_pekka : number;
    t_bdrag : number;
    t_miner : number;
    t_edrag : number;
    t_yeti  : number;
    t_drider: number;
    t_etitan: number;
    t_rrider: number;
    t_minion: number;
    t_hrider: number;
    t_valk  : number;
    t_golem : number;
    t_witch : number;
    t_hound : number;
    t_bowler: number;
    t_ig    : number;
    t_hh    : number;
    t_aw    : number;
    t_druid : number;

    s_zap   : number;
    s_heal  : number;
    s_rage  : number;
    s_jump  : number;
    s_freeze: number;
    s_clone : number;
    s_invis : number;
    s_recall: number;
    s_poison: number;
    s_eq    : number;
    s_haste : number;
    s_skelly: number;
    s_bat   : number;
    s_og    : number;

    s_ww: number;
    s_bb: number;
    s_ss: number;
    s_sb: number;
    s_ll: number;
    s_ff: number;
    s_bd: number;

    achievements: {
        // todo
    };
}
