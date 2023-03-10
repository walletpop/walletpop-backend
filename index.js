const express = require('express');
const {checkDuplicateUsernameOrEmail} = require('./middleware/checkUsernameDuplicate');
const {checkIfEmailOrPasswordIsMissing} = require('./middleware/checkIfEmailOrPasswordIsMissing');
const app = express();
const cors = require('cors')
const { PORT = 3000 } = process.env;
require('dotenv').config();
const { User, Item } = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { Op } = require('sequelize');
const cookieParser = require('cookie-parser');

app.use(cors({ credentials: true, origin: 'http://localhost:3006' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//user endpoints
const {userRouter, itemRouter, soldRouter} = require('./routes/');

const JWT_SECRET = process.env.JWT_SECRET;

app.get('/items', async (req, res) => {
  try{
      const allItems = await Item.findAll();
      res.status(200).send(allItems);
  } catch (error){
      return res.status(500).send({ message: error.message });
  }

});

app.get('/items/filter', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: {
        [Op.or]: [
          { name: `${req.query.name || ""}` },
          { category: `${req.query.category || ""}` },
        ],
      },
    });
      res.status(200).send(items);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }

});

app.get('/items/pagination', async (req, res) => {
  const pageSize = req.query.pageSize ? req.query.pageSize : 10;
  try{
    const page = req.query.page;
    const total = await Item.findAndCountAll({
      where: { isAvailable: true },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const totalPages = Math.ceil(total.count / pageSize);

    if(page > totalPages || page <= 0){
      res.status(500).send({ message: 'No results for the page entered. Please try with different page!'});
    } else {
      res.status(200).json({'result': total.rows, 'result_count': total.rows.length,'current_page': page, 'total_pages': totalPages});
    }

    } catch(error){
      return res.status(500).send({ message: error.message });
    }
  });

  app.get('/items/:item_id', async (req, res) => {
    try{
        const item = await Item.findByPk(req.params.item_id);
        if (!item) {
          return res.status(400).send({
            message: "Failed! Item not found!"
          });
        }
        res.status(200).send(item);
      }catch(error){
        return res.status(500).send({ message: error.message });
      }
});

app.post('/signout', async(req, res) => {
  try {
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {expires: new Date(0)});
    }
      return res.status(200).send({
      message: "You've been signed out!"
    });
    res.end();
  } catch (err) {
    this.next(err);
  }
});

app.use('/user', userRouter);
app.use('/items', itemRouter);
app.use('/sold', soldRouter);

app.use(checkIfEmailOrPasswordIsMissing);

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

    res.cookie('token',token);
    res.cookie('userId',user.id);

    return res.status(200).send({
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.post('/register', checkDuplicateUsernameOrEmail,  async (req, res) => {
  // Save User to Database
  try {
    const user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      isAdmin: req.body.isAdmin
    });
    res.send({ message: "User registered successfully! Please signin now!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = app;
