/*
Tim Kuehn
TimKuehn@iastate.edu
11/29/2023*/
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";
app.listen(port, () => {
console.log("App listening at http://%s:%s", host, port);
});
const { MongoClient } = require("mongodb");
// Mongo
const url = "mongodb://127.0.0.1:27017";
const dbName = "SensorData";
const client = new MongoClient(url);
const db = client.db(dbName);


app.get("/listData", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
    .collection("timeData")
    .find(query)
    .limit(100)
    .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
    });
    
app.get("/listData/:id", async (req, res) => {
const dataID = Number(req.params.id);
console.log("Data to find :", dataID);
await client.connect();
console.log("Node connected successfully to GET-id MongoDB");
const query = {"id": dataID };
const results = await db.collection("timeData")
.findOne(query);
console.log("Results :", results);
if (!results) res.send("Not Found, Idiot").status(404);
else res.send(results).status(200);
});

app.get("/latestID", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to MongoDB");
  
    const results = await db
      .collection("timeData")
      .find({})
      .sort({ id: -1 }) // Sort by ID in descending order
      .limit(1) // Retrieve only the first document
      .toArray();
  
    console.log("Latest ID result:", results[0]);
  
    if (results.length === 0) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send(results[0]);
    }
  });