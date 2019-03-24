//connections compulsory to start a mongodb connection

//get all the libraries needed
const graphqlHTTP = require('express-graphql');
const {GraphQLSchema} = require('graphql');
const {queryType} = require('./query.js');
// Define the Schema
const schema = new GraphQLSchema({ query: queryType });

const imdb = require('./src/imdb');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://Lala:Hiba@cluster0-nkn7j.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "movies";
var app = Express();
var collection, database;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//Setup the nodejs GraphQL server
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));


app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db("Lala");
        collection = database.collection(DATABASE_NAME);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/movies/:id", (request, response) => {
      // var date = ""; var review = "";
	  collection.updateOne({ "id": request.params.id },{$set : {"date": request.body.date , "review": request.body.review}}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/movies/search", (request, response) => {
    var limit = 5, metascore = 0;
    if((""+(request.query.metascore)) != "undefined"){
      metascore = request.query.metascore;
	  // console.log(typeof(metascore));
	// console.log(metascore);
    }
    if((""+(request.query.limit))!= "undefined"){
      limit = request.query.limit;
	  // console.log(typeof(limit));
	  // console.log(limit);
    }
    collection.aggregate([ {$match : {metascore : {$gt:Number(metascore)} }},{$sort : {"metascore" : -1}} ] ).limit(Number(limit)).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies/:id", (request, response) => {
    collection.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies/populate", async(request, response) => {
	var movies = await imdb('nm0000243');
    collection.insertMany(movies, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        return response.send(result);
    });
});

app.get("/movies", async(request, response) => {
    collection.aggregate([{$match :{metascore :{$gt : 70}}},{$sample: { size: 1 } }]).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
		//console.log(result.result);
        response.send(result);
    });
});

//mongoimport --uri "mongodb+srv://Lala:Hiba@cluster0-nkn7j.mongodb.net/test?retryWrites=true" --collection Lala --drop --file C:\Users\Adm\Downloads\ESILV\ESILV-4A\S8\Web Architecture\denzel\list_movies.json
app.listen(5000);
console.log(`GraphQL Server Running at localhost:${5000}`);