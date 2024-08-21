import {SSMClient} from '@aws-sdk/client-ssm';

export const tryJson = (body) => {
    try {
        if (!body) {
            return {};
        }
        return JSON.parse(body);
    }
    catch (e) {
        console.error(e);
        return {};
    }
};
