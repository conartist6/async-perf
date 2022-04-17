import * as fs from 'fs';
import { arrayFrom, join, splitOn, str, map, execPipe } from 'iter-tools-es';

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

function csvParse(input) {
  return execPipe(
    input,
    splitOn('\n'),
    map((row) => map(str, splitOn(',', row))),
  );
}

console.time('time');
const rows = arrayFrom(csvParse(join(readChunks('./test.csv', 'utf-8'))));
console.log('rows:', rows.length);
console.timeEnd('time');
