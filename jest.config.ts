import nextJest from "next/jest";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },


  testMatch: ["**/JestTests/**/*.test.[jt]s?(x)"],


  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/",             
    "/playwright-report/",
    "/.next/",
  ],
};

export default createJestConfig(config);
