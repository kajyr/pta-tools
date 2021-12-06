import { Posting } from '../types';

export function getAmount(str: string): string | undefined {
  const matches = str.match(/[\-\+]?[0-9]*[\.0-9]+/);
  if (matches) {
    return matches[0];
  }
}
/**
 * This is opinionated: we expect the commodity to be expressed as 3+ characters.
 * like 34 EUR or 25 USD or 2 pizzas
 * We don't support $25 or 34€
 */
export function getCommodity(str: string): string | undefined {
  const matches = str.match(/[a-z]{3,}$/i);
  if (matches) {
    return matches[0];
  }
}

function parseRebalance(account: string, values: string): Posting {
  const amount = getAmount(values);
  const commodity = getCommodity(values);

  return { account, is_rebalance: true, amount, commodity };
}

function filterBrackets(str: string): string {
  return str.replace(/[\[\]()]/g, "");
}

function parsePosting(str: string): Posting {
  const matches = str.match(/^(.+?)\s{2,}(.+)$/);

  if (!matches) {
    return { account: filterBrackets(str) };
  }

  const account = filterBrackets(matches[1]);
  const values = matches[2];

  if (values.indexOf("=") > -1) {
    // Rebalance
    return parseRebalance(account, values);
  }

  if (values.indexOf("@") === -1) {
    // No conversion
    const amount = getAmount(values);
    const commodity = getCommodity(values);
    return { amount, account, commodity };
  }

  const [ams, conversion] = values.split(/\s*@\s*/);
  const amount = getAmount(ams);
  const commodity = getCommodity(ams);

  const post: Posting = {
    amount,
    account,
    commodity,
  };

  const c_amount = getAmount(conversion);
  const c_commodity = getCommodity(conversion);

  if (c_amount && c_commodity) {
    post.conversion = { amount: c_amount, commodity: c_commodity };
  }

  return post;
}

export default parsePosting;
