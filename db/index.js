const {User} = require('./User');
const {Item} = require('./Item');
const {sequelize, Sequelize} = require('./db');

Item.belongsTo(User, {foreignKey: 'ownerId'})
User.hasMany(Item);

module.exports = {
    User,
    Item,
    sequelize,
    Sequelize
};
