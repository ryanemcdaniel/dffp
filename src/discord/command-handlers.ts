import {warOpponent} from '#src/discord/commands/war-opponent.ts';
import {warScout} from '#src/discord/commands/war-scout.ts';
import {warLinks} from '#src/discord/commands/war-links.ts';

export const COMMAND_HANDLERS = [
    warLinks,
    warOpponent,
    warScout,
] as const;
