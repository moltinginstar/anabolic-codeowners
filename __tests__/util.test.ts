import * as util from "../src/util";

describe("findLast", () => {
  it("returns the last element that satisfies the predicate", () => {
    const array = [1, 2, 3, 4, 5];
    const predicate = (value: number) => value % 2 === 0;

    expect(util.findLast(array, predicate)).toBe(4);
  });

  it("returns undefined if no elements satisfy the predicate", () => {
    const array = [1, 3, 5];
    const predicate = (value: number) => value % 2 === 0;

    expect(util.findLast(array, predicate)).toBeUndefined();
  });

  it("returns undefined if the array is empty", () => {
    const array: number[] = [];
    const predicate = (value: number) => value % 2 === 0;

    expect(util.findLast(array, predicate)).toBeUndefined();
  });
});

describe("chooseRandom", () => {
  it("returns a random element from the array by default", () => {
    const array = [1, 2, 3, 4, 5];
    const result = util.chooseRandom(array);

    expect(result).toHaveLength(1);
    expect(array).toContain(result[0]);
  });

  it("returns k random elements from the array", () => {
    const array = [1, 2, 3, 4, 5];
    const k = 3;
    const result = util.chooseRandom(array, k, true);

    expect(result).toHaveLength(k);
    result.forEach((element) => expect(array).toContain(element));
  });

  it("returns k random elements from the array without replacement", () => {
    const array = [1, 2, 3, 4, 4, 4, 5];
    const k = 3;
    const result = util.chooseRandom(array, k, false);

    expect(result).toHaveLength(k);
    result.forEach((element) => expect(array).toContain(element));
  });

  it("returns k random elements from the array with replacement if k is greater than the array length", () => {
    const array = [1, 2, 3, 4, 4, 4, 5];
    const k = 10;
    const result = util.chooseRandom(array, k, true);

    expect(result).toHaveLength(k);
    result.forEach((element) => expect(array).toContain(element));
  });

  it("returns the entire shuffled array if k is greater than the array length and replace is false", () => {
    const array = [1, 2, 3, 4, 4, 4, 5];
    const k = 10;
    const result = util.chooseRandom(array, k, false);

    expect([...result].sort()).toEqual([...array].sort());
  });

  it("returns an empty array if k is 0", () => {
    const array = [1, 2, 3, 4, 5];
    const k = 0;
    const result = util.chooseRandom(array, k, true);

    expect(result).toHaveLength(k);
  });

  it("returns an empty array if k is 0 and replace is false", () => {
    const array = [1, 2, 3, 4, 5];
    const k = 0;
    const result = util.chooseRandom(array, k, false);

    expect(result).toHaveLength(0);
  });

  it("returns an empty array if the array is empty", () => {
    const array: number[] = [];
    const k = 3;
    const result = util.chooseRandom(array, k, true);

    expect(result).toHaveLength(0);
  });

  it("returns an empty array if the array is empty and replace is false", () => {
    const array: number[] = [];
    const k = 3;
    const result = util.chooseRandom(array, k, false);

    expect(result).toHaveLength(0);
  });
});
