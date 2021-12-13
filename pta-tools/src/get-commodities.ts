import { unique } from './array';
import isTransaction from './is-transaction';
import { Journal } from './types';

function getCommodities(trxs: Journal): string[] {
  return unique(
    trxs.filter(isTransaction).flatMap((trx) =>
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
