var express = require('express');
var mongo = require('mongodb');
var BodyParser = require('body-parser');

var app = express();
var mongoClient = mongo.MongoClient;
var url = "mongodb://database:27017/";
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

var catalogue = []

app.get("/search/:searchKeyword", (request, response) => {

    var input = request.params.searchKeyword
    var request = require('request');
        request('http://searchlog:8081/searchLog/'+input, function (error, response, body) {})
        collection.find({"$text": {"$search": input}}).toArray(function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        for(let obj of result) {
          var content = {}
          content['book_title'] = obj['book_title']
          content['author_name'] = obj['author_name']
          catalogue.push(content); 
        }  
        response.send(result);
    });
});

app.get("/getcCtalogue", (request,response) => {
  response.send(catalogue)
});

app.listen(8080, function () {
    DATABASE_NAME = "CSCI5409"
    console.log('Example app listening on port 8080!');
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true }, (error, client) => {
      if(error) {
          throw error;
      }
      database = client.db(DATABASE_NAME);
      collection = database.collection("book_details");
      console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});