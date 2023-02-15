const {Router} = require("express");
const itemRouter = Router();
const { User, Item } = require('../db');
const {verifyToken, isAdmin} = require('../middleware/authJwt');
itemRouter.use(verifyToken);

itemRouter.get('/', async (req, res) => {
    try{
        const allItems = await Item.findAll();
        res.status(200).send(allItems);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }

})

itemRouter.get('/:item_id', async (req, res) => {
    try{
        const item = await Item.findByPk(req.params.item_id);
        if (!item) {
          return res.status(400).send({
            message: "Failed! Item not found!"
          });
        }
        res.status(200).send(item);
      }catch(error){
        return res.status(500).send({ message: error.message });
      }
});

itemRouter.get('/user/:user_id', async (req, res) => {
  try{
      const userItems = await Item.findAll({where: {ownerId: req.params.user_id}});
      res.status(200).send(userItems);
    }catch(error){
      return res.status(500).send({ message: error.message });
    }
});


itemRouter.post('/', async (req, res) => {
  try{
      const user = await User.findByPk(req.cookies.userId);
      const item = await user.createItem(req.body);

      res.status(200).send(item);
    }catch(e){
      return res.status(500).send({ message: error.message });
    }
});


itemRouter.put('/:item_id', async (req, res) => {
  try{
      const item = await Item.findByPk(req.params.item_id);
      if (item.ownerId === req.cookies.userId) {
        const updatedItem = await item.update(req.body, {where: {id: req.params.item_id}});
        res.status(200).send(updatedItem);
      }else {
        res.status(400).send("You are not the owner of that item. You can not modify this item.");
      }
    }catch(error){
      return res.status(500).send({ message: error.message });
    }
});

itemRouter.delete('/:item_id', async (req, res) => {
  try{
      const item = await Item.findByPk(req.params.item_id);
      if (item.ownerId === req.cookies.userId) {
        await item.destroy();
        res.status(200).send("Item deleted successfully.");
      }else {
        res.status(400).send("You are not the owner of that item. You can not modify this item.");
      }
    }catch(error){
      return res.status(500).send({ message: error.message });
    }
});

module.exports = itemRouter;
