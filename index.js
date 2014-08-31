var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};

db.movies = new Datastore({ filename: 'db/movies', autoload: true});

app.get('/', function (req, res) {
    res.send("The API is working.");
})
    .listen(3000);