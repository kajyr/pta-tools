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
  entries: (Posting | Comment)[];
};

export type Comment = {
  message: string;
};

// This can be improved if needed
export type Directive = {
  symbol: "P";
  data: string;
};

export type JournalEntries = Transaction | Comment | Directive;
export type Journal = JournalEntries[];
