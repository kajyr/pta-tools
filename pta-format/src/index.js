const { createReadStream } = require("fs");
const split2 = require("split2");
const { Parser, Formatter } = require("pta-tools");
const temp = require("temp");
const mclip = require("mclip");
const { rename } = require("fs/promises");
const { pipeline } = require("stream/promises");
const { PassThrough } = require("stream");
const sort = require("./sorter");
temp.track();

const defaults = {
  sort: true,
};

/**
 * Cli options
 * --stdout - Use stdout instead of overwriting the file
 */

async function main(args, opts) {
  const options = { ...defaults, ...opts };
  const argsOptions = mclip(args);
  for (const file of argsOptions.list) {
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
      argsOptions.stdout ? process.stdout : write
    );

    if (!argsOptions.stdout) {
      await rename(write.path, file);
    }
  }
}
module.exports = main;
