var createBalanceVariables = function(){
  var balance = {
    //Units
    workerCost:50,
    workerIncome:10,
    soldierCost:75,
    soldierFee:15,
    mageCost:100,
    mageIncome:1,
    mageFee:5,

    //Buildings
    farmCost:500,
    barracksCost:500,
    schoolOfMagicCost:500,
    millCost:1500,
    millIncome:500,
    wellCost:1000,
    wellIncome:15,
    templeCost:1000,
    templeMultiplier:2,
    yellowCrystalCost:400,
    redCrystalCost:400,
    blueCrystalCost:400,

    //Spells
    happinessCost:30,
    happinessMultiplier:0.5,
    greedCost:20,
    greedMultiplier:2,
    efficiencyCost:20,
    efficiencySale:0.5,
    blackMagicCost:40,
    blackMagicKills:0.5,
    poisonousPlantsCost:75,
    poisonousPlantsKillsMain:1,
    poisonousPlantsKillsAdjacent:0.5,
    armageddonCost:50,
    armageddonKills:0.5,
    energyBoostCost:30,
    magicWindCost:20,
    recyclingCost:5
  };

  return balance;
}

//Export
module.exports = createBalanceVariables;
