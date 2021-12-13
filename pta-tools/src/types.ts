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

export type JournalEntries = Transaction | Comment;
export type Journal = JournalEntries[];
