'use strict';

let MongoDB = require('./mongodb');

/**
 * Get all the messages between sender and receiver
 * All parameters should be string type to be consistent
 * @param {*} sender userId of the sender of this message
 * @param {*} receiver userId of the receiver of this message
 * 
 */
async function getChatBetweenUsers(sender, receiver){

    // wait for db connection and get then get messages collection
    let db = await MongoDB.open();
  
    let messages = db.collection('messages');

    // wait for the server to find all messages and return as an array
    let chat = await messages.find({"sender" : sender, "receiver" : receiver});
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

  module.exports = { addMessage, getChatBetweenUsers };