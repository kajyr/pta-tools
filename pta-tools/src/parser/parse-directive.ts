import { Directive } from '../types';

function parseDirective(str: string): Directive {
  const [symbol, date, ...list] = str.split(/\s+/);
  return { symbol, date: new Date(date), content: list.join(" ") };
}

export default parseDirective;
