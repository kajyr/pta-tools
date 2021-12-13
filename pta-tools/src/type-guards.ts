import { Comment, Transaction } from './types';

export function isTransaction(data: any): data is Transaction {
  return data?.date instanceof Date && data?.entries instanceof Array;
}

export function isComment(data: any): data is Comment {
  return data && typeof data.message === "string";
}
