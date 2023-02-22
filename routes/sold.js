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
                    model: Item,
                    include: [User]
                },
                {
                    model: User,
                    as: "buyer"
                }
            ]
        });
        res.status(200).send(soldItems);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.get("/user/:buyer_id", async (req, res) => {
    try{
        const soldItems = await SoldItem.findAll({
            where: {buyerId: req.params.buyer_id},
            include: [
                {
                    model: Item,
                    include: [User]
                },
                {
                    model: User,
                    as: "buyer"
                }
            ]
        });
        res.status(200).send(soldItems);
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

soldRouter.post("/", async (req, res) => {
    try{
        const {dateSold, itemId, buyerId} = req.body;
        const newSoldItem = await SoldItem.create({dateSold});
        await newSoldItem.setItem(itemId);
        await newSoldItem.setBuyer(buyerId);
        res.status(200).send(newSoldItem);
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
        res.status(200).send("Sold item deleted successfully!");
    } catch (error){
        return res.status(500).send({ message: error.message });
    }
});

module.exports = soldRouter;
