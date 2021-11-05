import { match } from 'assert';
import split2 from 'split2';
import { Transform } from 'stream';
import { Entry, Transaction } from 'types';

function isDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export function parseHeaderLine(str: string) {
  const [date, ...other] = str.split(/\s+/);
  let confirmed = other[0] === "*";
  if (confirmed) {
    other.shift();
  }
  const description = other.join(" ");
  return { date: new Date(date), confirmed, description };
}

export function parseEntryLine(str: string): Entry {
  const matches = str.match(/^(\S+)\s{2,}(.+)$/);
  if (!matches) {
    return { account: str };
  }
  const account = matches[1];
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
      this.chunk.entries.push(parseEntryLine(trimmed));
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

function parse(stream: NodeJS.ReadableStream): Promise<Transaction[]> {
  const trxs: Transaction[] = [];
  const transformer = new Transformer();

  return new Promise((resolve, reject) => {
    stream
      .pipe(split2())
      .pipe(transformer)
      .on("data", (data: Transaction) => {
        trxs.push(data);
      })
      .on("end", () => {
        resolve(trxs);
      })
      .on("error", () => {
        reject();
      });
  });
}

export default parse;
