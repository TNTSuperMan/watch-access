export type Func<Args extends Array<unknown>, Return extends unknown, This extends unknown> = (this: This, ...args: Args) => Return;
export type FunctionReporter<Args extends Array<unknown>, Return extends unknown, This extends unknown>
    = (target: Func<Args, Return, This>, ret: Return, ...args: Args)=>void;

export const createWrappedStrictFunction = <Args extends Array<unknown>, Return extends unknown, This extends unknown>
    (target: Func<Args, Return, This>,
        report: FunctionReporter<Args, Return, This> ):
        Func<Args, Return, This> => {
    
    const Wrapped: Func<Args, Return, This> = function(...args){
        const res = target.call(this, ...args)
        report(target, res, ...args);
        return res;
    }
    return Wrapped;
}

export const createWrappedAnyFunction = <T extends Function>
        (target: T, report: (target: T, ...args: any[]) => void) => 
    function(this: any, ...args: any[]){
        const res = target.call(this, ...args)
        report(target, res, ...args);
        return res;
    }
