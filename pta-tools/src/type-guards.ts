import { Comment, Directive, Posting, Transaction } from './types';

export function isTransaction(data: any): data is Transaction {
  return data?.date instanceof Date && data?.entries instanceof Array;
}

export function isComment(data: any): data is Comment {
  return data && typeof data.message === "string";
}

export function isPosting(data: any): data is Posting {
  return data && typeof data.account === "string";
}

export function isDirective(data: any): data is Directive {
  return data && data.symbol === "P";
}
