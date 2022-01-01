/**
 * Balance Assertion:
 *    Assets:Cash                $-20.00 = $500.00
 *
 * Balance assignments:
 *
 *     Assets:Cash                = $500.00
 *
 * @see See https://www.ledger-cli.org/3.0/doc/ledger3.html#Balance-assertions
 */

import { Posting, VirtualTypes } from '../types';

import { getAmount, getCommodity } from './parse-posting';

export function isBalanceLine(line: string): boolean {
  return line.indexOf("=") > -1;
}

function parseBalance(
  account: string,
  values: string,
  is_virtual: VirtualTypes
): Posting {
  const [trx, bal] = values.split(/\s*=\s*/);

  const amount = getAmount(trx);
  const commodity = getCommodity(trx);

  const p: Posting = { account, amount, commodity };

  const bal_amount = getAmount(bal);

  if (bal_amount) {
    const balance = {
      amount: bal_amount,
      commodity: getCommodity(bal),
    };
    p.balance = balance;
  }

  if (!!is_virtual) {
    p.is_virtual = is_virtual;
  }
  return p;
}

export default parseBalance;
