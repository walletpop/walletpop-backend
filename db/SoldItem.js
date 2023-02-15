const {Sequelize, sequelize} = require("./db");

const SoldItem = sequelize.define("soldItem", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    dateSold: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue:Sequelize.NOW
    }
})

module.exports = {SoldItem};
