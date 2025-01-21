# watch-access
オブジェクト・関数の操作等を監視できます。
## warn
- オブジェクトの監視はProxyを使っているため監視対象状態のオブジェクトに直接別のオブジェクトを代入しないでください
- 監視イベント内でvalueにアクセスする場合・以下の例のようにオブジェクトを文字にする場合等にも監視イベントが発生します
- シャローモードで監視すると対象内のオブジェクトの変更を検知できません
- 関数を監視する際に関数の型を維持するためには非常に厳格な型指定が必要です
## install
```bash
$ npm install watch-access
```
## CDN
[ESモジュール用](https://unpkg.com/watch-access/dist/esm.js)
[CommonJS用](https://unpkg.com/watch-access/dist/cjs.js)
[IIFE(HTMLのCDNとか)用](https://unpkg.com/watch-access/dist/iife.js)
## how to use
#### オブジェクト
```js
import noop3 from "noop3";
import { watchObj } from "watch-access";
const obj = watchObj({
    value: 0
}, (prop, val, set) => console.log(`${set ? "SET" : "GET"}: ${prop} = ${val}`));

noop3(`${obj}`); //objを文字に変換する処理を起こす

//コンソール
//GET: Symbol(Symbol.toPrimiitive) = undefined
//GET: toString = function toString() {
//    [native code]
//}
//GET: Symbol(Symbol.toStringTag) = undefined
```
とこのように、オブジェクトを文字にする際に起きるオブジェクトへのアクセスを表示できます。
#### 関数
```js
import { watchStrictFn } from "watch-access";
const add = watchStrictFn<[number, number],number,any>((a,b)=>a+b,
    (fn, ret, ...args)=>console.log(`CAL: add(${args}) = ${ret}`));
add(42,42);
//コンソール
//CAL: add(42,42) = 84
```
とこのように、呼出時の引数とその返り値を表示することができます。
#### ブラウザで楽に検証
```js
const watch_access=await import("https://unpkg.com/watch-access")
```
## 貢献
bun使ってますけどpackage.jsonにbunを書いておいたのでnodeでも大丈夫です
テストはbun:testを使ってるのでしたかったらbun入れてきてください
～ここからはbunによる自動生成です～

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
