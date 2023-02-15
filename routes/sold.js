const {Router} = require("express");
const soldRouter = Router();
const { SoldItem } = require('../db');

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

module.exports = soldRouter;
