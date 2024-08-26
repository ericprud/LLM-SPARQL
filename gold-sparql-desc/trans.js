#!/usr/bin/env node

const assert = require('assert');
const sl =
      // 'fr';
      'auto';
const tl = 'en';
const GoogleTransEndpoint = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sl}&tl=${tl}&q=`;
const method = 'POST';
const headers = new Headers();
headers.set("Cache-Control", "max-age=604800");
headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36');

const FetchArgs = { method, headers, };


async function trans (src) {
  const enc = encodeURIComponent(src);
  const fetchMe = GoogleTransEndpoint + enc;
  const resp = await fetch(fetchMe, FetchArgs);
  if (!resp.ok)
    throw Error(`${FetchArgs.method} ${fetchMe} `);
  const txt = await resp.text();
  const obj = JSON.parse(txt);
  assert.equal(obj.length, 1, `returned array length ${obj[0].length} !== 1\n${JSON.stringify(obj)}`);
  assert.equal(obj[0].length, 2, `returned 1st row length ${obj[0].length} !== 2\n${JSON.stringify(obj[0])}`);
  const [trg, tl] = obj[0];
  return trg
}

main(process.argv);

async function main (argv) {
  const gots = [];
  for (const src of argv.slice(2)) {
    gots.push(await trans(src));
  }
  console.log('DONE:', gots);
}
