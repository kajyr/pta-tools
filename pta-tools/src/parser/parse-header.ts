import { Transaction } from '../types';

function parseHeaderLine(str: string): Partial<Transaction> {
  const [main, comment] = str.split(/\s+;\s+/);
  const [date, ...other] = main.split(/\s+/);
  let confirmed = other[0] === "*";
  if (confirmed) {
    other.shift();
  }
  const description = other.join(" ");
  return { date: new Date(date), confirmed, description, comment };
}

export default parseHeaderLine;
