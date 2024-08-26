import {badRequest} from '@hapi/boom';

export const DISCORD_PING = {type: 1};
export const DISCORD_PONG = {type: 1};

export const tryBody = (body?: string | null) => {
    try {
        if (!body) {
            return {};
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(body);
    }
    catch (e) {
        throw badRequest('unparsable json');
    }
};

export const respond = (statusCode: number, body: object) => ({
    statusCode,
    body: JSON.stringify(body),
});
