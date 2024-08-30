import type {CK_War} from '#src/clashking/types.ts';
import {flow} from 'fp-ts/function';
import type {FromClanWarPlayer} from '#src/data/ingest/from-player.ts';
import type {FromWar} from '#src/data/ingest/from-war.ts';
import type {FromHit} from '#src/data/ingest/from-hit.ts';
import type {_DFFP} from '#src/data/ingest/df-fp.ts';

export type CID = string;

export type PID = string;

export type Ingest<A, B> = (a: A) => B;

export type IngestWarPlayers<A> = (a: A) => FromClanWarPlayer[];
export type IngestWarHits<A> = (a1: A, a2: A) => FromHit[];
export type IngestWar<A> = (a: A) => FromWar;

export const ingestWarId = flow((c1: CID, c2: CID) => `${c1}:${c2}`);
export const ingestPLayerId = flow((c1: CID, p1: PID) => `${c1}:${p1}`);
export const ingestHitId = flow((c1: CID, c2: CID, p1: PID, p2: PID) => `${c1}:${c2}:${p1}:${p2}`);
