// backend/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const connectionName = process.env.INSTANCE_CONNECTION_NAME; // e.g. project:region:instance
const isSocket = Boolean(connectionName);

console.log('Database Config:', {
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  host: isSocket ? `/cloudsql/${connectionName}` : process.env.DB_HOST,
  usingSocket: isSocket
  // Do not log password
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  isSocket
    ? {
        host: `/cloudsql/${connectionName}`,
        port: 5432,
        dialect: 'postgres',
        logging: false
        // No SSL required when using Unix socket
      }
    : {
        host: process.env.DB_HOST,
        port: 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
);

export default sequelize;