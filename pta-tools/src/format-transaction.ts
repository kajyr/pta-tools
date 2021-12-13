import formatComment from './format-comment';
import { isComment, isPosting } from './type-guards';
import { Posting, Transaction } from './types';

export const INDENT = "    ";

function formatDate(date: string | Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const spaces = (num: number, min: number = 0): string =>
  Array(Math.max(num, min)).join(" ");

function formatPosting(posting: Posting): string {
  let str = `${posting.account}`;

  if (posting.amount) {
    str = `${str}  ${spaces(
      30 - posting.account.length - posting.amount.toString().length,
      2
    )}${posting.amount}`;

    if (posting.commodity) {
      str = `${str} ${posting.commodity}`;
    }
  }
  return str;
}

function formatTransaction(trx: Transaction): string {
  const dateStr = formatDate(trx.date);
  let str = `${dateStr} ${trx.description}\n`;
  for (const line of trx.entries) {
    if (isPosting(line)) {
      str = `${str}${INDENT}${formatPosting(line)}\n`;
    } else if (isComment(line)) {
      str = `${str}${INDENT}${formatComment(line)}\n`;
    }
  }

  str = str + `\n`;
  return str;
}

export default formatTransaction;
