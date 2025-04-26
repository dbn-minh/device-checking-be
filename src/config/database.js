import { Sequelize } from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(config.database, config.user, config.pass, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false, // Tắt log query SQL nếu không cần
});

// Kiểm tra kết nối ngay khi import
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };
