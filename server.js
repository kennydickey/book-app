'use strict';

//dependancies
const express = require('express')
const pg = require('pg')
const superagent = require('superagent');

//environment variables
require ('dotenv').config();
require('ejs');

//application setup
const app = express();
const PORT = process.env.PORT || 3001;

//database setup
const client = new pg.Client(process.env.DATABASE_URL) //make sure to declare in .env
client.connect(); //from demo
client.on('error', err => console.error(err));

//express middleware
//body-parser
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

//setting up view engine
app.set('view engine', 'ejs');

//from demo
// app.get('/', getBooks);

// function getBooks(request, response) {
//   let SQL = 'SELECT * FROM books;';
//   client.query(SQL)
//     .then(results => {
//       response.status(200).send(results);
//     })
// }




//routes
app.get('/', getHomePage);
app.get('/searches/new', displaySearch);
app.post('/searches/new', collectBookSearchData);
app.get('/error', displayError);

// client.on('error', err => console.error(err));


function getHomePage(request,response){
  //go to database, get all of the saved books and display
  //getting home page
  response.status(200).render('index');
}
function displaySearch(request, response){
  //display search page
  response.render('pages/searches/new');
}
function displayError(request, response){
  response.status(400).render('pages/error');
}
// function showResult(request, response){
//   response.status()
// }

function collectBookSearchData(request,response){
  // console.log(request.body)
  let searchWord = request.body.search[0]; //harry potter
  let searchType = request.body.search[1]; //title


  let url = `https://www.googleapis.com/books/v1/volumes?q=`;

  if(searchType === 'title' ){
    url += `+intitle:${searchWord}`;
  }
  if(searchType === 'author') {
    url += `+inauthor:${searchWord}`;
  }


  superagent.get(url)
    .then(agentResults => {
      //agentResults.body returns everything
      let bookArray = agentResults.body.items;
      // console.log(agentResults.body.items[0].volumeInfo.authors[0])
      return bookArray.map(book => new Book(book.volumeInfo))
    })
    //results of bookarray.map
    .then(results => response.render('pages/searches/show', { results: results }))

    .catch((error) => console.log('this does not work, heres why: ', error));

}


function Book(obj){
  // const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  //same below with if else ternary vv
  // this.bookImage = obj.imageLinks;

  obj.imagelinks !== undefined ? this.bookImage = obj.imageLinks.thumbnail.replace('http:', 'https:') : this.bookImage = obj.imageLinks.thumbnail;
  //|| 'https://i.imgur.com/J5LVHEL.jpg';

  obj.title !== undefined ? this.title = obj.title : this.title = 'no title available'

  obj.authors !== undefined ? this.authors = obj.authors : this.authors = 'no authors available'

  obj.description !== undefined ? this.description = obj.description : this.description = 'no description available'

  obj.publisheddate !== undefined ? this.publisheddate = obj.publisheddate : this.publisheddate = 'no publisheddate available'

}



app.get('*', (req, res) =>
  res.status(404).send('this route does not exist')
);

app.listen(PORT, () => console.log(`listening on ${PORT}`));







