const {Router} = require("express");
const userRouter = Router();
const { SoldItem } = require('../db');
const {verifyToken, isAdmin} = require('../middleware/authJwt');
userRouter.use(verifyToken);

userRouter.get('/', async (req, res) => {
    try{
        const soldItems = await SoldItem.findAll();
        res.status(200).send(soldItems);
    } catch (e){
        return res.status(500).send({ message: error.message });
    }
});

module.exports = userRouter;
