import formatComment from './format-comment';
import formatTransaction from './format-transaction';
import Formatter from './formatter';
import parse, { ParseResult } from './parse';
import Parser from './parser';
import { isTransaction } from './type-guards';
import { Comment, Journal, Posting, Transaction } from './types';

/**
 * @deprecated
 */
type TransactionEntry = Posting;

export {
  Comment,
  formatComment,
  Formatter,
  formatTransaction,
  isTransaction,
  Journal,
  parse,
  Parser,
  ParseResult,
  Posting,
  Transaction,
  TransactionEntry,
};
