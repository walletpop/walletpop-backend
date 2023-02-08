const {sequelize} = require('./db');
const {User, SoldItem} = require('./');
const {users, soldItems} = require('./seedData');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // recreate db
    await User.bulkCreate(users);
    await SoldItem.bulkCreate(soldItems);
  } catch (error) {
    console.error(error);
  }
};

module.exports = seed;
