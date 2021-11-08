export type TransactionEntry = {
  account: string;
  amount?: string;
  commodity?: string;
  conversion?: { amount: string; commodity: string };
};

export type Transaction = {
  date: Date;
  description?: string;
  confirmed?: boolean;
  entries: TransactionEntry[];
};
