require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const movieObject = require('./movieData.json');

//users can search movies by genre, country, or avg-vote
// endpoint is /movie
//search is on query strings
// search is case insenstive and includes specified string
//avg vote is based on greater than or equal supplied number
// you receive an array of objects
// needs to have a bearer token


const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: 'Uauthorized request' })
  }

  next();
});

function handleRequest(req, res) {
  const {genre, country, avg_vote} = req.query ;
  
  let response = movieObject.movieData;

  if(!genre && !country && !avg_vote) {
    res
      .status(400)
      .send('Please select a search criterion');
  }

  

  if(genre && (!country && !avg_vote )) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase()));
    res.json(response);

  }

  if(country && (!genre && !avg_vote ) ) {
    if(country.length <= 2) {
      res
        .status(400)
        .send('Please spell out country in it\'s entirety');
    }
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase()))
    
      res.json(response)
  }

  if(avg_vote && (!genre && !country ) ) {
    response = response.filter(movie => {
      return Number(movie.avg_vote) > Number(avg_vote)})
    
      res.json(response)
  }

}


app.get('/moviedex', handleRequest)

app.listen(8000, () => {
  console.log('I\'m listenting - Frazier')
})
