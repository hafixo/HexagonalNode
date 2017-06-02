var onSpellCast = function(socket){
  socket.on("spellCast", function(data){
    //Data: {spell, target1, target2}
    checkForOwner = require("./checkForOwner");
    var gameID = socketList[socket.id].gameID;
    var owner = checkForOwner(socket, gameID);

    if (spellCastAnticheat(socket, owner, data, gameID)){
      spellEffect(socket, owner, data, gameID);
    }
    else {
      caughtCheating(socket);
    }
  });
}

spellCastAnticheat = function(socket, owner, data, gameID){
  if (socket.playing &&
    typeof data.spell === "number" &&                                          //jestli se jedná o číslo
    data.spell % 1 === 0 && data.spell >= 0 && data.spell <= 8 &&              //jestli se jedná o povolené číslo spellu
    checkIfEnoughMana(data, gamesList[gameID].player[owner].mana) &&
    checkForCrystal(owner, data, gameID) &&
    checkForAdditionalConditionsBasedOnSpell(owner, data, gameID)){
      return true;
  }
  else
    return false;
}

checkIfEnoughMana = function(data, manaAmount){
  var spellCost = getSpellCost(data.spell);
  if (manaAmount >= spellCost){
    return true;
  }
  else {
    return false;
  }
}

getSpellCost = function(spell){
  var cost;
  switch(spell){
    case 0:
      cost = balance.happinessCost;
      break;
    case 1:
      cost = balance.greedCost;
      break;
    case 2:
      cost = balance.efficiencyCost;
      break;
    case 3:
      cost = balance.blackMagicCost;
      break;
    case 4:
      cost = balance.poisonousPlantsCost;
      break;
    case 5:
      cost = balance.armageddonCost;
      break;
    case 6:
      cost = balance.energyBoostCost;
      break;
    case 7:
      cost = balance.magicWindCost;
      break;
    case 8:
      cost = balance.recyclingCost;
      break;
  }

  return cost;
}

checkForCrystal = function(owner, data, gameID){
  if (data.spell >= 0 && data.spell <= 2){
    crystalRequired = 6;
  }
  else if (data.spell >= 3 && data.spell <= 5){
    crystalRequired = 7;
  }
  else if (data.spell >= 6 && data.spell <= 8){
    crystalRequired = 8;
  }

  var crystalExists = false;
  for (var key in gamesList[gameID].hex){
    if (gamesList[gameID].hex[key].owner === owner && gamesList[gameID].hex[key].building === crystalRequired){
      crystalExists = true;
    }
  }

  return crystalExists;
}

checkForAdditionalConditionsBasedOnSpell = function(owner, data, gameID){
  switch(data.spell){
    case 0:
      return true;
      break;
    case 1:
      return true;
      break;
    case 2:
      return true;
      break;
    case 3:
      if (gamesList[gameID].hex[data.target1] !== undefined &&
        gamesList[gameID].hex[data.target1].owner !== 0 &&
        gamesList[gameID].hex[data.target1].owner !== owner){
          return true;
      }
      else {
        return false
      }
      break;
    case 4:
      if (gamesList[gameID].hex[data.target1] !== undefined){
        return true;
      }
      else {
        return false;
      }
      break;
    case 5:
      return true;
      break;
    case 6:
      if (gamesList[gameID].hex[data.target1] !== undefined &&
      gamesList[gameID].hex[data.target1].owner === owner){
        return true;
      }
      else {
        return false
      }
      break;
    case 7:
      if (gamesList[gameID].hex[data.target1] !== undefined &&
        gamesList[gameID].hex[data.target2] !== undefined &&
        (gamesList[gameID].hex[data.target2].owner === owner || gamesList[gameID].hex[data.target2].owner !== owner && gamesList[gameID].hex[data.target2].owner !== 0)){
        return true;
      }
      else {
        return false;
      }
      break;
    case 8:
      if (gamesList[gameID].hex[data.target1] !== undefined){
        return true;
      }
      else {
        return false;
      }
      break;
  }
}

spellEffect = function(socket, owner, data, gameID){
  gamesList[gameID].player[owner].mana -= getSpellCost(data.spell);
  switch(data.spell){
    case 0:
      happinessEffect(owner, gameID);
      break;
    case 1:
      greedEffect(socket, owner, gameID);
      break;
    case 2:
      efficiencyEffect(owner, gameID);
      break;
    case 3:
      blackMagicEffect(socket, data, gameID);
      break;
    case 4:
      poisonousPlantsEffect(socket, data, gameID);
      break;
    case 5:
      armageddonEffect(socket, gameID);
      break;
    case 6:
      energyBoostEffect(socket, data, gameID);
      break;
    case 7:
      magicWindEffect(socket, data, gameID);
      break;
    case 8:
      recyclingEffect(socket, owner, data, gameID);
      break;
  }
}

happinessEffect = function(owner, gameID){
  gamesList[gameID].player[owner].happinessMultiplier = 1 + balance.happinessMultiplier;
}

greedEffect = function(socket, owner, gameID){
  for (var i = 1; i <= 2; i++){
    if (i !== owner){
      gamesList[gameID].player[i].greedMultiplier = balance.greedMultiplier;

      //Send info to the other player
      var otherPlayer = findOtherPlayer(socket, gameID);
      for(var j in socketList){
        if (parseFloat(j) === otherPlayer){
          var sock = socketList[j];
          sock.emit("greedCast");
        }
      }
    }
  }
}

efficiencyEffect = function(owner, gameID){
  gamesList[gameID].player[owner].buildingSale *= balance.efficiencySale;
}

