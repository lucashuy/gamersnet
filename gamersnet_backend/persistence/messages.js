'use strict';

const { ObjectID } = require('bson');
let MongoDB = require('./mongodb');

/**
 * Get all the messages between sender and receiver
 * All parameters should be string type to be consistent
 * @param {*} userID1 userId of the sender of this message
 * @param {*} userID2 userId of the receiver of this message
 * 
 */
async function getMessagesBetweenUsers(userID1, userID2){

    // wait for db connection and get then get messages collection
    let db = await MongoDB.open();
  
    let messages = db.collection('messages');

    let chat = await messages.find({"sender" : ObjectID(userID1), "receiver" : ObjectID(userID2)});

    return chat.toArray();
}

/**
 * Adds a message to the db
 * All parameters should be string type to be consistent and avoid confusion
 * @param {*} sender userId of the sender of this message
 * @param {*} receiver userId of the receiver of this message
 * @param {*} message message itself 
 * @param {*} timestamp timestamp of the message sent, Unix epoch format
 * 
 */
 async function addMessage(sender, receiver, message, timestamp) {

    // wait for db connection and get users collection
    let db = await MongoDB.open();
  
    let messages = db.collection('messages');
  
    return await messages.insertOne({
        sender : sender,
        receiver : receiver,
        message : message,
        timestamp : timestamp
    });
  }

async function getInteractions(userID){

    // wait for db connection and get then get messages collection
    let db = await MongoDB.open();
  
    let messages = db.collection('messages');

    //find messages with the user as either sender or receiver
    let interactions = await messages.find({ $or: [{ sender: ObjectID(userID) }, { receiver: ObjectID(userID) }] });

    return interactions.toArray();
}
  

  module.exports = { addMessage, getMessagesBetweenUsers, getInteractions };