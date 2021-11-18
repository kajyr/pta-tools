import { unique } from './array';
import { Transaction } from './types';

function getCommodities(trxs: Transaction[]): string[] {
  return unique(
    trxs.flatMap((trx) =>
      trx.entries.flatMap((entry) => {
        const l: string[] = [];
        if (entry.commodity) {
          l.push(entry.commodity);
        }
        if (entry.conversion) {
          l.push(entry.conversion.commodity);
        }
        return l;
      })
    )
  );
}

export default getCommodities;
