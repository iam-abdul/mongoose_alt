// vitest.config.ts
import { defineConfig } from "vitest/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  test: {
    env: process.env,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
