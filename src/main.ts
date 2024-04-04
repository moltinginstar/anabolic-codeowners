import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { matchOwners } from "./match";
import { parseConfig, getModifiedFiles, assignReviewer } from "./github";
import { chooseRandom } from "./util";

export const run = async () => {
  try {
    const token = core.getInput("token", { required: true });
    const client = getOctokit(token);

    const configPath = core.getInput("config");
    const config = await parseConfig(client, configPath);

    const prAuthor = context.payload.sender?.login;

    const modifiedFiles = await getModifiedFiles(client);
    const owners = matchOwners(config, modifiedFiles, [prAuthor]);
    core.debug(`Owners: ${owners.join(", ")}`);

    const numReviewers = +core.getInput("num-reviewers");
    const reviewers = chooseRandom(owners, numReviewers);

    await Promise.all(
      reviewers.map((reviewer) => assignReviewer(client, reviewer)),
    );
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};
