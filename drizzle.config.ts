import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require",
  },
});
