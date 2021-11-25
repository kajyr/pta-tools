import { Transaction } from './types';

function isTransaction(data: any): data is Transaction {
  return data?.date instanceof Date && data?.entries instanceof Array;
}

export default isTransaction;
