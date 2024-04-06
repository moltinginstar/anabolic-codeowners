/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from "@actions/core";
import * as main from "../src/main";

// Mock Octokit
jest.mock("@actions/github", () => ({
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {
        listFiles: jest
          .fn()
          .mockResolvedValueOnce({
            data: [
              { filename: "src/index.ts" },
              { filename: "src/main.ts" },
              { filename: "src/match.ts" },
              { filename: "README.md" },
            ],
          })
          .mockResolvedValue({ data: [] }),

        requestReviewers: jest.fn(),
      },

      issues: {
        createComment: jest.fn(),
      },

      repos: {
        getContent: jest.fn().mockResolvedValue({
          data: {
            type: "file",
            content: Buffer.from("src/**:\n  - owner1").toString("base64"),
          },
        }),
      },
    },
  })),

  context: {
    sha: "sha",

    repo: {
      owner: "owner",
      repo: "repo",
    },

    payload: {
      sender: {
        login: "prAuthor",
      },

      pull_request: {
        number: 1,
      },
    },
  },
}));

// Mock the action's main function
const runMock = jest.spyOn(main, "run");

// Mock the GitHub Actions core library
// let debugMock: jest.SpiedFunction<typeof core.debug>;
let errorMock: jest.SpiedFunction<typeof core.error>;
let getInputMock: jest.SpiedFunction<typeof core.getInput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
// let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;

describe("action", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // debugMock = jest.spyOn(core, "debug").mockImplementation();
    errorMock = jest.spyOn(core, "error").mockImplementation();
    getInputMock = jest.spyOn(core, "getInput").mockImplementation();
    setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();
    // setOutputMock = jest.spyOn(core, "setOutput").mockImplementation();
  });

  it("sets a failed status", async () => {
    getInputMock.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "token";
        case "config":
          return ".github/codeowners.yaml";
        case "num-reviewers":
          return "this is definitely not a decimal number";
        default:
          return "";
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(setFailedMock).toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
  });
});
