import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not defined. Set DATABASE_URL in your environment or .env before running migrations.',
  );
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },

  entities: ['src/infrastructure/database/schemas/*.entity.ts'],
  migrations: ['src/infrastructure/database/migrations/*.ts'],

  synchronize: false,
});
