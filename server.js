'use strict';

const express = require('express')
const superagent = require('superagent');
require ('dotenv').config();
require('ejs');
// const pg = require('pg')

const app = express();
const PORT = process.env.PORT || 3001;

//setting up view engine
app.set('view engine', 'ejs');

app.use(express.static('./public'));

//body-parser
app.use(express.urlencoded({extended:true}));

//routes

app.get('/', getHomePage);

function getHomePage(request,response){
  //getting home page
  response.status(200).render('index');
}







app.listen(PORT, () => console.log(`listening on ${PORT}`));












app.get('*', (req, res) => 
  res.status(404).send('this route does not exist')
);









