export type Posting = {
  account: string;
  amount?: string | number;
  commodity?: string;
  conversion?: { amount: string; commodity: string };
  is_rebalance?: boolean;
};

export type Transaction = {
  comment?: string;
  date: Date;
  description?: string;
  confirmed?: boolean;
  entries: Posting[];
};

export type Comment = {
  message: string;
};

export type Journal = (Transaction | Comment)[];
