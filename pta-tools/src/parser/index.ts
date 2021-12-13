import { Transform } from 'stream';

import isTransaction from '../is-transaction';
import { Comment, Transaction } from '../types';

import parseHeaderLine from './parse-header';
import parsePosting from './parse-posting';

function isDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isComment(str: string): boolean {
  return /^;/.test(str);
}

function hasEntries(trx: any): boolean {
  return isTransaction(trx) && trx.entries.length > 0;
}

/**
 * Removes the initial ; from the comment.
 */
function clearComment(str: string): string {
  return str.replace(/^;\s*/, "");
}

class Transformer extends Transform {
  chunk: Transaction | Comment | undefined;
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
    if (trimmed === "") {
      callback();
      return;
    }
    if (isComment(trimmed)) {
      // Either it is a comment alone
      // or a comment within a transaction
      if (isTransaction(this.chunk) && !hasEntries(this.chunk)) {
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
    if (isDate(broken[0])) {
      // a date starts a new chunk
      this.clearChunk();
      this.chunk = {
        ...parseHeaderLine(trimmed),
        entries: [],
      };
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
