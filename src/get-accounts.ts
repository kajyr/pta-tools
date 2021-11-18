import { unique } from './array';
import { Transaction } from './types';

function getAccounts(trxs: Transaction[]): string[] {
  return unique(
    trxs.flatMap((trx) => trx.entries.map((entry) => entry.account))
  );
}

export default getAccounts;
