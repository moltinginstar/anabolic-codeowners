import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { getOwnerGroups, chooseReviewers } from "./match";
import { parseConfig, getModifiedFiles, assignReviewer } from "./github";

export const run = async () => {
  try {
    const token = core.getInput("token", { required: true });
    const client = getOctokit(token);

    const configPath = core.getInput("config");
    const config = await parseConfig(client, configPath);

    const prAuthor = context.payload.sender?.login;

    const modifiedFiles = await getModifiedFiles(client);
    const ownerGroups = getOwnerGroups(config, modifiedFiles, [prAuthor]);
    core.debug(`Owner groups: ${ownerGroups}`);

    const numReviewers = +core.getInput("num-reviewers");
    if (isNaN(numReviewers)) {
      throw new Error("Number of reviewers must be a valid number");
    }

    const reviewers = chooseReviewers(ownerGroups, numReviewers);
    core.debug(`Reviewers: ${reviewers}`);

    await Promise.all(
      reviewers.map(async (reviewer) => assignReviewer(client, reviewer)),
    );
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};
