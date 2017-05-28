var onSpellCast = function(socket){
  socket.on("spellCast", function(data){
    //Data: {spell}
    checkForOwner = require("./checkForOwner");
    var gameID = socketList[socket.id].gameID;
    var owner = checkForOwner(socket, gameID);

    if (spellCastAnticheat(socket, owner, data, gameID)){
      spellEffect(owner, data, gameID);
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
    checkForAdditionalConditionsBasedOnSpell(data, gameID)
      ){
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

checkForAdditionalConditionsBasedOnSpell = function(data, gameID){
  switch(data.spell){
    case 0:
      return true;
      break;
  }
}

spellEffect = function(owner, data, gameID){
  gamesList[gameID].player[owner].mana -= getSpellCost(data.spell);
  switch(data.spell){
    case 0:
      happinessEffect(owner, gameID);
      break;
  }
}

happinessEffect = function(owner, gameID){
  gamesList[gameID].player[owner].happinessMultiplier = 1 + balance.happinessMultiplier;
}

//Export
module.exports = onSpellCast;
