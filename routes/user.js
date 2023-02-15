const {Router} = require("express");
const userRouter = Router();
const { User } = require('../db');
const {verifyToken, isAdmin} = require('../middleware/authJwt');
userRouter.use(verifyToken);
userRouter.use(isAdmin);

userRouter.get('/', async (req, res) => {
    try{
        if(req.query.id){
            const user = await User.findByPk(req.query.id);
            if (!user) {
              return res.status(400).send({
                message: "Failed! User not found!"
              });
            }
            res.status(200).send(user);
        } else {
            const users = await User.findAll();
            res.status(200).send(users);
        }

    } catch (e){
        return res.status(500).send({ message: error.message });
    }

})

module.exports = userRouter;
