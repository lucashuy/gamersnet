let clients = []

function webSocketOnConnect(websocket){
    console.log("client connected")
    

    websocket.on("message", function(message){
        // console.log("Received: " + message);

        var myMessage = JSON.parse(message);
        console.log(myMessage)

        // user sends a receiver userID everytime a web socket is connected
        if(myMessage.type == "userID"){

            // store the client and it's corresponding userID in order to send the message
            // inefficient but works for now
            clients.push({client : websocket, userID : myMessage.userID})
        }
        else if(myMessage.type == "message"){

            // message contains who to send the message to (receiver's userID)
            // only send it to the receiver; not anyone else (one-to-one chat)
            var receiver = clients.find(function (receiver) { return receiver.userID === myMessage.receiver; });

            // client socket that sent the message
            var sender = clients.find(function (sender) { return sender.client === websocket; });

            // also if the client is not online or even not connected to the socket, don't need to send anything
            // we can have chat notification systen for users when they are not online
            // send the message to the receiver and pass in the userID of the sender

            if(receiver == null){
                console.log("client is not online")
            }
            else{
                receiver.client.send(JSON.stringify({
                    userID: sender.userID,
                    message: myMessage.message
                }));
            }
        }

    });

    websocket.on("close", function(){
        console.log("client has disconnected");
        var clientToBeDeleted = clients.find(function (sender) { return sender.client === websocket; });
        var index = clients.indexOf(clientToBeDeleted);
        delete clients[index];
    })
}

module.exports = { webSocketOnConnect };