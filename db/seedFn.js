const {sequelize} = require('./db');
const {User, Item, SoldItem} = require('./');
const {users, items, soldItems} = require('./seedData');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // recreate db
    
    await User.bulkCreate(users);
    await SoldItem.bulkCreate(soldItems);
    
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
