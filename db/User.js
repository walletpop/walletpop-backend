const {Sequelize, sequelize} = require('./db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
    email: {
      type:Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: Sequelize.INTEGER,
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  module.exports = { User };
