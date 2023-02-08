const express = require('express');
const {checkDuplicateUsernameOrEmail} = require('./middleware/checkUsernameDuplicate');
const app = express();
const { PORT = 3000 } = process.env;
require('dotenv').config('.env');
const { User } = require('./db');
const jwt = require("./middleware/authJwt");
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(checkDuplicateUsernameOrEmail);

app.post('/signout', async(req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
});


app.post('/register', async (req, res) => {
    // Save User to Database
    try {
      const user = await User.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      res.send({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
});

app.post('/signin', async(req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    req.session.token = token;

    return res.status(200).send({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.get('/user/:id', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`walletpop are ready at http://localhost:${PORT}`);
  });
