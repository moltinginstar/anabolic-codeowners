import { minimatch } from "minimatch";
import { findLast, chooseRandom } from "./util";
import type { Config, Owner, Path } from "./types";

export const getOwnerGroups = (
  config: Config,
  files: Path[],
  exclude?: Owner[],
): Record<Path, Owner[]> => {
  const rules = Object.keys(config);
  const excludeSet = new Set(exclude);

  return files.reduce<Record<Path, Owner[]>>((groups, file) => {
    const rule = findLast(rules, (rule) => minimatch(file, rule));
    if (!rule) return groups;

    const validOwners = config[rule]?.filter((owner) => !excludeSet.has(owner));
    if (validOwners?.length === 0) return groups;

    groups[rule] = [...new Set(validOwners)];
    return groups;
  }, {});
};

export const chooseReviewers = (
  ownerGroups: Record<Path, Owner[]>,
  numReviewers: number,
): Owner[] => {
  const reviewers = Object.values(ownerGroups).flatMap((group) =>
    chooseRandom(group, numReviewers),
  );

  return [...new Set(reviewers)];
};
