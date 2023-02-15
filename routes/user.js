const {Router} = require("express");
const userRouter = Router();
const { User } = require('../db');
const {verifyToken} = require('../middleware/authJwt');

userRouter.use(verifyToken);

userRouter.get('/', async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (e){
        return res.status(500).send({ message: error.message });
    }

})

userRouter.get(':id', async (req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(400).send({
            message: "Failed! User not found!"
          });
        }
        res.status(200).send(user);
      }catch(e){
        return res.status(500).send({ message: error.message });
      }
});

module.exports = userRouter;
