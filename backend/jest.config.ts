import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  verbose: true,
  forceExit: true, // Fuerza la salida si quedan conexiones abiertas (útil para integración)
  clearMocks: true,
};

export default config;
