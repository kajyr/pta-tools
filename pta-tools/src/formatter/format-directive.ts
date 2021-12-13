import { Directive } from '../types';

function formatDirective(d: Directive): string {
  return `${d.symbol} ${d.data}\n\n`;
}

export default formatDirective;
