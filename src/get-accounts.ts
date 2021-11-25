import { unique } from './array';
import isTransaction from './is-transaction';
import { Journal } from './types';

function getAccounts(trxs: Journal): string[] {
  return unique(
    trxs
      .filter(isTransaction)
      .flatMap((trx) => trx.entries.map((entry) => entry.account))
  );
}

export default getAccounts;
