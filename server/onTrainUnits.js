var onTrainUnits = function(socket){
  socket.on("trainUnits", function(data){
    //Data: {hex, actionType, units, amount}
    var gameID = socketList[socket.id].gameID;
    if (trainUnitsAnticheat(socket, data, gameID)){
      changeHexagonValues(socket, data, gameID);
      sendTrainInfoToOtherPlayer(socket, data, gameID);
    }
    else {
      caughtCheating(socket);
    }
  });
}

trainUnitsAnticheat = function(socket, data, gameID){
  checkForOwner = require("./checkForOwner");
  var owner = checkForOwner(socket, gameID);

  if (socket.playing &&
    typeof data.amount === "number" &&                        //jestli se jedná o číslo
    data.amount % 1 === 0 && data.amount >= 0 &&              //jestli se jedná o celé číslo
    gamesList[gameID].hex[data.hex] !== undefined &&
    gamesList[gameID].hex[data.hex].owner === owner &&
    checkForCorrectActionType(data, gameID) &&
    checkIfEnoughGoldForTraining(data, gamesList[gameID].player[owner].gold)){
      return true;
  }
  else
    return false;
}

checkForCorrectActionType = function(data, gameID){
  switch(data.actionType){
    case "train":
      switch(gamesList[gameID].hex[data.hex].building){
        case 0:
          return checkForCorrectBuildingWithUnits(data, "workers");
          break;

        case 1:
          return checkForCorrectBuildingWithUnits(data, "soldiers");
          break;

        case 2:
          return checkForCorrectBuildingWithUnits(data, "mages");
          break;

        default:
          return false;
          break;
        }
      break;

    case "dismiss":
      if (data.units === "soldiers" || data.units === "mages")
        return true;
      else
        return false;
      break;

    default:
      return false;
      break;
  }
}

checkForCorrectBuildingWithUnits = function(data, units){
  if (data.units === units)
    return true;
  else
    return false;
}

checkIfEnoughGoldForTraining = function(data, goldAmount){
  if (data.actionType === "train"){
    var unitCost = getUnitCost(data.units);
    if (goldAmount >= unitCost*data.amount){
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return true;
  }
}

getUnitCost = function(units){
  var cost;
  switch(units){
    case "workers":
      cost = balance.workerCost;
      break;
    case "soldiers":
      cost = balance.soldierCost;
      break;
    case "mages":
      cost = balance.mageCost;
      break;
  }

  return cost;
}

changeHexagonValues = function(socket, data, gameID){
  if (data.actionType === "train"){
    //Subtract gold
    checkForOwner = require("./checkForOwner");
    var owner = checkForOwner(socket, gameID);
    var unitCost = getUnitCost(data.units)

    gamesList[gameID].player[owner].gold -= unitCost*data.amount;

    //Create units
    var unitsWaiting = data.units + "Waiting";
    gamesList[gameID].hex[data.hex][unitsWaiting] += data.amount;
  }
  else {
    //If the amount is somehow (cheating) higher than the amount of units in the hexagon, it will be lowered
    var actualAmount = lowerAmount(data, gameID);

    //Dismiss
    gamesList[gameID].hex[data.hex][data.units] -= actualAmount;
  }
}

lowerAmount = function(data, gameID){
  var actualAmount;
  if (data.amount > gamesList[gameID].hex[data.hex][data.units]){
    actualAmount = gamesList[gameID].hex[data.hex][data.units];
  }
  else {
    actualAmount = data.amount;
  }
  return actualAmount;
}

sendTrainInfoToOtherPlayer = function(socket, data, gameID){
  var otherPlayer = findOtherPlayer(socket, gameID);

  //Send information to the other player
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var unitsWaiting = data.units + "Waiting";
      sendData = {
        hex:data.hex,
        unitsType:data.units,
        unitsWaitingAmount:gamesList[gameID].hex[data.hex][unitsWaiting],
        unitsAmount:gamesList[gameID].hex[data.hex][data.units]
      }
      sock.emit("enemyTrainUnits", sendData);
    }
  }
}

//Export
module.exports = onTrainUnits;
