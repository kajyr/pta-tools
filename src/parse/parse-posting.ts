import { Posting } from '../types';

function getAmount(str: string): string | undefined {
  const matches = str.match(/[\-\+]?[0-9]*\.[0-9]+/);
  if (matches) {
    return matches[0];
  }
}
/**
 * This is opinionated: we expect the commodity to be expressed as 3 uppercase characters.
 * like 34 EUR or 25 USD.
 * We don't support $25 or 34€
 */
function getCommodity(str: string): string | undefined {
  const matches = str.match(/[A-Z]{3}/);
  if (matches) {
    return matches[0];
  }
}

function parseRebalance(account: string, values: string): Posting {
  const amount = getAmount(values);
  const commodity = getCommodity(values);

  return { account, is_rebalance: true, amount, commodity };
}

function parsePosting(str: string): Posting {
  const matches = str.match(/^(\S+)\s{2,}(.+)$/);

  if (!matches) {
    return { account: str };
  }

  const account = matches[1].replace(/^[\[(]/, "").replace(/[\])]$/, "");

  const values = matches[2];

  if (values.indexOf("=") > -1) {
    // Rebalance
    return parseRebalance(account, values);
  }

  if (values.indexOf("@") === -1) {
    // No conversion
    //    console.log(values, "-", getAmount(values));
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
  const [, c_commodity] = conversion.split(/\s+/);

  if (c_amount && c_commodity) {
    post.conversion = { amount: c_amount, commodity: c_commodity };
  }

  return post;
}

export default parsePosting;
