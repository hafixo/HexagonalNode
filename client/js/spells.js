castSpell = function(){
  var proceed = selectSpell();    //changes global variable castingSpell
  if (proceed){
    selectTargetOrConfirm();
  }
  confirmSpell();
}

selectSpell = function(){
  var proceed = false;
  if (playing && !showSendUnitUI){
    //Pokud klikne na spell v UI, spell tím vybere.
    if (mouseUIcolliding.main !== -1){
      if (ui["main"][mouseUIcolliding.main].name === "building" && buildingOrSpell === "spell" && checkForCrystal() && manaAmount >= getSpellCost(ui["main"][mouseUIcolliding.main].id)){
        castingSpell = ui["main"][mouseUIcolliding.main].id;    //castingSpell - interval mezi 0 a 8
        console.log("Casting spell " + castingSpell);
        proceed = true;
      }
      else {
        castingSpell = -1;     //Označení se zruší, pokud klikne jinam do UI.
      }
    }
  }

  return proceed;
}

checkForCrystal = function(){
  var spellType = ui["main"][mouseUIcolliding.main].id;
  if (spellType >= 0 && spellType <= 2){
    crystalRequired = 6;
  }
  else if (spellType >= 3 && spellType <= 5){
    crystalRequired = 7;
  }
  else if (spellType >= 6 && spellType <= 8){
    crystalRequired = 8;
  }

  crystalExists = false;
  for (var key in hex){
    if (hex[key].owner === player && hex[key].building === crystalRequired){
      crystalExists = true;
    }
  }

  return crystalExists;
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

selectTargetOrConfirm = function(){
  switch(castingSpell){
    case 0:
      castHappiness();
      break;
  }
}

castHappiness = function(){
  showConfirmSpellUI = true;
  justOpenedConfirmSpellUI = true;
  //Wait for confirmation
}

confirmSpell = function(){
  if (mouseUIcolliding.confirmSpell !== -1 && showConfirmSpellUI){
    if (ui["confirmSpell"][mouseUIcolliding.confirmSpell].name === "yesButton"){
      confirmedSpellEffect(castingSpell);
      manaAmount -= getSpellCost(castingSpell);
      showConfirmSpellUI = false;
    }
  }
}

confirmedSpellEffect = function(castingSpell){
  switch(castingSpell){
    case 0:
      happinessMultiplier = 1 + balance.happinessMultiplier;
      changeIncome();
      break;
  }
}
