const { createReadStream } = require("fs");

const { compose } = require("stream");
const split2 = require("split2");
const { Parser, Formatter } = require("pta-tools");
const temp = require("temp");
const { rename } = require("fs/promises");
temp.track();

async function main(args, useStdout) {
  const file = args[0];
  const readStream = createReadStream(file);
  const write = temp.createWriteStream();

  const parser = new Parser();
  const formatter = new Formatter();
  const chain = compose(split2(), parser, formatter);

  if (useStdout) {
    readStream.pipe(chain).pipe(process.stdout);
  } else {
    readStream
      .pipe(chain)
      .pipe(write)
      .on("finish", async () => {
        await rename(write.path, file);
      });
  }
}
module.exports = main;
