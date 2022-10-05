import { isPosting } from "./type-guards";
import { Transaction, TrxEntry } from "./types";

function sumPostings(trx: Transaction) {
  return trx.entries.reduce((acc, entry) => {
    if (isPosting(entry) && entry.amount) {
      const commodity = entry.commodity || "_";

      if (!acc[commodity]) {
        acc[commodity] = 0;
      }

      acc[commodity] = acc[commodity] + Number(entry.amount);

      return acc;
    }
    return acc;
  }, {} as Record<string, number>);
}

function fillAmounts(trx: Transaction) {
  const catchAllList = trx.entries.filter((e) => isPosting(e) && !e.amount);

  if (catchAllList.length === 0) {
    // every posting is already filled
    return trx;
  }

  if (catchAllList.length > 1) {
    // more than one posting without amount
    throw new Error("Only one posting can have no amount");
  }

  const totals = sumPostings(trx);
  const [catchAll] = catchAllList;

  const entries: TrxEntry[] = [...trx.entries.filter((e) => e !== catchAll)];

  for (const [commodity, value] of Object.entries(totals)) {
    entries.push({ ...catchAll, commodity, amount: -1 * value });
  }

  return { ...trx, entries };
}

export default fillAmounts;
