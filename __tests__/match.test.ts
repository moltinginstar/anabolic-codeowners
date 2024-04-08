import * as match from "../src/match";

describe("getOwnerGroups", () => {
  it("returns owner groups based on the config and modified files", () => {
    const config = {
      "*.js": ["owner1", "owner2"],
      "*.ts": ["owner4"],
      "lib/*.ts": ["owner3"],
      "*.json": ["owner4"],
    };
    const files = ["file1.js", "file2.ts", "file3.json", "file4.js"];
    const exclude = ["owner4"];

    const result = match.getOwnerGroups(config, files, exclude);

    expect(result).toEqual({
      "*.js": ["owner1", "owner2"],
    });
  });

  it("returns an empty object if no owner groups are found", () => {
    const config = {
      "*.js": ["owner1", "owner2"],
      "*.ts": ["owner4"],
      "lib/*.ts": ["owner3"],
      "*.json": ["owner4"],
    };
    const files = ["README.md", "codeowners.yaml"];

    const result = match.getOwnerGroups(config, files);

    expect(result).toEqual({});
  });

  it("excludes specified owners", () => {
    const config = {
      "**/*": ["owner1", "owner2"],
    };
    const files = ["file1.js"];
    const exclude = ["owner2"];

    const result = match.getOwnerGroups(config, files, exclude);

    expect(result).toEqual({
      "**/*": ["owner1"],
    });
  });

  it("excludes empty owner groups from the result", () => {
    const config = {
      "**/*": ["owner1", "owner2"],
    };
    const files = ["file1.js"];
    const exclude = ["owner2", "owner1"];

    const result = match.getOwnerGroups(config, files, exclude);

    expect(result).toEqual({});
  });

  it("returns only the last matching rule for each file", () => {
    const config = {
      "**/*": ["owner1"],
      "**/*.js": ["owner2"],
      ".github/codeowners.yaml": null,
      "!**/*.ts": ["owner4"],
      "*.js": ["owner5"],
    };
    const files = ["lib/src/file1.js"];

    const result = match.getOwnerGroups(config, files);

    expect(result).toEqual({
      "!**/*.ts": ["owner4"],
    });
  });

  it("returns each owner only once per owner group", () => {
    const config = {
      "**/*": ["owner1", "owner1", "owner2"],
    };
    const files = ["file1.js"];

    const result = match.getOwnerGroups(config, files);

    expect(result).toEqual({
      "**/*": ["owner1", "owner2"],
    });
  });

  it("returns an empty object if the config is empty", () => {
    const config = {};
    const files = ["file1.js"];
    const exclude = ["owner1"];

    const result = match.getOwnerGroups(config, files, exclude);

    expect(result).toEqual({});
  });
});

describe("chooseReviewers", () => {
  it("returns a list of reviewers based on the owner groups", () => {
    const ownerGroups = {
      "*.js": ["owner1", "owner2"],
      "*.ts": ["owner3"],
    };
    const numReviewers = 2;

    const result = match.chooseReviewers(ownerGroups, numReviewers);

    const groups = Object.values(ownerGroups).flat();
    result.forEach((reviewer) => expect(groups).toContain(reviewer));
  });

  it("returns a list of reviewers with unique elements", () => {
    const ownerGroups = {
      "*.js": ["owner1", "owner2"],
      "*.ts": ["owner3"],
    };
    const numReviewers = 10;

    const result = match.chooseReviewers(ownerGroups, numReviewers);

    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });
});
