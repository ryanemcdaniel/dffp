import type {Boom} from '@hapi/boom';

export const abortCmd = <D>(
    condition: boolean,
    boomfn: (messageOrError?: string | Error, data?: D) => Boom<D>,
    messageOrError?: string,
    data?: D,
): void => {
    if (condition) {
        throw boomfn(messageOrError, data);
    }
};
