import { str } from 'iter-tools-es';
import { readFile } from 'fs/promises';

function csvParse(input) {
  return input.split('\n').map((row) => str(row.split(',')));
}

console.time('time');
const rows = csvParse(await readFile('./test.csv', 'utf-8'));
console.log('rows:', rows.length);
console.timeEnd('time');
