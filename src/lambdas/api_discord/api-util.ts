import {badRequest} from '@hapi/boom';
import {parse} from '@hapi/bourne';

export const tryBody = <T>(body?: string | null | T): T => {
    try {
        if (!body) {
            throw badRequest('no body');
        }

        return parse(body as string) as T;
    }
    catch (e) {
        throw badRequest(e as Error);
    }
};

export const respond = ({status, body}: {status: number; body: object}) => ({
    statusCode: status,
    body      : JSON.stringify(body),
});
