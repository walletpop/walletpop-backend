checkIfEmailOrPasswordIsMissing = async (req, res, next) => {

    if(!req.body.email || !req.body.password){
        const missingItem = !req.body.email ? 'email' : 'password';
        return res.status(500).send({
            message: `Please introduce your ${missingItem}!`
          });
    }
    next();
  };

  module.exports = {checkIfEmailOrPasswordIsMissing};
