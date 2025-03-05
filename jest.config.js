/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transforma arquivos TS e TSX
  },
  globals: {
    "ts-jest": {
      isolatedModules: true, // Pode ajudar em alguns casos
    },
  },
};
