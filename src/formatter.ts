import { Transform } from 'stream';

import formatTransaction from '../src/format-transaction';
import { Transaction } from '../src/types';

class Formatter extends Transform {
  constructor() {
    super({
      objectMode: true,
    });
  }

  _transform(data: Transaction, encoding: string, callback: Function) {
    const str = formatTransaction(data);

    this.push(str);
    callback();
  }

  _flush(callback: Function) {
    callback();
  }
}

export default Formatter;
