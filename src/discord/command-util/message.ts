import {pipe} from 'fp-ts/function';
import {mapL} from '#src/data/pure-list.ts';
import type {num, url} from '#src/data/types-pure.ts';

export const dItlc = (s: string) => `*${s}*`;
export const dBold = (s: string) => `**${s}**`;

export const dHdr1 = (s: string) => `# ${s}`;
export const dHdr2 = (s: string) => `## ${s}`;
export const dHdr3 = (s: string) => `### ${s}`;
export const dSubH = (s: string) => `-# ${s}`;

export const dCode = (s: string) => `\`${s}\``;
export const dCodes = (s: string[]) => pipe(s, mapL(dCode));
export const dCdBk = (s: string) => `\`\`\`${s}\`\`\``;
export const dSubC = (s: string) => `-# ${dCode(s)}`;

export const dLink = (s: string, l: url) => `[${s}](${l})`;

export const dLine = (s: string) => `${s}\n`;
export const dLines = (s: string[]) => pipe(s, mapL(dLine));

export const nIdex = (n: num) => n.toPrecision(2);
export const nPrct = (n: num) => `${(n * 100).toFixed()}%`.padStart(3);
export const nNatr = (n: num) => `${Math.ceil(n)}`;
export const nNatT = (n: num) => `${n}`.padStart(2);

const NA = 'N/A';

export const dNotA = () => `WIP`;
