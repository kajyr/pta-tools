module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "/build/"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: [],
  testMatch: ["**/*.test.ts", "**/*.test.tsx", "**/*.test.js"],
  testURL: "http://localhost/",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
