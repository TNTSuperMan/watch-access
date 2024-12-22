import { expect, it } from "bun:test";
import { watchObj } from "../src"

const createObject = <T extends object>(obj: T, isShallow?: boolean):[[PropertyKey, unknown, boolean][], T] => {
    const records: [PropertyKey, unknown, boolean][] = [];
    const proxy = watchObj(obj, (...args)=>records.push(args),{isShallow});
    return [records, proxy];
}
it("Get primitive", ()=>{
    const [r,o] = createObject({value: 1})
    o.value;
    expect(r.length).toBe(1);
    expect(r[0][0]).toBe("value");
    expect(r[0][1]).toBe(1);
    expect(r[0][2]).toBe(false);
    expect(o.value).toBe(1);
})
it("Set primitive", ()=>{
    const [r,o] = createObject({value: 1})
    o.value = 2;
    expect(r.length).toBe(1);
    expect(r[0][0]).toBe("value");
    expect(r[0][1]).toBe(2);
    expect(r[0][2]).toBe(true);
    expect(o.value).toBe(2);
})
it("Get shallow object", ()=>{
    const [r,o] = createObject({value: {value: 1}}, true)
    o.value.value;
    expect(r.length).toBe(1);
    expect(r[0][0]).toBe("value");
    expect(Object.entries(r[0][1] ?? {})[0][0]).toBe("value");
    expect(Object.entries(r[0][1] ?? {})[0][1]).toBe(1);
    expect(r[0][2]).toBe(false);

    expect(o.value.value).toBe(1);
})
it("Set shallow object", ()=>{
    const [r,o] = createObject({value: {value: 1}}, true)
    o.value.value = 2;
    expect(r.length).toBe(1);
    expect(r[0][0]).toBe("value");
    expect(r[0][2]).toBe(false);

    expect(o.value.value).toBe(2);
})
it("Get deep object", ()=>{
    const [r,o] = createObject({value: {value: 1}})
    o.value.value;
    expect(r.length).toBe(2);
    expect(r[0][0]).toBe("value");
    expect(r[0][2]).toBe(false);
    expect(r[1][0]).toBe("value.value");
    expect(r[1][2]).toBe(false);

    expect(o.value.value).toBe(1);
})
it("Set deep object", ()=>{
    const [r,o] = createObject({value: {value: 1}})
    o.value.value = 2;
    expect(r.length).toBe(2);
    expect(r[0][0]).toBe("value");
    expect(r[0][2]).toBe(false);
    expect(r[1][0]).toBe("value.value");
    expect(r[1][2]).toBe(true);

    expect(o.value.value).toBe(2);
})

