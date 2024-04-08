export const findLast = <T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean,
): T | undefined => {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return array[l];
  }

  return undefined;
};

export const chooseRandom = <T>(array: T[], k = 1, replace = false): T[] => {
  const result = [];
  const copy = [...array];

  if (!replace && k > array.length) {
    k = array.length;
  }

  for (let i = 0; i < k; i++) {
    if (copy.length === 0) break;

    const index = Math.floor(Math.random() * copy.length);
    if (replace) {
      result.push(copy[index]);
    } else {
      result.push(...copy.splice(index, 1));
    }
  }

  return result;
};
