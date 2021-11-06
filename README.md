# PTA Journals node js api

Plain text accounting JS helpers to interact with the ledger / hledger journal file format.

On the TS / JS side Transactions are described by the [Transaction](src/types.ts) type

## Apis

### formatTransaction
```
import { formatTransaction } from 'pta-journal';
```

```
function formatTransaction(trx: Transaction): string
```

Returns the Transaction formatted in a way suitable to be appendend to a journal file