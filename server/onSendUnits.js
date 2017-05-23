var onSendUnits = function(socket){
  socket.on("sendUnits", function(data){
    //Data: {hex, moveUnitsToHex, unitsType, amount, workersKilled, magesKilled}
    //console.log(data);
    var gameID = socketList[socket.id].gameID;
    if (sendUnitsAnticheat(socket, data, gameID)){
      sendUnitsFunction(socket, data, gameID);
      sendSendInfoToOtherPlayer(socket, data, gameID);
    }
    else {
      caughtCheating(socket);
    }
  });
}

sendUnitsAnticheat = function(socket, data, gameID){
  checkForOwner = require("./checkForOwner");
  var owner = checkForOwner(socket, gameID);

  if (socket.playing &&
    gamesList[gameID].hex[data.hex] !== undefined &&
    gamesList[gameID].hex[data.moveUnitsToHex] !== undefined &&
    typeof data.amount === "number" &&
    checkIfNumberIsNatural(data.amount) && 
    data.amount <= gamesList[gameID].hex[data.hex][data.unitsType] &&
    gamesList[gameID].hex[data.hex].owner === owner &&
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
    //Anticheat
    additionalAnticheat(socket, data, gameID);

    var soldiersLost = 0;
    //Fight with enemy soldiers
    if (gamesList[gameID].hex[data.moveUnitsToHex].soldiers !== 0){
      //Enemy has more soldiers
      if (gamesList[gameID].hex[data.moveUnitsToHex].soldiers >= data.amount){
        //Kill enemy soldiers
        gamesList[gameID].hex[data.moveUnitsToHex].soldiers -= data.amount;
                                                            //Must be in this order (kill -> lose)
         //Lose own soldiers
        soldiersLost = data.amount;
        data.amount = 0;
      }

      //Enemy has less soldiers
      if (gamesList[gameID].hex[data.moveUnitsToHex].soldiers < data.amount){
        //Lose own soldiers
        soldiersLost = gamesList[gameID].hex[data.moveUnitsToHex].soldiers;
        data.amount -= gamesList[gameID].hex[data.moveUnitsToHex].soldiers;
                                                            //Must be in this order (lose -> kill)
        //Kill enemy soldiers
        gamesList[gameID].hex[data.moveUnitsToHex].soldiers = 0;
      }
    }

    //Remove lost soldiers from the selected hexagon
    gamesList[gameID].hex[data.hex].soldiers -= soldiersLost;

    //Kill non-soldiers units
    gamesList[gameID].hex[data.moveUnitsToHex].workers -= data.workersKilled;
    gamesList[gameID].hex[data.moveUnitsToHex].mages -= data.magesKilled;

    //Soldiers that killed a unit are exhausted and need to rest.
    var enemiesKilled = data.workersKilled + data.magesKilled;
    gamesList[gameID].hex[data.hex].soldiersWaiting += enemiesKilled;
    gamesList[gameID].hex[data.hex].soldiers -= enemiesKilled;
    data.amount -= enemiesKilled;

    //All enemy units are eliminated -> move remaining, not exhausted soldiers to the new hexagon
    var enemyHex = gamesList[gameID].hex[data.moveUnitsToHex];
    var enemyUnitsCount = enemyHex.workers + enemyHex.soldiers + enemyHex.mages;
    if (enemyUnitsCount === 0 && data.amount !== 0){
      //Capture the hexagon
      gamesList[gameID].hex[data.moveUnitsToHex].owner = ownerInfo.type;

      //Move the remaining soldiers
      gamesList[gameID].hex[data.moveUnitsToHex].soldiersWaiting += data.amount;

      //Subtract the units from the selected hexagon
      gamesList[gameID].hex[data.hex].soldiers -= data.amount;
    }

    console.log("This hexagon: soldiers = " + gamesList[gameID].hex[data.hex].soldiers + "; soldiersWaiting = " + gamesList[gameID].hex[data.hex].soldiersWaiting);
    console.log("Enemy hexagon: soldiers = " + gamesList[gameID].hex[data.moveUnitsToHex].soldiers + "; soldiersWaiting = " + gamesList[gameID].hex[data.moveUnitsToHex].soldiersWaiting);
    console.log("Enemy hexagon: workers = " + gamesList[gameID].hex[data.moveUnitsToHex].workers + "; mages = " + gamesList[gameID].hex[data.moveUnitsToHex].mages);
    console.log("Was the attack successful? 1 = yes, 2 = no. " + gamesList[gameID].hex[data.moveUnitsToHex].owner);
  }
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

additionalAnticheat = function(socket, data, gameID){
  //Check if the amount of soldiers who will kill a non-soldier unit corresponds with the sum of workersKilled and magesKilled
  var soldiersWillKillAmount = data.amount - gamesList[gameID].hex[data.moveUnitsToHex][data.unitsType];
  var soldiersCanKillUpTo = gamesList[gameID].hex[data.moveUnitsToHex].workers + gamesList[gameID].hex[data.moveUnitsToHex].mages;
  var shouldKill = data.workersKilled + data.magesKilled;

  if (!checkIfNumberIsNatural(data.workersKilled) || !checkIfNumberIsNatural(data.magesKilled)){
    caughtCheating(socket);
  }

  if (soldiersWillKillAmount <= soldiersCanKillUpTo){
    if (shouldKill !== soldiersWillKillAmount){
      caughtCheating(socket);
    }
  }
  else {
    if (shouldKill !== soldiersCanKillUpTo){
      caughtCheating(socket);
    }
  }
}

checkIfNumberIsNatural = function(number){
  if (number >= 0 && number % 1 === 0){
    return true;
  }
  else {
    return false;
  }
}

sendSendInfoToOtherPlayer = function(socket, data, gameID){
  //Send information to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var unitsWaiting = data.unitsType + "Waiting";
      sendData = {
        currentHex:data.hex,
        targetHex:data.moveUnitsToHex,
        unitsType:data.unitsType,
        unitsCurrentAmount:gamesList[gameID].hex[data.hex][data.unitsType],
        unitsTargetWaitingAmount:gamesList[gameID].hex[data.moveUnitsToHex][unitsWaiting],

        //Variables connected with attacking
        targetHexOwner:gamesList[gameID].hex[data.moveUnitsToHex].owner,
        unitsCurrentWaitingAmount:gamesList[gameID].hex[data.hex][unitsWaiting],
        unitsTargetWorkers:gamesList[gameID].hex[data.moveUnitsToHex].workers,
        unitsTargetSoldiers:gamesList[gameID].hex[data.moveUnitsToHex].soldiers,
        unitsTargetMages:gamesList[gameID].hex[data.moveUnitsToHex].mages,
      }
      sock.emit("enemySendUnits", sendData);
    }
  }

}

//Export
module.exports = onSendUnits;