blackMagicEffect = function(socket, data, gameID){
  gamesList[gameID].hex[data.target1].mages = Math.floor(gamesList[gameID].hex[data.target1].mages - balance.blackMagicKills * gamesList[gameID].hex[data.target1].mages);

  //Send info to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var sendData = {
        hex:data.target1
      }
      sock.emit("blackMagicCast", sendData);
    }
  }
}

poisonousPlantsEffect = function(socket, data, gameID){
  //Main hexagon
  gamesList[gameID].hex[data.target1].workers = Math.floor(gamesList[gameID].hex[data.target1].workers - balance.poisonousPlantsKillsMain * gamesList[gameID].hex[data.target1].workers);
  gamesList[gameID].hex[data.target1].workersWaiting = Math.floor(gamesList[gameID].hex[data.target1].workersWaiting - balance.poisonousPlantsKillsMain * gamesList[gameID].hex[data.target1].workersWaiting);

  //Adjacent hexagons
  var adjacentHexagons = findAdjacentHexagons(data.target1, gameID);
  for (var i in adjacentHexagons){
    gamesList[gameID].hex[adjacentHexagons[i]].workers = Math.floor(gamesList[gameID].hex[adjacentHexagons[i]].workers - balance.poisonousPlantsKillsAdjacent * gamesList[gameID].hex[adjacentHexagons[i]].workers);
    gamesList[gameID].hex[adjacentHexagons[i]].workersWaiting = Math.floor(gamesList[gameID].hex[adjacentHexagons[i]].workersWaiting - balance.poisonousPlantsKillsAdjacent * gamesList[gameID].hex[adjacentHexagons[i]].workersWaiting);
  }

  //Send info to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var sendData = {
        hex:data.target1
      }
      sock.emit("poisonousPlantsCast", sendData);
    }
  }
}

findAdjacentHexagons = function(key, gameID){
	var adjacentHexagons = []; 	//sem budu zapisovat id hexagonů, které s daným hexagonem sousedí

  var hex = gamesList[gameID].hex;
	for(var id in hex){
		//Přiřadí hexagony z vedlejších sloupců
		if (Math.abs(hex[key].column - hex[id].column) === 1)
			if (Math.abs(hex[key].line - hex[id].line) === 0.5)
				adjacentHexagons.push(id);

		//Přiřadí hexagony ze stejného sloupce
		if (hex[key].column === hex[id].column)
			if (Math.abs(hex[key].line - hex[id].line) === 1)
				adjacentHexagons.push(id);
	}
	return adjacentHexagons;
}

armageddonEffect = function(socket, gameID){
  var hex = gamesList[gameID].hex;
  for (var key in hex){
    hex[key].workers = Math.floor(hex[key].workers - balance.armageddonKills * hex[key].workers);
    hex[key].workersWaiting = Math.floor(hex[key].workersWaiting - balance.armageddonKills * hex[key].workersWaiting);
    hex[key].soldiers = Math.floor(hex[key].soldiers - balance.armageddonKills * hex[key].soldiers);
    hex[key].soldiersWaiting = Math.floor(hex[key].soldiersWaiting - balance.armageddonKills * hex[key].soldiersWaiting);
    hex[key].mages = Math.floor(hex[key].mages - balance.armageddonKills * hex[key].mages);
    hex[key].magesWaiting = Math.floor(hex[key].magesWaiting - balance.armageddonKills * hex[key].magesWaiting);
  }

  //Send info to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      sock.emit("armageddonCast");
    }
  }
}

energyBoostEffect = function(socket, data, gameID){
  function convertWaitingToReady(key, units, gameID){
    var unitWaitingName = units + "Waiting";
    gamesList[gameID].hex[key][units] += gamesList[gameID].hex[key][unitWaitingName];
    gamesList[gameID].hex[key][unitWaitingName] = 0;
  }
  convertWaitingToReady(data.target1, "workers", gameID);
  convertWaitingToReady(data.target1, "soldiers", gameID);
  convertWaitingToReady(data.target1, "mages", gameID);

  //Send info to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var sendData = {
        hex:data.target1
      }
      sock.emit("energyBoostCast", sendData);
    }
  }
}

magicWindEffect = function(socket, data, gameID){
  function moveUnitsType(firstHex, secondHex, units, gameID){
    var unitWaitingName = units + "Waiting";
    gamesList[gameID].hex[secondHex][units] += gamesList[gameID].hex[firstHex][units];
    gamesList[gameID].hex[firstHex][units] = 0;
    gamesList[gameID].hex[secondHex][unitWaitingName] += gamesList[gameID].hex[firstHex][unitWaitingName];
    gamesList[gameID].hex[firstHex][unitWaitingName] = 0;
  }

  moveUnitsType(data.target1, data.target2, "workers", gameID);
  moveUnitsType(data.target1, data.target2, "soldiers", gameID);
  moveUnitsType(data.target1, data.target2, "mages", gameID);

  //Send info to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var sendData = {
        firstHex:data.target1,
        secondHex:data.target2
      }
      sock.emit("magicWindCast", sendData);
    }
  }
}

recyclingEffect = function(socket, owner, data, gameID){
  gamesList[gameID].player[owner].gold += getOriginalBuildingCost(gamesList[gameID].hex[data.target1].building);
  gamesList[gameID].hex[data.target1].building = -1;

  //Send info to the other player
  var otherPlayer = findOtherPlayer(socket, gameID);
  for(var i in socketList){
    if (parseFloat(i) === otherPlayer){
      var sock = socketList[i];
      var sendData = {
        hex:data.target1
      }
      sock.emit("recyclingCast", sendData);
    }
  }
}

getOriginalBuildingCost = function(building){
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
module.exports = onSpellCast;
