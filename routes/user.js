const {Router} = require("express");
const userRouter = Router();
const { User } = require('../db');
const {verifyToken, isAdmin} = require('../middleware/authJwt');
userRouter.use(verifyToken);

userRouter.get('/', isAdmin, async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (e){
        return res.status(500).send({ message: error.message });
    }
});

userRouter.get('/:id', async (req, res) => {
    try{
        if(req.params.id){
            const user = await User.findByPk(req.params.id);
            if (!user) {
              return res.status(400).send({
                message: "Failed! User not found!"
              });
            }
            res.status(200).send(user);
        } else {
            return res.status(400).send({
                message: "Please, provide user Id"
              });
        }

    } catch (e){
        return res.status(500).send({ message: error.message });
    }
});

module.exports = userRouter;
