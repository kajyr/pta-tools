function parseHeaderLine(str: string) {
  const [date, ...other] = str.split(/\s+/);
  let confirmed = other[0] === "*";
  if (confirmed) {
    other.shift();
  }
  const description = other.join(" ");
  return { date: new Date(date), confirmed, description };
}

export default parseHeaderLine;
