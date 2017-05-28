var refreshGoldAndMana = function(gameID, owner){
  var goldIncome = 0;
  var manaIncome = 0;
  var hex = gamesList[gameID].hex;

  for (var key in hex){
    if (hex[key].owner === owner){
      goldIncome += calculateGoldIncome(key, gameID, owner);
      manaIncome += calculateManaIncome(key, gameID, owner);
    }
  }

  gamesList[gameID].player[owner].gold += goldIncome;
  gamesList[gameID].player[owner].mana += manaIncome;
  console.log("Player " + owner + " has " + gamesList[gameID].player[owner].gold + " gold and " + gamesList[gameID].player[owner].mana + " mana.");
}

calculateGoldIncome = function(key, gameID, owner){
  var thisHexGoldIncome = 0;
  //Workers
  var allWorkers = gamesList[gameID].hex[key].workers + gamesList[gameID].hex[key].workersWaiting;
  thisHexGoldIncome += allWorkers * balance.workerIncome * gamesList[gameID].player[owner].happinessMultiplier;

  //Building
  if (gamesList[gameID].hex[key].building === 3){
    thisHexGoldIncome += balance.millIncome * gamesList[gameID].player[owner].happinessMultiplier;
  }

  //Soldiers fee, mages fee
  var allSoldiers = gamesList[gameID].hex[key].soldiers + gamesList[gameID].hex[key].soldiersWaiting;
  thisHexGoldIncome -= allSoldiers * balance.soldierFee * gamesList[gameID].player[owner].greedMultiplier;
  var allMages = gamesList[gameID].hex[key].mages + gamesList[gameID].hex[key].magesWaiting;
  thisHexGoldIncome -= allMages * balance.mageFee * gamesList[gameID].player[owner].greedMultiplier;

  //Return
  return thisHexGoldIncome;
}

calculateManaIncome = function(key, gameID){
  var thisHexManaIncome = 0;
  switch(gamesList[gameID].hex[key].building){
    //Well
    case 4:
      thisHexManaIncome += balance.wellIncome;
      break;

    //Mages with temple
    case 5:
      var allMages = gamesList[gameID].hex[key].mages + gamesList[gameID].hex[key].magesWaiting;
      thisHexManaIncome += allMages * balance.mageIncome * balance.templeMultiplier;
      break;

    //Mages without temple
    default:
      var allMages = gamesList[gameID].hex[key].mages + gamesList[gameID].hex[key].magesWaiting;
      thisHexManaIncome += allMages * balance.mageIncome;
      break;
  }

  //Return
  return thisHexManaIncome;
}

//Export
module.exports = refreshGoldAndMana;
