export type ObjectReporter = (prop: PropertyKey, value: unknown, set: boolean)=>void;

type ObjectWatchOptions = {
    isShallow?: boolean,
    doWatchOnReporter?: boolean
}

export const createProxy = <T extends object>
    (target: T, report: ObjectReporter, options?: ObjectWatchOptions): T => {
    
    const createChildProxy = <T extends object>(target: T, prop: PropertyKey):T =>
        createProxy(target,
            (cp,cv,cs)=>report(prop.toString()+"."+cp.toString(), cv, cs), options);
    
    const proxied: PropertyKey[] = [];
    
    return new Proxy(target, {
        get(t,p,r) {
            let value: unknown = Reflect.get(t,p,r);
            if(!options?.isShallow && typeof value == "object" && value && !proxied.includes(p)){
                value = createChildProxy(value, p);
                Reflect.set(t,p,value,r);
                proxied.push(p);
            }
            report(p, value, false);
            return value;
        },
        set(t,p,v,r){
            report(p, v, true);
            if(!options?.isShallow && typeof v == "object" && v){
                return Reflect.set(t,p,createChildProxy(v, p),r);
            }else{
                return Reflect.set(t,p,v,r);
            }
        }
    })
}