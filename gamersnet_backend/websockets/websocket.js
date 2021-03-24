function disconnected(){
    console.log("client has disconnected");
}

function messageReceived(message){
    // console.log("Received: " + message);

    var myMessage = JSON.parse(message);
    console.log(myMessage)
}

function webSocketOnConnect(websocket){
    console.log("client connected")

    websocket.on("message", messageReceived);

    websocket.on("close", disconnected)
}

module.exports = {webSocketOnConnect};