import { Transform } from 'stream';

import { INDENT } from '../formatter/format-transaction';
import { isTransaction } from '../type-guards';
import { Comment, Directive, JournalEntries, Transaction } from '../types';

import parseHeader from './parse-header';
import parsePosting from './parse-posting';

function isDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isComment(str: string): boolean {
  return /^;/.test(str);
}

function isDirective(str: string): boolean {
  return /^P/.test(str);
}

/**
 * Removes the initial ; from the comment.
 */
function clearComment(str: string): string {
  return str.replace(/^;\s*/, "");
}

function mkComment(str: string): Comment {
  return {
    message: clearComment(str),
  };
}

function mkDirective(str: string): Directive {
  return { symbol: "P", data: str.replace(/^P\s*/, "") };
}

function mkTransaction(other: Partial<Transaction> = {}): Transaction {
  return { date: new Date(), entries: [], ...other };
}

class Transformer extends Transform {
  chunk: JournalEntries | undefined;
  constructor() {
    super({
      objectMode: true,
    });
  }
  clearChunk() {
    if (this.chunk) {
      this.push(this.chunk);
      this.chunk = undefined;
    }
  }

  _transform(line: string, encoding: string, callback: Function) {
    const trimmed = line.trim();
    const broken = trimmed.split(/\s+/);
    const isIndented = line.startsWith(INDENT);

    if (trimmed === "") {
      callback();
      return;
    }
    if (isComment(trimmed)) {
      // Either it is a comment alone
      // or a comment within a transaction.
      // If it is indented it belongs to the previous transaction.
      if (isTransaction(this.chunk) && isIndented) {
        this.chunk.entries.push(mkComment(trimmed));
        this.chunk.comment = clearComment(trimmed);
      } else {
        // a comment after some entries closes the transaction.
        // a comment within a transaction can be only after the date
        this.clearChunk();
        this.chunk = { message: clearComment(trimmed) };
      }
      callback();
      return;
    }
    if (isDirective(trimmed)) {
      // a directive after some entries closes the transaction.
      this.clearChunk();
      this.chunk = mkDirective(trimmed);
      callback();
      return;
    }
    if (isDate(broken[0])) {
      // a date starts a new chunk
      this.clearChunk();
      this.chunk = mkTransaction(parseHeader(trimmed));
    } else if (this.chunk && isTransaction(this.chunk)) {
      // it's a posting
      const entry = parsePosting(trimmed);
      this.chunk.entries.push(entry);
    }
    callback();
  }

  _flush(callback: Function) {
    this.clearChunk();
    callback();
  }
}

export default Transformer;
