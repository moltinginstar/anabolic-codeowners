export const getOctokit = jest.fn(() => ({
  rest: {
    pulls: {
      listFiles: jest.fn(async ({ page }) => {
        if (page === 1) {
          return Promise.resolve({
            data: Array.from({ length: 100 }, (_, i) => ({
              filename: `src/app1/file${i}.ts`,
            })),
          });
        } else if (page === 2) {
          return Promise.resolve({
            data: Array.from({ length: 100 }, (_, i) => ({
              filename: `src/app2/file${i}.ts`,
            })),
          });
        } else if (page === 3) {
          return Promise.resolve({
            data: Array.from({ length: 85 }, (_, i) => ({
              filename: `src/lib1/file${i}.ts`,
            })),
          });
        } else {
          return Promise.resolve({ data: [] });
        }
      }),

      requestReviewers: jest.fn(),
    },

    issues: {
      createComment: jest.fn(),
    },

    repos: {
      getContent: jest.fn(async ({ path }) => {
        if (path === ".github/codeowners.yaml") {
          return Promise.resolve({
            data: {
              type: "file",
              content: Buffer.from("src/**:\n  - owner1").toString("base64"),
            },
          });
        } else if (path === ".github/invalid.yaml") {
          return Promise.resolve({
            data: {
              type: "file",
              content: Buffer.from("[invalid yaml").toString("base64"),
            },
          });
        } else {
          return Promise.resolve({ data: [] });
        }
      }),
    },
  },
}));

export const context = {
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
};
