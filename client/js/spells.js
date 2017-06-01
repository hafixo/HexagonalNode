castSpell = function(){
  var proceed = selectSpell();    //changes global variable castingSpell
  if (proceed){
    selectTargetOrConfirm();
  }
  performSpell();
}

selectSpell = function(){
  var proceed = false;
  if (playing && !showSendUnitUI){
    //Pokud klikne na spell v UI, spell tím vybere.
    if (mouseUIcolliding.main !== -1){
      if (ui["main"][mouseUIcolliding.main].name === "building" && buildingOrSpell === "spell" && checkForCrystal() && manaAmount >= getSpellCost(ui["main"][mouseUIcolliding.main].id)){
        castingSpell = ui["main"][mouseUIcolliding.main].id;    //castingSpell - interval mezi 0 a 8
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
    case 1:
      castGreed();
      break;
    case 2:
      castEfficiency();
      break;
    case 3:
      castBlackMagic();
      break;
    case 4:
      castPoisonousPlants();
      break;
  }
}

castHappiness = function(){
  waitForConfirmation();
}

castGreed = function(){
  waitForConfirmation();
}

castEfficiency = function(){
  waitForConfirmation();
}

castBlackMagic = function(){
  //Označí všechny nepřátelské země - vytvoří global array se všemi možnými cílenými zeměmi (array bude později smazána)
  possibleSpellTarget = [];
  for (var key in hex){
    if (hex[key].owner !== player && hex[key].owner !== 0){
      possibleSpellTarget.push(key);
    }
  }

  justStartedTargeting = true;
}

castPoisonousPlants = function(){
  //Označí všechny země
  possibleSpellTarget = [];
  for (var key in hex){
    possibleSpellTarget.push(key);
  }

  justStartedTargeting = true;
}

waitForConfirmation = function(){
  showConfirmSpellUI = true;
  justOpenedConfirmSpellUI = true;
  //Wait for confirmation (input.js)
}

performSpell = function(){
  //Confirm
  if (mouseUIcolliding.confirmSpell !== -1 && showConfirmSpellUI){
    if (ui["confirmSpell"][mouseUIcolliding.confirmSpell].name === "yesButton"){
      sendSpellSocket(castingSpell);
      confirmedSpellEffect(castingSpell);
      manaAmount -= getSpellCost(castingSpell);
      showConfirmSpellUI = false;
    }
  }

  //Select target
  if (typeof possibleSpellTarget !== "undefined"){
    var targetSelected = false;
    for (var key in possibleSpellTarget){
      if (possibleSpellTarget[key] === mouseHexColliding){
        //1 target
        sendSpellSocket(castingSpell, mouseHexColliding);
        confirmedSpellEffect(castingSpell, mouseHexColliding);
        manaAmount -= getSpellCost(castingSpell);

        targetSelected = true;
        delete possibleSpellTarget;
        break;
      }
    }
    //Unselect
    if (!targetSelected && !justStartedTargeting){
      delete possibleSpellTarget;
    }
  }
  justStartedTargeting = false;
}

sendSpellSocket = function(castingSpell, target1){
  var sendData = {
    spell:castingSpell,
    target1:target1
  }
  socket.emit("spellCast", sendData);
}

confirmedSpellEffect = function(castingSpell, targetHex){
  switch(castingSpell){
    case 0:
      happinessEffect();
      break;
    //case 1 - no effect on the player who cast it
    case 2:
      efficiencyEffect();
      break;
    case 3:
      blackMagicEffect(targetHex);
      break;
    case 4:
      poisonousPlantsEffect(targetHex);
      break;
  }
}

happinessEffect = function(){
  happinessMultiplier = 1 + balance.happinessMultiplier;
  changeIncome();
}

efficiencyEffect = function(){
  buildingSale *= balance.efficiencySale;
}

blackMagicEffect = function(key){
  hex[key].mages = Math.floor(hex[key].mages - balance.blackMagicKills * hex[key].mages);
}

poisonousPlantsEffect = function(key){
  //Main hexagon
  hex[key].workers = Math.floor(hex[key].workers - balance.poisonousPlantsKillsMain * hex[key].workers);
  hex[key].workersWaiting = Math.floor(hex[key].workersWaiting - balance.poisonousPlantsKillsMain * hex[key].workersWaiting);

  //Adjacent hexagons
  var adjacentHexagons = findAdjacentHexagons(key);
  for (var i in adjacentHexagons){
    hex[adjacentHexagons[i]].workers = Math.floor(hex[adjacentHexagons[i]].workers - balance.poisonousPlantsKillsAdjacent * hex[adjacentHexagons[i]].workers);
    hex[adjacentHexagons[i]].workersWaiting = Math.floor(hex[adjacentHexagons[i]].workersWaiting - balance.poisonousPlantsKillsAdjacent * hex[adjacentHexagons[i]].workersWaiting);
  }

  changeIncome();
}

//Recieve sockets
onGreedCast = function(socket){
  socket.on("greedCast", function(data){
    greedMultiplier = balance.greedMultiplier;
    changeIncome();
  });
}

onBlackMagicCast = function(socket){
  socket.on("blackMagicCast", function(data){
    hex[data.hex].mages = Math.floor(hex[data.hex].mages - balance.blackMagicKills * hex[data.hex].mages);
    changeIncome();
  });
}

onPoisonousPlantsCast = function(socket){
  socket.on("poisonousPlantsCast", function(data){
    //Main hexagon
    hex[data.hex].workers = Math.floor(hex[data.hex].workers - balance.poisonousPlantsKillsMain * hex[data.hex].workers);
    hex[data.hex].workersWaiting = Math.floor(hex[data.hex].workersWaiting - balance.poisonousPlantsKillsMain * hex[data.hex].workersWaiting);

    //Adjacent hexagons
    var adjacentHexagons = findAdjacentHexagons(data.hex);
    for (var i in adjacentHexagons){
      hex[adjacentHexagons[i]].workers = Math.floor(hex[adjacentHexagons[i]].workers - balance.poisonousPlantsKillsAdjacent * hex[adjacentHexagons[i]].workers);
      hex[adjacentHexagons[i]].workersWaiting = Math.floor(hex[adjacentHexagons[i]].workersWaiting - balance.poisonousPlantsKillsAdjacent * hex[adjacentHexagons[i]].workersWaiting);
    }

    changeIncome();
  });
}
