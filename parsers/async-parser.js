import { createReadStream } from 'fs';
import { arrayFromAsync } from 'iter-tools-es';

async function *join(chunks) {
  for await (const chunk of chunks) {
    yield* chunk;
  }
}

async function* csvParse(document) {
  let row = [];
  let value = '';
  for await (const chr of document) {
    if (chr === ',') {
      row.push(value);
      value = '';
    } else if (chr === '\n') {
      row.push(value);
      value = '';
      yield row;
      row = [];
    } else {
      value += chr;
    }
  }
  row.push(value);
  yield row;
}

console.time('one-loop parsing');
const rows = await arrayFromAsync(csvParse(join(createReadStream('./test.csv', 'utf-8'))));
console.log('rows:', rows.length);
console.timeEnd('one-loop parsing');