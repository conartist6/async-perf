import * as fs from 'fs';
import { arrayFrom } from 'iter-tools-es';

function* readChunks(path, encoding) {
  const fd = fs.openSync(path, 'r');
  let position = 0;

  while (true) {
    const buffer = Buffer.alloc(65535);
    const bytesRead = fs.readSync(fd, buffer, { position });
    position += bytesRead;

    if (bytesRead === 0) break;

    yield buffer.toString(encoding);
  }

  fs.closeSync(fd);
}

function* join(chunks) {
  for (const chunk of chunks) {
    yield* chunk;
  }
}

function* csvParse(document) {
  let row = [];
  let value = '';
  for (const chr of document) {
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

console.time('time');
const rows = arrayFrom(csvParse(join(readChunks('./test.csv', 'utf-8'))));
console.log('rows:', rows.length);
console.timeEnd('time');
