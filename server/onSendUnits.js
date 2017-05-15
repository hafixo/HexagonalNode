var onSendUnits = function(socket){
  socket.on("sendUnits", function(data){
    //Data: {hex, moveUnitsToHex, unitsType, amount, workersKilled, magesKilled}
    //console.log(data);
    var gameID = socketList[socket.id].gameID;
    if (sendUnitsAnticheat(socket, data, gameID)){
      sendUnitsFunction(socket, data, gameID);
    }
    else {
      //caughtCheating(socket);
    }
  });
}

sendUnitsAnticheat = function(socket, data, gameID){
  //console.log("Data amount = " + data.amount);
  //console.log("Server amount = " + gamesList[gameID].hex[data.hex][data.unitsType]);
  if (socket.playing &&
    gamesList[gameID].hex[data.hex] !== undefined &&
    data.amount <= gamesList[gameID].hex[data.hex][data.unitsType] &&
    checkIfTargetHexIsAdjacent(data.hex, data.moveUnitsToHex, gameID)){
      return true;
  }
  else {
    return false;
  }
}

checkIfTargetHexIsAdjacent = function(currentHex, targetHex, gameID){
  var adjacentHexagons = [];

  for(var id in gamesList[gameID].hex){
		//Přiřadí hexagony z vedlejších sloupců
		if (Math.abs(gamesList[gameID].hex[currentHex].column - gamesList[gameID].hex[id].column) === 1)
			if (Math.abs(gamesList[gameID].hex[currentHex].line - gamesList[gameID].hex[id].line) === 0.5)
				adjacentHexagons.push(id);

		//Přiřadí hexagony ze stejného sloupce
		if (gamesList[gameID].hex[currentHex].column === gamesList[gameID].hex[id].column)
			if (Math.abs(gamesList[gameID].hex[currentHex].line - gamesList[gameID].hex[id].line) === 1)
				adjacentHexagons.push(id);
	}

  var legit = false;
  for(var key in adjacentHexagons){
    if (targetHex === adjacentHexagons[key]){
      legit = true;
      break;
    }
  }

  return legit;
}

sendUnitsFunction = function(socket, data, gameID){
  ownerInfo = getOwnerInfo(socket, data, gameID);
  //Not attacking
  if (ownerInfo.attacking === false){
    //Subtract the units from the hexagon
    gamesList[gameID].hex[data.hex][data.unitsType] -= data.amount;

    //Add the units to the recieving hexagon
    var unitWaitingType = data.unitsType + "Waiting";
    gamesList[gameID].hex[data.moveUnitsToHex][unitWaitingType] += data.amount;

    //If the new hexagon is neutral, gain control of it.
    if (gamesList[gameID].hex[data.moveUnitsToHex].owner === 0){
      gamesList[gameID].hex[data.moveUnitsToHex].owner = ownerInfo.type;
    }
  }

  //Attacking
  else {

  }

  //Send information to the other player
  sendSendInfoToOtherPlayer(socket, data, gameID);
}

getOwnerInfo = function(socket, data, gameID){
  var ownerInfo = {};
  if (gamesList[gameID].owner1 === socket.id){   //Zjistí, jaký owner je hráč, který poslal socket
    //Socket = owner 1
    ownerInfo.type = 1;
    if (gamesList[gameID].hex[data.moveUnitsToHex].owner === 2){
      ownerInfo.attacking = true;
    }
    else {
      ownerInfo.attacking = false;
    }
  }

  if (gamesList[gameID].owner2 === socket.id){
    //Socket = owner 2
    ownerInfo.type = 2;
    if (gamesList[gameID].hex[data.moveUnitsToHex].owner === 1){
      ownerInfo.attacking = true;
    }
    else {
      ownerInfo.attacking = false;
    }
  }

  return ownerInfo;
}

sendSendInfoToOtherPlayer = function(socket, data, gameID){
  var otherPlayer = findOtherPlayer(socket, gameID);

  //console.log(data.moveUnitsToHex);
  //console.log(gamesList[gameID].hex[data.moveUnitsToHex]);
  //Send information to the other player

  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var unitsWaiting = data.unitsType + "Waiting";
      sendData = {
        currentHex:data.hex,
        targetHex:data.moveUnitsToHex,
        unitsType:data.unitsType,
        targetHexOwner:gamesList[gameID].hex[data.moveUnitsToHex].owner,
        unitsCurrentAmount:gamesList[gameID].hex[data.hex][data.unitsType],
        unitsTargetWaitingAmount:gamesList[gameID].hex[data.moveUnitsToHex][unitsWaiting]
      }
      sock.emit("enemySendUnits", sendData);
    }
  }
  
}

//Export
module.exports = onSendUnits;
