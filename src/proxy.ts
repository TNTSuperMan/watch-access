import { createWrappedAnyFunction } from "./func";

export type ObjectReporter = (prop: string, value: unknown, set: boolean)=>void;

type ObjectWatchOptions = {
    isShallow?: boolean,
    doWatchOnReporter?: boolean,
    _path?: string,
    funcReporter?: (target: Function, path: string, res: any, ...args: any) => void
}

export const createProxy = <T extends object>
    (target: T, report: ObjectReporter, options?: ObjectWatchOptions): T => {
    const path = (options?._path ? options._path + "." : "");
    const createChildProxy = <T extends object>(target: T, prop: PropertyKey):T =>
        createProxy(target,
            (cp,cv,cs)=>report(prop.toString()+"."+cp.toString(), cv, cs), {...options,
                _path: path + prop.toString()});
    
    const proxied: PropertyKey[] = [];
    
    return new Proxy(target, {
        get(t,p,r) {
            let value: unknown = Reflect.get(t,p,r);
            if(!options?.isShallow && typeof value == "object" && value && !proxied.includes(p)){
                value = createChildProxy(value, p);
                Reflect.set(t,p,value,r);
                proxied.push(p);
            }
            report(p.toString(), value, false);
            if(options?.funcReporter && typeof value == "function"){
                return createWrappedAnyFunction(value, (t, r, ...args) =>
                    (options?.funcReporter??(()=>{}))(t, path + p.toString(), r, ...args));
            }else{
                return value;
            }
        },
        set(t,p,v,r){
            report(p.toString(), v, true);
            if(!options?.isShallow && typeof v == "object" && v){
                return Reflect.set(t,p,createChildProxy(v, p),r);
            }else{
                return Reflect.set(t,p,v,r);
            }
        }
    })
}