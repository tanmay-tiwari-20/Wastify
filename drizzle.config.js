export default {
    dialect: "postgresql",
    schema: "./src/utils/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
      url: "postgresql://neondb_owner:npg_7MDqXP2vgCER@ep-cool-rice-a5se3gci-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
      connectionString:
        "postgresql://neondb_owner:npg_7MDqXP2vgCER@ep-cool-rice-a5se3gci-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    },
  };
  