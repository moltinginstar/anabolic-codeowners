import type { getOctokit } from "@actions/github";

export type Octokit = ReturnType<typeof getOctokit>;

export type Path = string;

export type Owner = string;

export interface Config {
  [key: Path]: Owner[];
}
