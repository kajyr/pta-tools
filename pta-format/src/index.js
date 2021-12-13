const { createReadStream } = require("fs");
const split2 = require("split2");
const { Parser, Formatter } = require("pta-tools");
const temp = require("temp");
const { rename } = require("fs/promises");
const { pipeline } = require("stream/promises");
temp.track();

async function main(args, useStdout) {
  const file = args[0];
  const readStream = createReadStream(file);
  const write = temp.createWriteStream();

  const parser = new Parser();
  const formatter = new Formatter();

  await pipeline(
    readStream,
    split2(),
    parser,
    formatter,
    useStdout ? process.stdout : write
  );

  if (!useStdout) {
    await rename(write.path, file);
  }
}
module.exports = main;
