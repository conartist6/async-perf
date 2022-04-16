import { createReadStream } from 'fs';
import { arrayFromAsync } from 'iter-tools-es';

async function* csvParseChunks(document) {
  let row = [];
  let value = '';
  for await (const chunk of document) {
    for (const chr of chunk) {
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
  }
  row.push(value);
  yield row;
}

console.time('time');
const rows = await arrayFromAsync(csvParseChunks(createReadStream('./test.csv', 'utf-8')));
console.log('rows:', rows.length);
console.timeEnd('time');