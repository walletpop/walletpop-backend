const {Sequelize, sequelize} = require("./db");

const SoldItem = sequelize.define("soldItem", {
    itemID: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    userID: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dateSold: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
})

module.exports = {SoldItem};
