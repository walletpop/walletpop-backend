const {Sequelize, sequelize} = require('./db');

const Item = sequelize.define('item', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: Sequelize.STRING,
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  isAvailable: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  picture: Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = { Item };
