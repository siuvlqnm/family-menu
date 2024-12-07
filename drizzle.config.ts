import type { Config } from 'drizzle-kit';

export default {
  schema: './functions/db/schema.ts',
  out: './migrations',
  driver: 'd1-http',
  dialect: 'sqlite',
  // dbCredentials: {
  //   // wranglerConfigPath: './wrangler.toml',
  //   // dbName: 'DB',
  // },
} satisfies Config;
