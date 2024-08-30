import type {P} from '#src/pure/pure.ts';
import type {CK_Clan} from '#src/clashking/types.ts';

export type Clan = P<{
    cid: string;
    nm : string;
    cl : number;
}>;

export const clanCK = (c: CK_Clan): Clan => ({
    cid: c.tag,
    nm : c.name,
    cl : c.clanLevel,
});
