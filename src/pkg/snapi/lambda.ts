import {Context} from "aws-lambda";
import {detectTimeout} from "./detect-timeout";


interface Ctx<C> {
}

interface Trigger<E, R, C> {
    event: E;
    ctx: Ctx<C>;
    aws: Context;
}

interface BindLambda<E, R, C> {
    init: () => Promise<Ctx<C>>
    main: (trigger: Trigger<E, R, C>) => Promise<R>
}


export const bindLambda = <E, R, C>(ops: BindLambda<E, R, C>) => {
    const {init, main} = ops;

    const ctx = init();

    return async (event: E, aws: Context): Promise<R> => {
        await ctx;

        const processing = main({event, ctx, aws})

        try {
            return await detectTimeout(
                processing,
                aws.getRemainingTimeInMillis() - 10000,
            );
        } catch (e) {
            console.error(e);
            return undefined as R;
        }
    }
}