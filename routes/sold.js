const {Router} = require("express");
const soldRouter = Router();
const { User, Item, SoldItem } = require("../db");
const {isAdmin} = require("../middleware/authJwt");
//soldRouter.use(isAdmin);

soldRouter.get("/", async (req, res) => {
    try{
        const soldItems = await SoldItem.findAll({
            include: [
                {
                    model: Item
                },
                {
                    model: User,
                    as: "buyer"
                }
            ]
        });
        const soldItemsAsArray = soldItems.map(function (soldItems) {
            return soldItems.dataValues
        });
        soldItemsAsArray.forEach(async function (item, index) {
            const itemInfo = await Item.findByPk(item.itemId);
            const sellerInfo = await User.findByPk(itemInfo.ownerId);
            const buyerInfo = await User.findByPk(item.ownerId);
            //item.setDataValue("Item: ", itemInfo);
            //item.setDataValue("Seller: ", sellerInfo);
            //item.setDataValue("Buyer: ", buyerInfo);
        })
        res.status(200).send(soldItems);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.get("/user/:buyer_id", async (req, res) => {
    try{
        const itemsSoldByUser = await SoldItem.findAll({ where: {buyerId: req.params.buyer_id} });
        res.status(200).send(itemsSoldByUser);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.put("/:id", async (req, res) => {
    try{
        const item = await SoldItem.findByPk(req.params.id);
        const user = await User.findByPk(req.cookies.userId);
        const editedSoldItem = await item.update(req.body, {where: {id: req.params.id}});
        res.status(200).send(editedSoldItem);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.delete("/:id", async (req, res) => {
    try{
        const item = await SoldItem.findByPk(req.params.id);
        const deletedSoldItem = await item.destroy();
        res.status(200).send(deletedSoldItem);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

module.exports = soldRouter;
