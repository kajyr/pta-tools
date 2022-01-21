# pta-format Formatting tool

Opinionated nodejs cli script to prettify a ledger file.

At the moment the script does 2 main things: normalize the spaces so that all
(well most of) the entries look aligned and sort the entries by date.

Note that the script tries to preserve the position of the comments without date,
but it's not guarantee, so it's always advised to version your ledger files on git,
to review changes.

## Usage

`npx pta-format <files>`

## Options

- `--stdout` - Use stdout instead of overwriting the file Defaults to false.
- `--sort` - Sort transactions. Defaults to true
