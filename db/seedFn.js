const {sequelize} = require('./db');
const {User} = require('./');
const {users} = require('./seedData');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // recreate db
    await User.bulkCreate(users);
  } catch (error) {
    console.error(error);
  }
};

module.exports = seed;
