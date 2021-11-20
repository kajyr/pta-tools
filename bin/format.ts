import { createReadStream } from 'fs';
import split2 from 'split2';

import { rename } from 'fs/promises';
import Formatter from '../src/formatter';
import Parser from '../src/parse/transformer';

const tempWrite = require("temp-write");

const parser = new Parser();
const formatter = new Formatter();
async function parse(file: string) {
  const stream = createReadStream(file)
    .pipe(split2())
    .pipe(parser)
    .pipe(formatter);

  const tempPath = await tempWrite(stream);
  await rename(tempPath, file);
}

const file = process.argv.at(-1);
if (file) {
  parse(file);
}
