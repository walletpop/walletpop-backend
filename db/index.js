const {User} = require('./User');
const {SoldItem} = require('./SoldItem');
const {Item} = require('./Item');
const {sequelize, Sequelize} = require('./db');

User.hasMany(Item, {foreignKey: 'ownerId'});
Item.belongsTo(User, {foreignKey: 'ownerId'});

Item.hasOne(SoldItem, {foreignKey: 'itemId'});
SoldItem.belongsTo(Item, {foreignKey: 'itemId'});

User.hasMany(SoldItem, {foreignKey: 'buyerId'})
SoldItem.belongsTo(User, {foreignKey: 'buyerId'});



module.exports = {
    User,
    SoldItem,
    Item,
    sequelize,
    Sequelize
};
