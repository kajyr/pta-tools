# Plain text acounting node js api

[![Build Status](https://app.travis-ci.com/kajyr/pta-tools.svg?branch=main)](https://app.travis-ci.com/kajyr/pta-tools)

Plain text accounting JS helpers to interact with the ledger / hledger journal file format.

On the TS / JS side Transactions are described by the [Transaction](pta-tools/src/types.ts) type

## Main APIs

### formatTransaction

```
import { formatTransaction } from 'pta-journal';
```

```
function formatTransaction(trx: Transaction): string
```

Returns the Transaction formatted in a way suitable to be appendend to a journal file

### parse

```
import { parse } from 'pta-tools';
```

```
function parse(stream: ReadableStream): Promise<ParseResult>
```

```
type ParseResult = {
  transactions: Transaction[];
  accounts: string[];
  commodities: string[];
};
```

Returns the transactions, the accounts and the commodities from a journal. To get the stream of the journal you can use

```
const stream = fs.createReadStream('./hledger.journal');
```