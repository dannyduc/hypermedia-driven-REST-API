var fortune = require('fortune');

var app = fortune({
    db: "./db/hypermovies",
    baseUrl: "http://localhost:4000"
});

// http://localhost:4000/movies
// {"movies":[{ "title":"The Life Aquatic with Steve Zissou", "director":"33efSIDdpqCm1TIx", "cast":["7CPUonUxXqwbVpZv", "7a1OTMCq5jzalXfE"] }]}
// {"movies":[{ "title":"The Royal Tenenbaums", "rating":"3", "director":"33efSIDdpqCm1TIx", "cast":["7CPUonUxXqwbVpZv", "7a1OTMCq5jzalXfE", "J1bjh4xXfyuTUBi2"] }]}
app.resource('movie', {
    title: String,
    rating: Number,
    director: 'director',
    cast: ['actor']
});

// http://localhost:4000/directors
// {"directors":[{"name":"Wes Anderson"}]}
// {"directors":[{"name":"J.J. Abrams"}]}
app.resource('director', {
    name: String,
    movies: ['movie']
});

// http://localhost:4000/actors
// http://localhost:4000/actors/7CPUonUxXqwbVpZv,7a1OTMCq5jzalXfE
// {"actors":[{"name":"Owen Wilson"}]}
// {"actors":[{"name":"Bill Murray"}]}
// {"actors":[{"name":"Danny Glover"}]}
app.resource('actor', {
    name: String,
    movie: ['movie']
});

app.listen(4000);

