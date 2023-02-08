const { User } = require('../db');

async function getUser(req, res, next){
    try{
        const [user, _isCreated] = await User.findOrCreate({where: {
            email: req.oidc.user.name,
        }});
        req.user = user;
        next();
    } catch(e){
        console.log(e);
        next(e);
    }
}


module.exports = {
    getUser
  }
