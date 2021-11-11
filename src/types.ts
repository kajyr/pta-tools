export type Posting = {
  account: string;
  amount?: string;
  commodity?: string;
  conversion?: { amount: string; commodity: string };
  is_rebalance?: boolean;
};

export type Transaction = {
  date: Date;
  description?: string;
  confirmed?: boolean;
  entries: Posting[];
};
