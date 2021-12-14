import { spaces } from "../string";
import { isComment, isPosting } from "../type-guards";
import { Comment, Posting, Transaction } from "../types";

export const INDENT = "    ";
const SUGGESTED_LINE_WIDTH = 35;

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

function formatAccountName(posting: Posting): string {
  if (posting.is_virtual === "round") {
    return `(${posting.account})`;
  }
  if (posting.is_virtual === "square") {
    return `[${posting.account}]`;
  }
  return posting.account;
}

export function formatPosting(
  posting: Posting,
  lineWidth: number = SUGGESTED_LINE_WIDTH
): string {
  const sepCount = lineWidth - getPostingTextWidth(posting);

  let str = formatAccountName(posting);

  if (posting.amount) {
    const rebalance = posting.is_rebalance ? "= " : "";
    str = `${str}${spaces(sepCount, 2)}${rebalance}${posting.amount}`;

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

function getPostingTextWidth(entry: Posting | Comment): number {
  if (!isPosting(entry)) {
    return 0;
  }

  const acc_len = formatAccountName(entry).length;
  const amount_len = (entry.amount || "").toString().length;
  const commodity_len = entry.commodity ? entry.commodity.length + 1 : 0;
  return acc_len + amount_len + commodity_len;
}

function formatTransaction(trx: Transaction): string {
  let str = formatHeader(trx);
  const widths = trx.entries.map((entry) => getPostingTextWidth(entry) + 3);
  widths.push(SUGGESTED_LINE_WIDTH);
  const max = Math.max.apply(null, widths);
  for (const line of trx.entries) {
    if (isPosting(line)) {
      str = `${str}${INDENT}${formatPosting(line, max)}\n`;
    } else if (isComment(line)) {
      str = `${str}${INDENT}${formatCommentInline(line)}\n`;
    }
  }

  str = str + `\n`;
  return str;
}

export default formatTransaction;
