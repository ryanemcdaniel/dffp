import type {
    APIChatInputApplicationCommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    APIApplicationCommandInteractionWrapper,
    ApplicationCommandType,
    APIChatInputApplicationCommandInteractionData,
    APIApplicationCommandInteractionData,
    APIApplicationCommandOption,
    APIApplicationCommandInteractionDataUserOption, APIApplicationCommandInteractionDataSubcommandOption, APIApplicationCommandInteractionDataSubcommandGroupOption,
    APIApplicationCommandInteractionDataBooleanOption,
    APIApplicationCommandInteractionDataChannelOption,
    APIApplicationCommandInteractionDataIntegerOption,
    APIApplicationCommandInteractionDataMentionableOption,
    APIApplicationCommandInteractionDataNumberOption,
    APIApplicationCommandInteractionDataRoleOption,
    APIApplicationCommandInteractionDataStringOption,
    APIApplicationCommandInteractionDataAttachmentOption,
} from 'discord-api-types/v10';
import type {ApplicationCommandOptionType} from 'discord-api-types/v10';
import type {initDiscord} from '#src/discord/api/base.ts';

type Replace<T, U extends string, V> = Omit<T, U> & {[key in U]: V};

type AnyOptions =
    | APIApplicationCommandInteractionDataAttachmentOption
    | APIApplicationCommandInteractionDataBooleanOption
    | APIApplicationCommandInteractionDataChannelOption
    | APIApplicationCommandInteractionDataIntegerOption
    | APIApplicationCommandInteractionDataMentionableOption
    | APIApplicationCommandInteractionDataNumberOption
    | APIApplicationCommandInteractionDataRoleOption
    | APIApplicationCommandInteractionDataStringOption
    | APIApplicationCommandInteractionDataUserOption
    | APIApplicationCommandInteractionDataSubcommandGroupOption
    | APIApplicationCommandInteractionDataSubcommandOption;

type GetOption<T extends ApplicationCommandOptionType> = Extract<AnyOptions, {type: T}>;

export type SpecInput = Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'options'> & {options: APIApplicationCommandOption[]};

export type DiscordCtx = Awaited<ReturnType<typeof initDiscord>> & {auth_token: string};

export type Interaction<T extends SpecInput> = APIApplicationCommandInteractionWrapper<Replace<APIChatInputApplicationCommandInteractionData, 'options', GetOption<T['options'][number]['type']>[]>>;

type CmdHandler<T extends SpecInput> = (
    discord: DiscordCtx,
    interaction: APIApplicationCommandInteractionWrapper<Replace<APIChatInputApplicationCommandInteractionData, 'options', GetOption<T['options'][number]['type']>[]>>,
    ops: {
        [N in T['options'][number]['name']]: Extract<T['options'][number], {name: N}>['required'] extends true
            ? GetOption<Extract<T['options'][number], {name: N}>['type']>
            : GetOption<Extract<T['options'][number], {name: N}>['type']> | undefined
    }
) => Promise<void>;

export type Spec<T extends SpecInput> = {
    deploy: T;
    handle: CmdHandler<T>;
};

export const buildDiscordCommand
    = <T extends SpecInput>(cmd: {deploy: Spec<T>['deploy']; handle: Spec<T>['handle']}): Spec<T> => cmd;

export const buildDiscordCommand2
    = <T extends SpecInput>(deploy: Spec<T>['deploy'], handle: Spec<T>['handle']): Spec<T> => ({deploy, handle});
