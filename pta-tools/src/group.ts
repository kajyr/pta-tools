import fillAmounts from "./fill-amounts";
import { isPosting, isTransaction } from "./type-guards";
import { Journal, Posting, Transaction } from "./types";

type PostingWithDate = Posting & { date: Date };
type Pivot = Record<string, PostingWithDate[]>;

function sumPostings(trx: Transaction) {
  return trx.entries.reduce((acc, entry) => {
    if (isPosting(entry) && entry.amount) {
      return acc + Number(entry.amount);
    }
    return acc;
  }, 0);
}

function makePivot(journal: Journal): Pivot {
  const map: Pivot = {};

  for (const trx of journal) {
    if (!isTransaction(trx)) {
      continue;
    }

    const filled = fillAmounts(trx);

    for (const posting of filled.entries) {
      if (!isPosting(posting)) {
        continue;
      }

      const existing: PostingWithDate[] = map[posting.account] || [];

      existing.push({
        ...posting,
        date: new Date(trx.date),
        amount: Number(posting.amount),
      });

      map[posting.account] = existing;
    }
  }

  return map;
}

function getFirstDayOfMonth(d: Date): string {
  const m = ("0" + (d.getMonth() + 1)).slice(-2);
  return `${d.getFullYear()}-${m}-01`;
}

type Commodities = Record<string, number>;

export function groupMonthly(journal: Journal) {
  const pivot = makePivot(journal);

  const map: Record<string, any> = {};

  for (const [key, entries] of Object.entries(pivot)) {
    const m2 = entries.reduce((acc, cur) => {
      const dateKey = `${getFirstDayOfMonth(cur.date)}`;
      const commodity = cur.commodity || "commodity";

      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }
      if (!acc[dateKey][commodity]) {
        acc[dateKey][commodity] = 0;
      }

      acc[dateKey][commodity] = acc[dateKey][commodity] + Number(cur.amount);

      return acc;
    }, {} as Record<string, Commodities>);

    map[key] = m2;
  }

  return map;
}
