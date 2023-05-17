'use strict'

const express = require('express');
const server = express();
const cors = require('cors');
require('dotenv').config();
const pg = require('pg')
server.use(express.json());
server.use(cors());
let PORT =  3025||process.env.PORT ;
const axios = require('axios');
const apKey = process.env.APIkey;
const client = new pg.Client(process.env.DATABASE_URL)


server.get('/trending', trendingMov);

server.post('/addToFav', addToFav);

server.get('/favMovies', getfavMovies);

server.put('/update/:id', putupdate);

server.delete('/DELETE/:id', deletMovie);


function trendingMov(req, res) {

  let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apKey}`

  axios.get(url)

    .then(result => {
      let mapResults = result.data.results.map(item => {

        let singleMovie = new MoviesDa(item.id, item.title, item.release_date, item.poster_path, item.overview);
        return singleMovie;
      })
      res.send(mapResults)
    })
    .catch((error)=>{
      console.log('sorry you have something error',error)
      res.status(500).send(error);})
};




function addToFav(req, res) {


    console.log('We got fav movie from the FE')
    console.log(req.body)
    const favMovie = req.body
    const sql = `INSERT INTO favMovies (title, overview, poster_path, note)
    VALUES ($1,$2, $3, $4);`
    const values = [favMovie.title, favMovie.overview,favMovie.poster_path,
      favMovie.note];
    client.query(sql,values)
    .then(data=>{
        res.send("The data has been added successfully" + values);
    })
    .catch((error)=>{
      console.log('sorry you have something error',error)
      res.status(500).send(error);})

}



function getfavMovies(req,res){
  const sql = `SELECT * FROM favMovies;`;
  client.query(sql)
  .then(data=>{
      res.send(data.rows);
      console.log('data from DB', data.rows)
  }).catch((error)=>{
      errorHandler(error,req,res)
  })
};



function putupdate(req,res){
  const id = req.params.id;
  const upfavMovie = req.body;
  const sql = `UPDATE favMovies
  SET note = $1 WHERE id = ${id} RETURNING *;`;
    const values = [upfavMovie.note];
    client.query(sql,values)
    .then(data=>{
      const sql = `SELECT * FROM favMovies;`;
            client.query(sql)
                .then(allData => {
                    res.send(allData.rows)
                })
                .catch((error) => {
                    errorHandler(error, req, res)
                })
  })
  .catch((error)=>{
    console.log('sorry you have something error',error)
    res.status(500).send(error);})

}



function deletMovie(req, res){

  const id = req.params.id;
  const sql = `DELETE FROM favMovies WHERE id=${id} RETURNING *;`;
  
  client.query(sql)
  .then((delM)=>{
res.send("The data has been deleted successfully")
})
  .catch((error)=>{
    errorHandler(error,req,res)
  })
  }






server.get('*', (req, res) => {
  res.status(404).send({
    "status": 404,
    "responseText": "Sorry, page not found error"
  });
});



function MoviesDa(id, title, release_date, poster_path, overview, ) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}



client.connect()
.then(()=>{

  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
  })

})