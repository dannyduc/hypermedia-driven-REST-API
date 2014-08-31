var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};
var responder = require('./httpResponder');

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true});

// Necessary for accessing POST data via rea.data object
app.use(express.bodyParser());

// catch-all route to set global values
app.use(function (req, res, next) {
    res.type('applicaiton/json');
    res.locals.respond = responder.setup(res);
    next();
});

// Routes
app.get('/', function (req, res) {
    res.send("The API is working.");
});

app.get('/movies', function (req, res) {
    db.movies.find({}, res.locals.respond);
});

app.post('/movies', function (req, res) {
    db.movies.insert({title: req.body.title}, res.locals.respond);
});

app.get('/movies/:id', function (req, res) {
    db.movies.findOne({_id: req.params.id}, res.locals.respond);
});

app.put('/movies/:id', function (req, res) {
    db.movies.update({_id: req.params.id},
            req.body,
            function (err, num) {
                res.locals.respond(err, {success: num + " records updated"});
    });
});

app.delete('/movies/:id', function(req, res) {
    db.movies.remove({_id:req.params.id}, function (err, num) {
        res.locals.respond(err, {success: num + " record deleted"});
    });
});

app.post('/rpc', function(req, res) {

        var body = req.body;
        var respond = function(err, results) {
            if (err) {
                res.send(JSON.stringify(err));
            } else {
                res.send(JSON.stringify(results));
            }
        };

        res.set('Content-type', 'application/json');

        switch (body.action) {
            case "getMovies":
                db.movies.find({}, respond);
                break;
            case "addMovie":
                db.movies.insert({title: body.title}, respond);
                break;
            case "rateMovie":
                db.movies.update({title: body.title}, {
                    $set: {rating: body.rating}
                }, function (err, num) {
                    respond(err, {success: num + " records updated"});
                });
                break;
            default:
                respond({error:"No action given in request"});
        }
    })
    .listen(3000);