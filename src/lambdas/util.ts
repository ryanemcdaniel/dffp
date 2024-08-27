import * as console from 'node:console';
import {parse} from '@hapi/bourne';

export const tryJson = <T>(body: T): T => {
    try {
        return parse(body as string) as T;
    }
    catch (e) {
        console.error(e);
        return {} as T;
    }
};
