module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start -- --port 3012",
      url: ["http://127.0.0.1:3012/", "http://127.0.0.1:3012/services/website-development", "http://127.0.0.1:3012/blog/website-development-cost-2026"],
      numberOfRuns: 3,
      settings: { preset: undefined, formFactor: "mobile", screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1.75, disabled: false } },
    },
    assert: { assertions: {
      "categories:performance": ["error", { minScore: 0.95 }],
      "categories:accessibility": ["error", { minScore: 0.95 }],
      "categories:best-practices": ["error", { minScore: 0.95 }],
      "categories:seo": ["error", { minScore: 0.95 }],
      "largest-contentful-paint": ["error", { maxNumericValue: 2000 }],
      "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
    } },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse" },
  },
};
