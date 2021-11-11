import formatTransaction from './format-transaction';
import parse, { ParseResult } from './parse';
import { Posting, Transaction } from './types';

/**
 * @deprecated
 */
type TransactionEntry = Posting;

export {
  formatTransaction,
  Transaction,
  parse,
  ParseResult,
  TransactionEntry,
  Posting,
};
