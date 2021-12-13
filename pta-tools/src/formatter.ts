import { Transform } from 'stream';

import formatComment from './format-comment';
import formatTransaction from './format-transaction';
import isTransaction from './is-transaction';
import { Comment, Transaction } from './types';

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
      const str = formatTransaction(chunk);
      this.push(str);
    } else {
      const str = formatComment(chunk);
      this.push(str);
    }
    callback();
    return;
  }
}

export default Formatter;
