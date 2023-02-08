const {User} = require('./User');
const {SoldItem} = require('./SoldItem');
const {sequelize, Sequelize} = require('./db');

// User.hasMany(Item);

module.exports = {
    User,
    SoldItem,
    sequelize,
    Sequelize
};
