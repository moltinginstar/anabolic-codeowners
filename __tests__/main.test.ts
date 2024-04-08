import * as core from "@actions/core";
import * as main from "../src/main";

jest.mock("@actions/github");

const runMock = jest.spyOn(main, "run");

let errorMock: jest.SpiedFunction<typeof core.error>;
let getInputMock: jest.SpiedFunction<typeof core.getInput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;

describe("action", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    errorMock = jest.spyOn(core, "error").mockImplementation();
    getInputMock = jest.spyOn(core, "getInput").mockImplementation();
    setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();
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
