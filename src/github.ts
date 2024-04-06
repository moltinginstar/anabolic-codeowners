import * as core from "@actions/core";
import { context } from "@actions/github";
import { parse } from "yaml";
import type { Config, Octokit } from "./types";

export const parseConfig = async (
  client: Octokit,
  path: string,
): Promise<Config> => {
  const { data } = await client.rest.repos.getContent({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: context.sha,
    path,
  });

  if (!Array.isArray(data) && data.type === "file") {
    return parse(Buffer.from(data.content, "base64").toString());
  }

  throw new Error(`Invalid config file: ${path}`);
};

export const assignReviewer = async (client: Octokit, reviewer: string) => {
  await client.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request!.number,
    reviewers: [reviewer],
  });
};

export const addComment = async (client: Octokit, body: string) => {
  await client.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.pull_request!.number,
    body,
  });
};

export const getModifiedFiles = async (client: Octokit) => {
  const modifiedFiles = [];

  let page = 1;
  let response;

  do {
    response = await client.rest.pulls.listFiles({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request!.number,
      per_page: 100,
      page,
    });
    modifiedFiles.push(...response.data);

    page += 1;
  } while (response.data.length);

  const modifiedFilenames = modifiedFiles.map((f) => f.filename);

  core.debug("Modified files:");
  for (const file of modifiedFilenames) {
    core.debug(` - ${file}`);
  }

  return modifiedFilenames;
};
