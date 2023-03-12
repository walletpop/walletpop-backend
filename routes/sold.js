const {Router} = require("express");
const soldRouter = Router();
const { User, Item, SoldItem } = require("../db");
const {isAdmin} = require("../middleware/authJwt");


soldRouter.get('/', async (req, res) => {
    try{
        const user = await User.findByPk(req.cookies.userId)
        if (user.isAdmin) {
            const allSoldItems = await SoldItem.findAll();
            res.status(200).send(allSoldItems);
        } else {
            const soldItems = await SoldItem.findAll({
                where: {
                    buyerId: user.id
                }
            });
            res.status(200).send(soldItems);
        }
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.get("/:id", async (req, res) => {
    try{
        const user = await User.findByPk(req.cookies.userId)
        const soldItem = await SoldItem.findByPk(req.params.id);

        if (user.isAdmin || soldItem.buyerId == req.cookies.userId) {
            res.status(200).send(soldItem);
        } else {
            return res.status(401).send({ message: "Unauthorized!" })
        }

    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.post("/", async (req, res) => {
    try{
        const {itemId, dateSold} = req.body;
        const item = await Item.findByPk(itemId);
        item.update({isAvailable: false});
        let soldItem = null;
        if(dateSold) {
            soldItem = await item.createSoldItem({dateSold});
        } else {
            soldItem = await item.createSoldItem();
        }
        await soldItem.setBuyer(req.cookies.userId);
        res.status(200).send(soldItem);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.delete("/:id", isAdmin, async (req, res) => {
    try{
        console.log(req.params.id);
        const item = await SoldItem.findByPk(req.params.id);
        console.log(item);
        await item.destroy();
        res.status(200).send("Sold item deleted successfully!");

    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

module.exports = soldRouter;
