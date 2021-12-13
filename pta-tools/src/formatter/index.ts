import { Transform } from 'stream';

import { isComment, isTransaction } from '../type-guards';
import { Comment, Transaction } from '../types';

import formatComment from './format-comment';
import formatTransaction from './format-transaction';

class Formatter extends Transform {
  constructor() {
    super({
      objectMode: true,
    });
  }
  _transform(
    chunk: Transaction | Comment,
    encoding: string,
    callback: () => void
  ) {
    if (isTransaction(chunk)) {
      this.push(formatTransaction(chunk));
    } else if (isComment(chunk)) {
      this.push(formatComment(chunk));
    }
    callback();
    return;
  }
}

export default Formatter;
