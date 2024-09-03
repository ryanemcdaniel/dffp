import {ApplicationCommandOptionType, ApplicationCommandType} from 'discord-api-types/v10';
import type {RESTPostAPIApplicationCommandsJSONBody} from 'discord-api-types/v10';

export type CommandConfig = typeof COMMANDS[keyof typeof COMMANDS];

export const COMMANDS = {

    WAR_LINK: {
        type       : ApplicationCommandType.ChatInput,
        name       : 'war-links',
        description: 'get player profile links of enemy top #10 for scouting',
        options    : [{
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        }],
    },

    WAR_OPPONENT: {
        type       : ApplicationCommandType.ChatInput,
        name       : 'war-opponent',
        description: 'our clan vs. enemy clan hit/def rates',
        options    : [{
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        }, {
            type       : ApplicationCommandOptionType.Integer,
            name       : 'from',
            description: 'starting war rank (def: 1)',
        }, {
            type       : ApplicationCommandOptionType.Integer,
            name       : 'to',
            description: 'ending war rank (def: # of bases in current war)',
        }],
    } as const,

    WAR_SCOUT: {
        type       : ApplicationCommandType.ChatInput,
        name       : 'war-scout',
        description: 'find enemy 3 star hit rates, defense rates, offense levels, and base links',
        options    : [{
            type       : ApplicationCommandOptionType.String,
            name       : 'clan',
            description: 'tag or alias (ex. #2GR2G0PGG, main, labs, ctd, ...)',
            required   : true,
        }, {
            type       : ApplicationCommandOptionType.Integer,
            name       : 'from',
            description: 'starting war rank (def: 1)',
        }, {
            type       : ApplicationCommandOptionType.Integer,
            name       : 'to',
            description: 'ending war rank (def: # of bases in current war)',
        }],
    } as const,

} as const satisfies {[k in string]: RESTPostAPIApplicationCommandsJSONBody};
