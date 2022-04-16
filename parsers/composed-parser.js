import { createReadStream } from 'fs';
import { arrayFromAsync, asyncJoin, asyncSplitOn, asyncStr, asyncMap, execPipe, map } from 'iter-tools-es';

function csvParse(input) {
  return execPipe(
    input,
    asyncSplitOn('\n'),
    asyncMap(row => asyncMap(asyncStr, asyncSplitOn(',', row)))
  )
}

console.time('parsing');
const rows = await arrayFromAsync(csvParse(asyncJoin(createReadStream('./test.csv', 'utf-8'))));
console.log('rows:', rows.length);
console.timeEnd('parsing');