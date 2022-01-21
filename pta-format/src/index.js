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
  sort: true,
};

async function main(files, opts) {
  const options = { ...defaults, ...opts };

  for (const file of files) {
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
      options.stdout ? process.stdout : write
    );

    if (!options.stdout) {
      await rename(write.path, file);
    }
  }
}
module.exports = main;
