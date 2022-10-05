export type VirtualTypes = "round" | "square" | undefined;

export type AmountType = string | number;

export type Posting = {
  account: string;
  amount?: AmountType;
  commodity?: string;
  conversion?: { amount: AmountType; commodity: string };
  balance?: { amount: AmountType; commodity?: string };
  is_virtual?: VirtualTypes;
};

export type Transaction = {
  comment?: string;
  date: Date | string; // When serialized back and forth data might end up as a string
  description?: string;
  confirmed?: boolean;
  entries: (Posting | Comment)[];
};

export type Comment = {
  message: string;
};

// This can be improved if needed
export type Directive = {
  symbol: string;
  date: Date | string;
  content: string;
};

export type JournalEntries = Transaction | Comment | Directive;
export type Journal = JournalEntries[];
