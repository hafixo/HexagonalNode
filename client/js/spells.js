castSpell = function(){
  justTargetedSpell = false;   //Prevents the ability to select a hexagon just after targeting a spell

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
  justTargetedSpell = true;
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
    case 5:
      castArmageddon();
      break;
    case 6:
      castEnergyBoost();
      break;
    case 7:
      castMagicWind();
      break;
    case 8:
      castRecycling();
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

castArmageddon = function(){
  waitForConfirmation();
}

castPoisonousPlants = function(){
  //Označí všechny země
  possibleSpellTarget = [];
  for (var key in hex){
    possibleSpellTarget.push(key);
  }

  justStartedTargeting = true;
}

castEnergyBoost = function(){
  //Označí všechny přátelské země - vytvoří global array se všemi možnými cílenými zeměmi (array bude později smazána)
  possibleSpellTarget = [];
  for (var key in hex){
    if (hex[key].owner === player){
      possibleSpellTarget.push(key);
    }
  }

  justStartedTargeting = true;
}

castMagicWind = function(){
  //Označí všechny přátelské a nepřátelské země - vytvoří global array se všemi možnými cílenými zeměmi (array bude později smazána)
  possibleSpellTarget = [];
  for (var key in hex){
    if ((hex[key].owner === player) || (hex[key].owner !== player && hex[key].owner !== 0)){
      possibleSpellTarget.push(key);
    }
  }

  justStartedTargeting = true;
}

castRecycling = function(){
  //Označí všechny přátelské země s budovou - vytvoří global array se všemi možnými cílenými zeměmi (array bude později smazána)
  possibleSpellTarget = [];
  for (var key in hex){
    if (hex[key].owner === player && hex[key].building !== -1){
      possibleSpellTarget.push(key);
    }
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
      //sendSpellSocket(castingSpell);
      confirmedSpellEffect(castingSpell);
      manaAmount -= getSpellCost(castingSpell);
      showConfirmSpellUI = false;
    }
  }

  //Select target
  justSelectedFirstTarget = false;
  if (typeof possibleSpellTarget !== "undefined"){
    var targetSelected = false;
    for (var key in possibleSpellTarget){
      if (possibleSpellTarget[key] === mouseHexColliding){
        //1 target
        if (castingSpell !== 7){
          sendSpellSocket(castingSpell, mouseHexColliding);
          confirmedSpellEffect(castingSpell, mouseHexColliding);

          manaAmount -= getSpellCost(castingSpell);
          targetSelected = true;
          delete possibleSpellTarget;
          break;
        }
        //2 targets
        else {
          firstTarget = possibleSpellTarget[key];
          possibleSecondaryTarget = [];
          var adjacentHexagons = findAdjacentHexagons(possibleSpellTarget[key]);
          for (var key in adjacentHexagons){
            if (hex[adjacentHexagons[key]].owner === hex[firstTarget].owner){
              possibleSecondaryTarget.push(adjacentHexagons[key]);
            }
          }
          justSelectedFirstTarget = true;
          delete possibleSpellTarget;
          break;
        }
      }
    }
    //Unselect
    if (!targetSelected && !justStartedTargeting){
      delete possibleSpellTarget;
    }
  }

  justStartedTargeting = false;

  //Second target
  if (typeof possibleSecondaryTarget !== "undefined"){
    var targetSelected = false;
    for (var key in possibleSecondaryTarget){
      if (possibleSecondaryTarget[key] === mouseHexColliding){
        sendSpellSocket(castingSpell, firstTarget, mouseHexColliding);
        confirmedSpellEffect(castingSpell, firstTarget, mouseHexColliding);

        manaAmount -= getSpellCost(castingSpell);
        targetSelected = true;
        delete possibleSecondaryTarget;
        delete firstTarget;
        break;
      }
    }

    //Unselect
    if (!targetSelected && !justStartedTargeting && !justSelectedFirstTarget){
      delete possibleSecondaryTarget;
    }
  }
}

sendSpellSocket = function(castingSpell, target1, target2){
  var sendData = {
    spell:castingSpell,
    target1:target1,
    target2:target2
  }
  socket.emit("spellCast", sendData);
}

