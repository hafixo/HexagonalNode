var onSendUnits = function(socket){
  socket.on("sendUnits", function(data){
    //Data: {hex, moveUnitsToHex, unitType, amount, workersKilled, magesKilled}
    console.log(data);
    var gameID = socketList[socket.id].gameID;
    if (sendUnitsAnticheat(socket, data, gameID)){

    }
    else {
      //caughtCheating(socket);
    }
  });
}

sendUnitsAnticheat = function(socket, data, gameID){
  if (socket.playing &&
    gamesList[gameID].hex[data.hex] !== undefined &&
    data.amount <= gamesList[gameID].hex[data.hex][data.unitType] &&
    checkIfTargetHexIsAdjacent(data.hex, data.moveUnitsToHex, gameID)){

  }
  else
    return false;
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

//Export
module.exports = onSendUnits;
