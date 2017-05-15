var onTrainUnits = function(socket){
  socket.on("trainUnits", function(data){
    //Data: {hex, actionType, units, amount}
    console.log(data);
    var gameID = socketList[socket.id].gameID;
    if (trainUnitsAnticheat(socket, data, gameID)){
      changeHexagonValues(data, gameID);
      sendTrainInfoToOtherPlayer(socket, data, gameID);
    }
    else {
      caughtCheating(socket);
    }
  });
}

//Zde bude potřeba přidat ještě ochranu proti trénování jednotek v cizí zemi. Zatím ale není hotové vlastnictví zemí, proto to nechávám na později.
trainUnitsAnticheat = function(socket, data, gameID){
  if (socket.playing && gamesList[gameID].hex[data.hex] !== undefined){
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
  else
    return false;
}

checkForCorrectBuildingWithUnits = function(data, units){
  if (data.units === units)
    return true;
  else
    return false;
}

changeHexagonValues = function(data, gameID){
  if (data.actionType === "train"){
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
