#!/usr/bin/env node

const assert = require('assert');
const GoogleTransEndpoint = 'https://clients5.google.com/translate_a/t';

class GoogleTranslator {
  constructor (endpoint, sl, tl) {
    this.url = new URL(GoogleTransEndpoint);
    this.sl = sl;

    Object.entries({
      client: 'dict-chrome-ex',
      sl: sl,
      tl: tl,
    }).forEach(([attr, value]) => this.url.searchParams.set(attr, value));;

    const method = 'POST';
    const headers = new Headers();
    // headers.set("Cache-Control", "max-age=604800");
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36');

    this.fetchArgs = { method, headers, };    
  }

  async trans (src) {
    this.url.searchParams.set('q', src);
    const resp = await fetch(this.url, this.fetchArgs);
    if (!resp.ok)
      throw Error(`${this.fetchArgs.method} ${fetchMe} `);
    const txt = await resp.text();
    const obj = JSON.parse(txt);
    assert.equal(obj.length, 1, `returned array length ${obj[0].length} !== 1\n$got: {JSON.stringify(obj)}`);
    let [trg, sl] = obj[0];
    if (typeof obj[0] === 'string') {
      [trg, sl] = [obj[0], this.sl];
    } else {
      assert.equal(obj[0].length, 2, `returned 1st row length ${obj[0].length} !== 2\ngot: ${JSON.stringify(obj[0])}`);
      [trg, sl] = obj[0];
    }
    return trg
  }
}

main(process.argv);

async function main (argv) {
  const gt = new GoogleTranslator(GoogleTransEndpoint, 'auto', 'en');

  const gots = [];
  for (const src of argv.slice(2)) {
    gots.push(await gt.trans(src));
  }

  console.log('DONE:', gots);
}
