const {Sequelize, sequelize} = require('./db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    location: Sequelize.INTEGER,
    isAdmin: Sequelize.BOOLEAN
  });

  module.exports = { User };
