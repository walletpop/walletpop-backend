const {Sequelize, sequelize} = require('./db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
    email: {
      type:Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    // password: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // },
    location: Sequelize.STRING,
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  module.exports = { User };
