const {User} = require('./User');
const {SoldItem} = require('./SoldItem');
const {Item} = require('./Item');
const {sequelize, Sequelize} = require('./db');

Item.belongsTo(User, {foreignKey: 'ownerId'})
User.hasMany(Item);

module.exports = {
    User,
    SoldItem,
    Item,
    sequelize,
    Sequelize
};
