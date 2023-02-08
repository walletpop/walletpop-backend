const {User} = require('./User');
const {sequelize, Sequelize} = require('./db');

// User.hasMany(Item);

module.exports = {
    User,
    sequelize,
    Sequelize
};
