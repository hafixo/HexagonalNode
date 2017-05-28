var onNewBuilding = function(socket){
  socket.on("newBuilding", function(data){
    var gameID = socketList[socket.id].gameID;
    if (newBuildingAnticheat(socket, data, gameID)){
      var otherPlayer = findOtherPlayer(socket, gameID);

      //Subtract gold
      checkForOwner = require("./checkForOwner");
      var owner = checkForOwner(socket, gameID);

      gamesList[gameID].player[owner].gold -= getBuildingCost(data.building);

      //Add the building to the hex object
      gamesList[gameID].hex[data.hex].building = data.building;

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
    gamesList[gameID].hex[data.hex].owner === owner &&
    typeof data.building === "number" &&
    data.building % 1 === 0 &&
    data.building >= 0 && data.building <= 8 &&
    checkIfEnoughGoldForBuilding(data.building, gamesList[gameID].player[owner].gold)){
      return true;
    }
  else return false;
}

checkIfEnoughGoldForBuilding = function(building, goldAmount){
  var buildingCost = getBuildingCost(building);
  if (goldAmount >= buildingCost){
    return true;
  }
  else return false;
}

getBuildingCost = function(building){
  var buildingCost;
  switch(building){
    case 0:
      buildingCost = balance.farmCost;
    break;
    case 1:
      buildingCost = balance.barracksCost;
    break;
    case 2:
      buildingCost = balance.schoolOfMagicCost;
    break;
    case 3:
      buildingCost = balance.millCost;
    break;
    case 4:
      buildingCost = balance.wellCost;
    break;
    case 5:
      buildingCost = balance.templeCost;
    break;
    case 6:
      buildingCost = balance.yellowCrystalCost;
    break;
    case 7:
      buildingCost = balance.redCrystalCost;
    break;
    case 8:
      buildingCost = balance.blueCrystalCost;
    break;
  }

  return buildingCost;
}

//Export
module.exports = onNewBuilding;
