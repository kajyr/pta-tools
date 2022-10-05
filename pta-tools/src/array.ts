import { Readable } from "stream";

export function unique<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

export async function collect<T>(readable: Readable): Promise<T[]> {
  let result = [];
  for await (const chunk of readable) {
    result.push(chunk);
  }
  return result;
}

export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
