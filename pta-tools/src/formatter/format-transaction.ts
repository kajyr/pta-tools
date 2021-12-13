import { isComment, isPosting } from '../type-guards';
import { Comment, Posting, Transaction } from '../types';

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

function formatCommentInline(comment: Comment): string {
  return `; ${comment.message}`;
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

function formatHeader(trx: Transaction): string {
  let str = formatDate(trx.date);
  if (trx.confirmed) {
    str = `${str} *`;
  }
  str = `${str} ${trx.description}`;
  if (trx.comment) {
    str = `${str} ; ${trx.comment}`;
  }
  str = str + `\n`;
  return str;
}

function formatTransaction(trx: Transaction): string {
  let str = formatHeader(trx);
  for (const line of trx.entries) {
    if (isPosting(line)) {
      str = `${str}${INDENT}${formatPosting(line)}\n`;
    } else if (isComment(line)) {
      str = `${str}${INDENT}${formatCommentInline(line)}\n`;
    }
  }

  str = str + `\n`;
  return str;
}

export default formatTransaction;
