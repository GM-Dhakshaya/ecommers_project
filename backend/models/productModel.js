import { DataTypes } from 'sequelize';
import sequelize from '../config/postgredb.js'; // Your Sequelize connection instance

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  image: {
    type: DataTypes.ARRAY(DataTypes.STRING), // array of image URLs
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  subCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  sizes: {
    type: DataTypes.ARRAY(DataTypes.STRING), // array of sizes like ['S', 'M', 'L']
    allowNull: false,
  },

  bestseller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  date: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

export default Product;
