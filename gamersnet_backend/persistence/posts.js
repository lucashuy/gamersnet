"use strict";

let MongoDB = require("./mongodb");

async function createPostSchema(db) {
  await db.createCollection("posts", {
    strict: true,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        //required: [userId, content, gameName, numPlayers, gameTime, duration],
        properties: {
          userId: {
            bsonType: "ObjectID",
            description: "ID assigned while creating account"
          },
          content: {
            bsonType: "String",
            description: "Post description"
          },
          gameName: {
            bsonType: "String",
            description: "Game Name"
          },
          numPlayers: {
            bsonType: "int",
            description: "Number of players required"
          }
        //   gameTime: {
        //     bsonType: "Date",
        //     description: "schedule time of game"
        //   },
        //   duration: {
        //     bsonType: "String",
        //     description: "Expected duration of play"
        //   }
        }
      }
    },
    validationAction : "error"
  }, 
  function(error, collection) {
      if(error) {console.log("Collection Exists")}
  });
}

async function getPosts() {
  // connect wait for server to connect to db
  let db = await MongoDB.open();

  // once it connected, get the "posts" collection (aka a table in SQL)
  let posts = db.collection("posts");

  // wait for the server to find all posts and return as an array
  let result = await posts.find({});
  return result.toArray();
}

async function addPost(userId, description, gameName, numPlayers, gameTime, duration) {
  // wait for db connection and get users collection
  let db = await MongoDB.open();

  createPostSchema(db);

  let posts = db.collection("posts");

  // insert one row into the database
  return await posts.insertOne({
    userId: userId,
    description: description,
    gameName: gameName,
    numPlayers: numPlayers
    // gameTime: gameTime,
    // duration: duration,
  });
}

// make these two functions "public" to the rest of the project
module.exports = { getPosts, addPost };
