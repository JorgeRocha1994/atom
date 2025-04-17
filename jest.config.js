module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/src/app/core/$1",
    "^@shared/(.*)$": "<rootDir>/src/app/shared/$1",
    "^@application/(.*)$": "<rootDir>/src/app/application/$1",
    "^@domain/(.*)$": "<rootDir>/src/app/domain/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/app/infrastructure/$1",
    "^@pages/(.*)$": "<rootDir>/src/app/pages/$1",
    "^@environments/(.*)$": "<rootDir>/src/environments/$1",
  },
};
