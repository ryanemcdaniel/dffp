import type {n_bool, P} from '#src/model/pure.ts';
import type {CK_Hit} from '#src/clashking/types.ts';
import {flow} from 'fp-ts/function';
import {partition, foldMap} from 'fp-ts/Array';
import type {Lattice} from 'fp-ts/Lattice';
import type {JoinSemilattice} from 'fp-ts/JoinSemilattice';

export type Hit = P<{
    a_pid : string; // attacker
    a_cid : string;
    a_thl : number;
    a_pos : number;
    d_pid : string; // defender
    d_cid : string;
    d_thl : number;
    d_pos : number;
    h_ord : number; // hit stats
    h_str : number;
    h_dmg : number;
    h_dur : number;
    c_ore0: n_bool; // 3* success, all hits after are ore hits
    c_ore1: n_bool; // ore hit
    c_ccre: n_bool; // cc reveal hit
    c_thld: number; // th lvl difference
    c_posd: number; // war position difference
    c_hnum: number;
}>;

export const hitCK = (h: CK_Hit) => ({

});

export const partitionHitsDefenses = flow((tag: string) => partition((h: Hit) => h.a_cid === tag));
