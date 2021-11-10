import { Transform } from 'stream';

import { Transaction, TransactionEntry } from '../types';

export function parseHeaderLine(str: string) {
  const [date, ...other] = str.split(/\s+/);
  let confirmed = other[0] === "*";
  if (confirmed) {
    other.shift();
  }
  const description = other.join(" ");
  return { date: new Date(date), confirmed, description };
}

export function parseEntryLine(str: string): TransactionEntry {
  const matches = str.match(/^(\S+)\s{2,}(.+)$/);
  if (!matches) {
    return { account: str };
  }
  const account = matches[1].replace(/^[\[(]/, "").replace(/[\])]$/, "");
  const values = matches[2];

  if (values.indexOf("@") === -1) {
    // No conversion
    const [amount, commodity] = values.split(/\s+/);
    return { amount, account, commodity };
  }

  const [ams, conversion] = values.split(/\s*@\s*/);
  const [amount, commodity] = ams.split(/\s+/);
  const [c_amount, c_commodity] = conversion.split(/\s+/);

  return {
    amount,
    account,
    commodity,
    conversion: { amount: c_amount, commodity: c_commodity },
  };
}

function isDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

class Transformer extends Transform {
  chunk: Transaction | null = null;
  constructor() {
    super({
      objectMode: true,
    });
  }

  _transform(line: string, encoding: string, callback: Function) {
    const trimmed = line.trim();
    const broken = trimmed.split(/\s+/);
    if (trimmed === "") {
      callback();
      return;
    }
    if (isDate(broken[0])) {
      if (this.chunk) {
        this.push(this.chunk);
      }
      this.chunk = {
        ...parseHeaderLine(trimmed),
        entries: [],
      };
    } else if (this.chunk) {
      const entry = parseEntryLine(trimmed);
      this.chunk.entries.push(entry);
      this.push({ type: "account", id: entry.account });
      if (entry.commodity) {
        this.push({ type: "commodity", id: entry.commodity });
      }
      if (entry.conversion) {
        this.push({ type: "commodity", id: entry.conversion.commodity });
      }
    }
    callback();
  }

  _flush(callback: Function) {
    if (this.chunk) {
      this.push(this.chunk);
    }
    callback();
  }
}

export default Transformer;
