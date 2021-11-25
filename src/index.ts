import pkg from '../package.json';

import formatTransaction from './format-transaction';
import isTransaction from './is-transaction';
import parse, { ParseResult } from './parse';
import { Comment, Journal, Posting, Transaction } from './types';

/**
 * @deprecated
 */
type TransactionEntry = Posting;

const version = pkg.version;

export {
  Comment,
  formatTransaction,
  isTransaction,
  Journal,
  parse,
  ParseResult,
  Posting,
  Transaction,
  TransactionEntry,
  version,
};
