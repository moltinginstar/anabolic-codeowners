export const findLast = <T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean,
): T | undefined => {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return array[l];
  }

  return undefined;
};

export const chooseRandom = <T>(
  array: Array<T>,
  k = 1,
  replace = false,
): T[] => {
  const result = [];
  const copy = [...array];

  for (let i = 0; i < k; i++) {
    if (!replace && copy.length === 0) break;

    const index = Math.floor(Math.random() * copy.length);
    if (replace) {
      result.push(copy[index]);
    } else {
      result.push(...copy.splice(index, 1));
    }
  }

  return result;
};