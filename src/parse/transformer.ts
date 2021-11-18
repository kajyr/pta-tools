import { Transform } from 'stream';

import { Transaction } from '../types';

import parsePosting from './parse-posting';

export function parseHeaderLine(str: string) {
  const [date, ...other] = str.split(/\s+/);
  let confirmed = other[0] === "*";
  if (confirmed) {
    other.shift();
  }
  const description = other.join(" ");
  return { date: new Date(date), confirmed, description };
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
      const entry = parsePosting(trimmed);
      this.chunk.entries.push(entry);
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