confirmedSpellEffect = function(castingSpell, firstTarget, secondTarget){
  switch(castingSpell){
    case 0:
      happinessEffect();
      break;
    //case 1 - no effect on the player who cast it
    case 2:
      efficiencyEffect();
      break;
    case 3:
      blackMagicEffect(firstTarget);
      break;
    case 4:
      poisonousPlantsEffect(firstTarget);
      break;
    case 5:
      armageddonEffect(firstTarget);
      break;
    case 6:
      energyBoostEffect(firstTarget);
      break;
    case 7:
      magicWindEffect(firstTarget, secondTarget);
      break;
    case 8:
      recyclingEffect(firstTarget);
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

armageddonEffect = function(){
  for (var key in hex){
    hex[key].workers = Math.floor(hex[key].workers - balance.armageddonKills * hex[key].workers);
    hex[key].workersWaiting = Math.floor(hex[key].workersWaiting - balance.armageddonKills * hex[key].workersWaiting);
    hex[key].soldiers = Math.floor(hex[key].soldiers - balance.armageddonKills * hex[key].soldiers);
    hex[key].soldiersWaiting = Math.floor(hex[key].soldiersWaiting - balance.armageddonKills * hex[key].soldiersWaiting);
    hex[key].mages = Math.floor(hex[key].mages - balance.armageddonKills * hex[key].mages);
    hex[key].magesWaiting = Math.floor(hex[key].magesWaiting - balance.armageddonKills * hex[key].magesWaiting);
  }
  changeIncome();
}

energyBoostEffect = function(key){
    convertWaitingToReady(key, "workers");
  convertWaitingToReady(key, "soldiers");
  convertWaitingToReady(key, "mages");
}

convertWaitingToReady = function(key, units){
  var unitWaitingName = units + "Waiting";
  hex[key][units] += hex[key][unitWaitingName];
  hex[key][unitWaitingName] = 0;
}

magicWindEffect = function(firstHex, secondHex){
  moveUnitsType(firstHex, secondHex, "workers");
  moveUnitsType(firstHex, secondHex, "soldiers");
  moveUnitsType(firstHex, secondHex, "mages");
}

moveUnitsType = function(firstHex, secondHex, units){
  var unitWaitingName = units + "Waiting";
  hex[secondHex][units] += hex[firstHex][units];
  hex[firstHex][units] = 0;
  hex[secondHex][unitWaitingName] += hex[firstHex][unitWaitingName];
  hex[firstHex][unitWaitingName] = 0;
}

recyclingEffect = function(key){
  goldAmount += getOriginalBuildingCost(hex[key].building);   //input
  hex[key].building = -1;
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

onArmageddonCast = function(socket){
  socket.on("armageddonCast", function(data){
    for (var key in hex){
      hex[key].workers = Math.floor(hex[key].workers - balance.armageddonKills * hex[key].workers);
      hex[key].workersWaiting = Math.floor(hex[key].workersWaiting - balance.armageddonKills * hex[key].workersWaiting);
      hex[key].soldiers = Math.floor(hex[key].soldiers - balance.armageddonKills * hex[key].soldiers);
      hex[key].soldiersWaiting = Math.floor(hex[key].soldiersWaiting - balance.armageddonKills * hex[key].soldiersWaiting);
      hex[key].mages = Math.floor(hex[key].mages - balance.armageddonKills * hex[key].mages);
      hex[key].magesWaiting = Math.floor(hex[key].magesWaiting - balance.armageddonKills * hex[key].magesWaiting);
    }
    changeIncome();
  });
}

onEnergyBoostCast = function(socket){
  socket.on("energyBoostCast", function(data){
    convertWaitingToReady(data.hex, "workers");
    convertWaitingToReady(data.hex, "soldiers");
    convertWaitingToReady(data.hex, "mages");
  });
}

onMagicWindCast = function(socket){
  socket.on("magicWindCast", function(data){
    moveUnitsType(data.firstHex, data.secondHex, "workers");
    moveUnitsType(data.firstHex, data.secondHex, "soldiers");
    moveUnitsType(data.firstHex, data.secondHex, "mages");
  });
}

onRecyclingCast = function(socket){
  socket.on("recyclingCast", function(data){
    hex[data.hex].building = -1;
  });
}
