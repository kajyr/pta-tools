import { Directive } from '../types';

import formatDate from './format-date';

function formatDirective(d: Directive): string {
  return `${d.symbol} ${formatDate(d.date)} ${d.content}\n\n`;
}

export default formatDirective;
