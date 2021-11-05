import { Stream } from 'stream';

function mockStream(str: string) {
  const stream = new Stream.Readable();

  stream._read = function () {
    this.push(str);
    this.push(null);
  };

  return stream;
}

export default mockStream;
