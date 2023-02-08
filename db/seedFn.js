const {User, Item, sequelize} = require('./');
const {users, items} = require('./seedData');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // recreate db
    const createdUsers = await User.bulkCreate(users);
    const createdItems = await Item.bulkCreate(items);

    for(let i=0; i<createdItems.length; ++i){
      let item = createdItems[i];
      const user = createdUsers[i];
      await user.addItems([item]);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = seed;
