const {Router} = require("express");
const soldRouter = Router();
const { User, SoldItem } = require('../db');

soldRouter.get('/', async (req, res) => {
    try{
        const soldItems = await SoldItem.findAll();
        res.status(200).send(soldItems);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.get('/user/:buyer_id', async (req, res) => {
    try{
        const itemsSoldByUser = await SoldItem.findAll({ where: {buyerId: req.params.buyer_id} });
        res.status(200).send(itemsSoldByUser);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.put('/:id', async (req, res) => {
    try{
        const item = await SoldItem.findByPk(req.params.id);
        const user = await User.findByPk(req.cookies.userId);

        if (item.buyerId === user.id || user.isAdmin) {
            const editedSoldItem = await item.update(req.body, {where: {id: req.params.id}});

            res.status(200).send(editedSoldItem);
        } else {
            res.status(400).send("You are not authorised to edit this item as you are not its owner or the admin.");
        }
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.delete('/:id', async (req, res) => {
    try{
        const item = await SoldItem.findByPk(req.params.id);
        const user = await User.findByPk(req.cookies.userId);

        if (item.buyerId === user.id || user.isAdmin) {
            const editedSoldItem = await item.destroy();
            res.status(200).send(editedSoldItem);
        } else {
            res.status(400).send("You are not authorised to delete this item as you are not its owner or the admin.");
        }
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

module.exports = soldRouter;
