const db = require("./db");
const {DataTypes} = require("sequelize");

class ItemSold extends Model {};

ItemSold.init({
    itemID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateSold: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "ItemSold"
})

module.exports = {itemSold};
