const { createReadStream } = require("fs");
const split2 = require("split2");
const { Parser, Formatter } = require("pta-tools");
const temp = require("temp");
const { rename } = require("fs/promises");
const { pipeline } = require("stream/promises");
const { PassThrough } = require("stream");
const sort = require("./sorter");
temp.track();

const defaults = {
  useStdout: true,
  sort: true,
};

async function main(args, opts) {
  const options = { ...defaults, ...opts };
  const file = args[0];
  const readStream = createReadStream(file);
  const write = temp.createWriteStream();

  const parser = new Parser();
  const formatter = new Formatter();

  await pipeline(
    readStream,
    split2(),
    parser,
    options.sort ? sort() : new PassThrough({ objectMode: true }),
    formatter,
    options.useStdout ? process.stdout : write
  );

  if (!options.useStdout) {
    await rename(write.path, file);
  }
}
module.exports = main;
