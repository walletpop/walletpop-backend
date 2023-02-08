const express = require('express');
const {getUser} = require('./middleware/getUser')
const app = express();
const { PORT = 3000 } = process.env;
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config('.env');
const { User } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const config = {
  authRequired: true,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_BASE_URL
};

app.use(auth(config));
app.use(getUser)

app.get('/user', requiresAuth(), (req, res) => {
  try{
    res.send(req.user);
  }catch(e){
    console.log(e);
  }
});

app.listen(PORT, () => {
    console.log(`walletpop are ready at http://localhost:${PORT}`);
  });
