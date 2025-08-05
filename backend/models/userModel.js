import { DataTypes } from 'sequelize';
import sequelize from '../config/postgredb.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  cartData: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  timestamps: false,
  tableName: 'Users', // Explicit table name
});

export default User;
