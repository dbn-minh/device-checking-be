import dotenv from 'dotenv';
dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3390,
  user: process.env.DB_USER || 'device_user',
  pass: process.env.DB_PASS || 'device_pass',
  database: process.env.DB_NAME || 'device_checking',
  dialect: 'mysql'
};

export default config;
