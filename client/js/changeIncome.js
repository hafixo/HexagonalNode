changeIncome = function(){
  var newGoldIncome = 0;
  var newManaIncome = 0;
  for (var key in hex){
    if (hex[key].owner === player){
      newGoldIncome += calculateGoldIncome(key);
      newManaIncome += calculateManaIncome(key);
    }
  }
  goldIncome = newGoldIncome;
  manaIncome = newManaIncome;
}

calculateGoldIncome = function(key){
  var thisHexGoldIncome = 0;
  //Workers
  var allWorkers = hex[key].workers + hex[key].workersWaiting;
  thisHexGoldIncome += allWorkers * balance.workerIncome;

  //Building
  if (hex[key].building === 3){
    thisHexGoldIncome += balance.millIncome;
  }

  //Soldiers fee, mages fee
  var allSoldiers = hex[key].soldiers + hex[key].soldiersWaiting;
  thisHexGoldIncome -= allSoldiers * balance.soldierFee;
  var allMages = hex[key].mages + hex[key].magesWaiting;
  thisHexGoldIncome -= allMages * balance.mageFee;

  //Return
  return thisHexGoldIncome;
}

calculateManaIncome = function(key){
  var thisHexManaIncome = 0;
  switch(hex[key].building){
    //Well
    case 4:
      thisHexManaIncome += balance.wellIncome;
      break;

    //Mages with temple
    case 5:
      var allMages = hex[key].mages + hex[key].magesWaiting;
      thisHexManaIncome += allMages * balance.mageIncome * balance.templeMultiplier;
      break;

    //Mages without temple
    default:
      var allMages = hex[key].mages + hex[key].magesWaiting;
      thisHexManaIncome += allMages * balance.mageIncome;
      break;
  }

  //Return
  return thisHexManaIncome;
}
