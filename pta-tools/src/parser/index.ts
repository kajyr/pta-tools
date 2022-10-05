import { Transform } from "stream";

import { isTransaction } from "../type-guards";
import { Comment, JournalEntries, Transaction } from "../types";

import parseDirective from "./parse-directive";
import parseHeader from "./parse-header";
import parsePosting from "./parse-posting";

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
    // at least 2 spaces, even if it's not proper indented with other entries
    const isIndented = line.startsWith("  ");

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
      } else {
        // a comment after some entries closes the transaction.
        // a comment within a transaction can be only after the date
        this.clearChunk();
        // a comment is considered a one-liner
        this.push(mkComment(trimmed));
      }
      callback();
      return;
    }
    if (isDirective(trimmed)) {
      // a directive after some entries closes the transaction.
      this.clearChunk();
      // also directives are one liners
      // so we don't need to store them in the chunker
      this.push(parseDirective(trimmed));
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
