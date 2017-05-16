var onNewBuilding = function(socket){
  socket.on("newBuilding", function(data){
    var gameID = socketList[socket.id].gameID;
    if (newBuildingAnticheat(socket, data, gameID)){
      console.log(data);
      var otherPlayer = findOtherPlayer(socket, gameID);

      //Add the building to the hex object
      gamesList[gameID].hex[data.hex].building = data.building;
        //console.log("Hexagon " + data.hex + " has new building with id " + data.building + "!");

      //Send information about the new building to the other player
      for(var i in socketList){
        if (parseFloat(i) === otherPlayer){
          var sock = socketList[i];
          sendData = {
            hex:data.hex,
            building:data.building
          }
          sock.emit("enemyPlaceBuilding", sendData);
        }
      }
    }
    else {
      caughtCheating(socket);
    }
  });
}

newBuildingAnticheat = function(socket, data, gameID){
  checkForOwner = require("./checkForOwner");
  var owner = checkForOwner(socket, gameID);
  if (socket.playing &&
    gamesList[gameID].hex[data.hex] !== undefined &&
    gamesList[gameID].hex[data.hex].building === -1 &&
    gamesList[gameID].hex[data.hex].owner === owner){
      return true;
    }
  else return false;
}

//Export
module.exports = onNewBuilding;
