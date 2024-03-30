import { minimatch } from "minimatch";
import { findLast } from "./util";
import type { Config, Owner, Path } from "./types";

export const matchOwners = (
  config: Config,
  files: Path[],
  exclude?: Owner[],
): Owner[] => {
  const set = files.reduce<Set<Owner>>((owners, file) => {
    const pattern = findLast(Object.keys(config), (pattern) =>
      minimatch(file, pattern),
    );
    if (pattern) config[pattern]?.forEach((owner) => owners.add(owner));

    return owners;
  }, new Set());

  exclude?.forEach((owner) => set.delete(owner));

  return Array.from(set);
};
