import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    // .claude/worktrees holds throwaway git worktrees. Their test files are
    // stale copies, but the "@" alias below still resolves to the real ./src,
    // so collecting them runs old assertions against current code.
    exclude: [...configDefaults.exclude, "**/.claude/**"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
