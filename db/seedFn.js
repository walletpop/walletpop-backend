const {sequelize} = require('./db');
const {User, Item, SoldItem} = require('./');
const {users, items} = require('./seedData');
const bcrypt = require("bcryptjs");

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // recreate db

    const createdUsers = [];

    for(let i = 0; i<users.length; i++){
      createdUsers.push(await User.create({email: users[i].email, password: bcrypt.hashSync(users[i].password, 8)}));
    }

    const createdItems = await Item.bulkCreate(items);

    for(let i=0; i<createdItems.length; ++i){
      let item = createdItems[i];
      const user = createdUsers[i];
      await user.addItem(item);

      const soldItem = await item.createSoldItem()
      await soldItem.setUser(createdUsers[i + 1]);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = seed;
