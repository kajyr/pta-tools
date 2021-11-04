export type Transaction = {
  date: Date;
  description?: string;
  entries: { account: string; amount: string }[];
};
