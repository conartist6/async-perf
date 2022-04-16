import { readFile } from 'fs/promises';

function csvParse(input) {
  return input.split('\n').map(row => row.split(','));
}

console.time('parsing');
const rows = csvParse(await readFile('./test.csv', 'utf-8'));
console.log('rows:', rows.length);
console.timeEnd('parsing');