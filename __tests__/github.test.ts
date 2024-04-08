import * as core from "@actions/core";
import * as github from "../src/github";
import { getOctokit } from "@actions/github";

jest.mock("@actions/github");

let debugMock: jest.SpiedFunction<typeof core.debug>;

describe("parseConfig", () => {
  it("parses the config file", async () => {
    const client = getOctokit("token");
    const config = await github.parseConfig(client, ".github/codeowners.yaml");

    expect(config).toEqual({ "src/**": ["owner1"] });
  });

  it("throws an error if the config YAML is invalid", async () => {
    const client = getOctokit("token");

    await expect(
      github.parseConfig(client, ".github/invalid.yaml"),
    ).rejects.toThrow();
  });
});

describe("assignReviewer", () => {
  it("assigns a reviewer", async () => {
    const client = getOctokit("token");
    await github.assignReviewer(client, "owner1");

    expect(client.rest.pulls.requestReviewers).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      pull_number: 1,
      reviewers: ["owner1"],
    });
  });
});

describe("addComment", () => {
  it("adds a comment", async () => {
    const client = getOctokit("token");
    await github.addComment(client, "Hello, world!");

    expect(client.rest.issues.createComment).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      issue_number: 1,
      body: "Hello, world!",
    });
  });
});

describe("getModifiedFiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    debugMock = jest.spyOn(core, "debug").mockImplementation();
  });

  it("returns all modified files", async () => {
    const client = getOctokit("token");
    const modifiedFiles = await github.getModifiedFiles(client);

    expect(modifiedFiles).toHaveLength(285);
  });

  it("logs all modified files", async () => {
    const client = getOctokit("token");
    await github.getModifiedFiles(client);

    expect(debugMock).toHaveBeenCalledTimes(1 + 285);
    expect(debugMock).toHaveBeenCalledWith("Modified files:");
  });
});
