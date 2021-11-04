import { Transaction } from 'types';

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

function formatTransaction(trx: Transaction): string {
  const dateStr = formatDate(trx.date);
  let str = `${dateStr} ${trx.description}\n`;
  for (const line of trx.entries) {
    str = `${str}    ${line.account}${spaces(30 - line.amount.length, 2)}${
      line.amount
    }\n`;
  }

  str = str + `\n`;
  return str;
}

export default formatTransaction;