const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

module.exports = {
  migrationsTable: 'pgmigrations',
  dir: 'migrations',
  databaseUrl: process.env.DATABASE_URL,
};
