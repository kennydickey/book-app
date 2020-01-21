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
app.get('/searches/new', displaySearch);
app.post('/searches/new', collectBookSearchData);

// client.on('error', err => console.error(err));


function getHomePage(request,response){
  //getting home page
  response.status(200).render('index');
}



function displaySearch(request, response){
  //display search page
  response.status(200).render('./pages/searches/new')
}
function collectBookSearchData(request,response){
  console.log(request.body)
  let searchWord = request.body.search[0] //harry potter
  let searchType = request.body.search[1] //title

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(searchType === 'title' ){
    url += `+intitle:${searchWord}`
  } else {
    url += `+inauthor:${searchWord}`;
  }

  superagent.get(url)
    .then(agentResults => {
      //agentResults.body returns everything
      let bookArray = agentResults.body.items;
      console.log(agentResults.body.items[0].volumeInfo.authors[0])
      const betterBookArray = bookArray.map(book => new Book(book.volumeInfo))
      
      
      
      response.status(200).send(betterBookArray)
    })
    .catch((error) => console.log('this does not work, heres why: ', error));

}


function Book(obj){
  // const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = obj.title || 'No title available';
  this.authors = obj.authors || 'No author available';
  this.description = obj.description || 'No description available';
  this.publisheddate = obj.publishedDate || 'no publish date available';
}


app.listen(PORT, () => console.log(`listening on ${PORT}`));



app.get('*', (req, res) => 
  res.status(404).send('this route does not exist')
);









