const express = require('express');
const {checkDuplicateUsernameOrEmail} = require('./middleware/checkUsernameDuplicate');
const app = express();
const { PORT = 3000 } = process.env;
require('dotenv').config();
const { User } = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//user endpoints
const userRouter = require('./routes/user');
app.use('/user', userRouter);

const JWT_SECRET = process.env.JWT_SECRET;

// app.use(checkDuplicateUsernameOrEmail);

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


app.post('/register',  async (req, res) => {
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
        email: req.body.email,
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

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    console.log(token);

    req.session = token;

    return res.status(200).send({
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`walletpop are ready at http://localhost:${PORT}`);
  });
