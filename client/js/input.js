//Input functions
input = function(){
  //Input functions
  document.onmousemove = function(mouse){
    mouseX = mouse.clientX - document.getElementById('ctx').getBoundingClientRect().left;
    mouseY = mouse.clientY - document.getElementById('ctx').getBoundingClientRect().top;
  }

  document.onclick = function(mouse){
    if (mouseX >= 0 && mouseX <= WIDTH && mouseY >= 0 && mouseY <= HEIGHT){
      selectHexagon();
    	placeBuilding();		//Kvůli proměnné placingBuilding musí být až po selectHexagon
      castSpell();        //Samostatný soubor - spells.js
      buildingSpellSwitchFunction();
      selectTrainButton();
      selectSendButton();
      trainUnitsButton();
      showSendUnitsUI();
      sendUnits();
      endTurn(socket);
      dontShowSendUnitsUI();    //Musí být na konci
      dontShowConfirmSpellUI();
    }
  }

  document.oncontextmenu = function(mouse){		//oncontextmenu = right click
    if (!showSendUnitUI){
      placingBuilding = -1;
    	hexSelected = -1;
      canMoveUnits = false;
    }
    if (typeof possibleSpellTarget !== "undefined"){
      delete possibleSpellTarget;
    }

    dontShowSendUnitsUI();

  	return false;		//Musí být, aby se neukázalo otravné HTML okno
  }

  document.onkeydown = function(event){
    //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    for(var i = 0; i <= 9; i++){
      if(event.keyCode === 48 + i || event.keyCode === 96 + i){    //48 = 0; 57 = 9;   NUM: 96 = 0; 105 = 9;
        var numberPressed = i;

        //Training / dismissing units
        if (trainButtonSelected !== -1){
          if (trainDigits[trainButtonSelected].length < 4 && (!(trainDigits[trainButtonSelected].length === 0 && numberPressed === 0))){    //Číslo se nepřidá, pokud a) je délka 4; b) je délka 0 a zmáčknutá klávesa je 0
            trainDigits[trainButtonSelected].push(numberPressed);
            trainValue[trainButtonSelected] = calculateTrainValue(trainDigits, trainButtonSelected);
          }
        }

        //Sending units
        if (sendButtonSelected !== -1){
          if (sendDigits[sendButtonSelected].length < 4 && (!(sendDigits[sendButtonSelected].length === 0 && numberPressed === 0))){    //Číslo se nepřidá, pokud a) je délka 4; b) je délka 0 a zmáčknutá klávesa je 0
            sendDigits[sendButtonSelected].push(numberPressed);
            sendValue[sendButtonSelected] = calculateSendValue(sendDigits, sendButtonSelected);
          }
        }
      }
    }

    //test
    if(event.keyCode === 8){
      //Reset training values
      if (trainButtonSelected !== -1){
        trainDigits[trainButtonSelected] = [];
        trainValue[trainButtonSelected] = 0;
      }

      //Reset sending values
      if (sendButtonSelected !== -1){
        sendDigits[sendButtonSelected] = [];
        sendValue[sendButtonSelected] = 0;
      }
    }
  }

}

selectHexagon = function(){
  if (playing && !showSendUnitUI && !showConfirmSpellUI){
  	var notUnselect = false;		//Zajistí, aby se země neodznačila hned po to, co je označena.
  	//Klikne na zemi, nestaví budovu a zrovna neseslal kouzlo
  	if (mouseHexColliding !== -1 && placingBuilding === -1 && !justTargetedSpell && !justSelectedFirstTarget){
  		//Pokud klikne na svou zemi, tak danou zemi označí.
  		if (hexSelected === -1 && hex[mouseHexColliding].owner === player){
  			hexSelected = mouseHexColliding;
  			notUnselect = true;
        hexMoveAvailable = findAdjacentHexagons(hexSelected);
  		}
  	}
  	//Pokud má označenou zemi a klikne, tak se označení zruší. Jsou zde 2 výjimky.
  	if ((hexSelected !== -1) && (notUnselect === false)) {
  		var unselect = true;
  		for (var i in hexMoveAvailable){
  			if (canMoveUnits && hexMoveAvailable[i] === mouseHexColliding){		//Označení se nezruší, pokud má v zemi vojáky, kteří se mohou pohnout, a klikne na sousední zemi
  				unselect = false;
  			}
  		}

  		if (mouseUIcolliding.main !== -1){
  			if (ui["main"][mouseUIcolliding.main].name === "trainBar"){			//Označení se nezruší, pokud klikne na train bar (pokud chce trénovat nebo propustit jednotky)
  				unselect = false;
  			}
  		}

  		if (unselect === true){
  			hexSelected = -1;
        canMoveUnits = false;
  		}
  	}
  }
}

findAdjacentHexagons = function(currentHex){
	var adjacentHexagons = []; 	//sem budu zapisovat id hexagonů, které s daným hexagonem sousedí

	for(var id in hex){
		//Přiřadí hexagony z vedlejších sloupců
		if (Math.abs(hex[currentHex].column - hex[id].column) === 1)
			if (Math.abs(hex[currentHex].line - hex[id].line) === 0.5)
				adjacentHexagons.push(id);

		//Přiřadí hexagony ze stejného sloupce
		if (hex[currentHex].column === hex[id].column)
			if (Math.abs(hex[currentHex].line - hex[id].line) === 1)
				adjacentHexagons.push(id);
	}
	//console.log(adjacentHexagons.join(" "));
	return adjacentHexagons;
}

placeBuilding = function(){
  if (playing && !showSendUnitUI && !showConfirmSpellUI){
  	//Pokud klikne na budovu v UI, budovu tím vybere.
  	if (mouseUIcolliding.main !== -1){
  		if (ui["main"][mouseUIcolliding.main].name === "building" && buildingOrSpell === "building" && goldAmount >= getBuildingCost(ui["main"][mouseUIcolliding.main].id)){
  			placingBuilding = ui["main"][mouseUIcolliding.main].id;    //placingBuilding - interval mezi 0 a 8
  		}
      else {
        placingBuilding = -1;     //Označení se zruší, pokud klikne jinam do UI.
      }
  	}
  	else {
  		//Kliknutí na zemi
  		if (mouseHexColliding !== -1){
  			//Pokud klikne na možnou zemi a má dostatek peněz, postaví tam budovu
  			if (placingBuilding !== -1 && hex[mouseHexColliding].owner === player && hex[mouseHexColliding].building === -1){
          var cost = getBuildingCost(placingBuilding);
          if (goldAmount >= cost){
            //Client
    				hex[mouseHexColliding].building = placingBuilding;
            goldAmount -= cost;
            buildingSale = 1;   //Reset sale from casting efficiency
            changeIncome();

            //Server
            var sendData = {
              hex:mouseHexColliding,
              building:placingBuilding
            }
            socket.emit("newBuilding", sendData);
          }
  			}
  		}
  		placingBuilding = -1;			//Pokud budovu postaví nebo ji má vybranou a klikne mimo možnou zemi, tak se zruší označení budovy.
  	}
  }
}

getBuildingCost = function(building){
  var cost;
  switch(building){
    case 0:
      cost = balance.farmCost;
      break;
    case 1:
      cost = balance.barracksCost;
      break;
    case 2:
      cost = balance.schoolOfMagicCost;
      break;
    case 3:
      cost = balance.millCost;
      break;
    case 4:
      cost = balance.wellCost;
      break;
    case 5:
      cost = balance.schoolOfMagicCost;
      break;
    case 6:
      cost = balance.yellowCrystalCost;
      break;
    case 7:
      cost = balance.redCrystalCost;
      break;
    case 8:
      cost = balance.blueCrystalCost;
      break;
   }

  cost = Math.round(cost * buildingSale);

  return cost;
}

buildingSpellSwitchFunction = function(){
  if (mouseUIcolliding.main !== -1){
    if (ui["main"][mouseUIcolliding.main].name === "buildingSpellSwitch"){
      switch(ui["main"][mouseUIcolliding.main].id){
        case 0:
          buildingOrSpell = "spell";
          break;
        case 1:
          buildingOrSpell = "building";
          break;
      }
    }
  }
}

selectTrainButton = function(){
  trainButtonSelected = -1;
  if (mouseUIcolliding.trainingUnits !== -1 && !showSendUnitUI && !showConfirmSpellUI){
    for(var key in ui["trainingUnits"]){
      if (key == mouseUIcolliding.trainingUnits && ui["trainingUnits"][key].name === "writeButton"){
        if ((ui["trainingUnits"][key].id !== 0) || (ui["trainingUnits"][key].id === 0 && checkIfCanTrain(hexSelected))){
          trainButtonSelected = ui["trainingUnits"][key].id;
        }
      }
    }
  }
}

selectSendButton = function(){
  sendButtonSelected = -1;
  if (mouseUIcolliding.sendingUnits !== -1 && showSendUnitUI && !showConfirmSpellUI){
    for(var key in ui["sendingUnits"]){
      if (key == mouseUIcolliding.sendingUnits && ui["sendingUnits"][key].name === "writeButton"){
        //If attacking, the id must be 1 (soldiers)
        if (!attacking || attacking && ui["sendingUnits"][key].id === 1){
          sendButtonSelected = ui["sendingUnits"][key].id;
        }
      }
    }
  }
}

trainUnitsButton = function(){
  if (showUnitUI && hexSelected !== -1 && !showSendUnitUI){
    for(var i in ui["trainingUnits"]){
      if (mouseUIcolliding.trainingUnits === i){
        if (ui["trainingUnits"][i].name === "sendButton"){
          //Train
          if (ui["trainingUnits"][i].id === 0){
            var building = hex[hexSelected].building;

            switch(building){
              case 0:    //Yellow (workers)
                trainUnits("workers",i);
                break;
              case 1:  //Red (soldiers)
                trainUnits("soldiers",i);
                break;
              case 2:  //Blue (games)
                trainUnits("mages",i);
                break;
            }
          }

          //Dismiss
          //Red (soldiers)
          if (ui["trainingUnits"][i].id === 1){
            if (hex[hexSelected].soldiers < trainValue[ui["trainingUnits"][i].id]){
              hex[hexSelected].soldiers = 0;
              trainUnitsSocket(hexSelected, "dismiss", "soldiers", hex[hexSelected].soldiers);
            }
            else {
              hex[hexSelected].soldiers -= trainValue[ui["trainingUnits"][i].id];
              trainUnitsSocket(hexSelected, "dismiss", "soldiers", trainValue[ui["trainingUnits"][i].id]);
            }

            changeIncome();
          }
          //Blue (mages)
          else if (ui["trainingUnits"][i].id === 2){
            if (hex[hexSelected].mages < trainValue[ui["trainingUnits"][i].id]){
              hex[hexSelected].mages = 0;
              trainUnitsSocket(hexSelected, "dismiss", "mages", hex[hexSelected].mages);
            }
            else {
              hex[hexSelected].mages -= trainValue[ui["trainingUnits"][i].id];
              trainUnitsSocket(hexSelected, "dismiss", "mages", trainValue[ui["trainingUnits"][i].id]);
            }

            changeIncome();
          }

          //Reset value
          trainValue[ui["trainingUnits"][i].id] = 0;
          trainDigits[ui["trainingUnits"][i].id] = [];
        }
      }
    }
  }
}

trainUnits = function(units,i){
  //Zde budu muset později přidat kontrolu, jestli má hráč dostatek zlata
  var amount = adjustTrainValueToCost(trainValue[ui["trainingUnits"][i].id], units);
  var unitWaitingVarName = units + "Waiting";
  hex[hexSelected][unitWaitingVarName] += amount;
  var goldSpent = getUnitCost(units) * amount;
  goldAmount -= goldSpent;
  changeIncome();

  //Server
  trainUnitsSocket(hexSelected, "train", units, amount);
}

adjustTrainValueToCost = function(trainValue, units){
  if (goldAmount >= 0){
    var cost = getUnitCost(units);
    if (trainValue * cost > goldAmount){
      trainValue = Math.floor(goldAmount / cost);
    }
  }
  else {
    trainValue = 0;
  }

  return trainValue;
}

getUnitCost = function(units){
  var cost;
  switch(units){
    case "workers":
      cost = balance.workerCost;
      break;
    case "soldiers":
      cost = balance.soldierCost;
      break;
    case "mages":
      cost = balance.mageCost;
      break;
  }

  return cost;
}

trainUnitsSocket = function(hex, actionType, units, amount){
  //actionType - jestli se má trénovat nebo propouštět. Nabývá hodnotu buď "train" nebo "dismiss".
  var sendData = {
    hex:hex,
    actionType:actionType,
    units:units,
    amount:amount
  }
  socket.emit("trainUnits", sendData);
}

showSendUnitsUI = function(){
	//Jestli se má zobrazovat UI pro posílání jednotek
  if (canMoveUnits && !showSendUnitUI && mouseHexColliding !== -1){
    for(var id in hexMoveAvailable){
  		if (hexMoveAvailable[id] === mouseHexColliding){
  			showSendUnitUI = true;
        moveUnitsToHex = mouseHexColliding;
        if (hex[moveUnitsToHex].owner !== 0 && hex[moveUnitsToHex].owner !== player){    //Pokud je cílová země nepřátelská
          attacking = true;
        }
        justOpenedSendUI = true;
  		}
  	}
  }
}

sendUnits = function(){
  if (mouseUIcolliding.sendingUnits !== -1 && showSendUnitUI){
    for(var key in ui["sendingUnits"]){
      if (key == mouseUIcolliding.sendingUnits && ui["sendingUnits"][key].name === "sendButton"){
        //Poslat
        //hexSelected, moveUnitsToHex, sendValue
        for(var i in sendValue){
          //Choose a unit for this loop
          var unitType;
          switch(parseInt(i)){
            case 0:
              unitType = "workers";
              break;
            case 1:
              unitType = "soldiers";
              break;
            case 2:
              unitType = "mages";
              break;
          }

          //If the value is higher than the actual amount of units, then the value will be lowered to the amount of units
          var actualValue = sendValue[i];
          var maxValue = sendValue[i];
          if (sendValue[i] > hex[hexSelected][unitType]){
            actualValue = hex[hexSelected][unitType];
          }

          //Sending units to a friendly or neutral hexagon
          if (actualValue !== 0){
            if (!attacking){
              //Send data to the server
              sendUnitsSocket(hexSelected, moveUnitsToHex, unitType, actualValue);

              //Subtract the units from the selected hexagon
              hex[hexSelected][unitType] -= actualValue;

              //Add the units to the recieving hexagon
              var unitWaitingType = unitType + "Waiting";
              hex[moveUnitsToHex][unitWaitingType] += actualValue;

                //Gain control of the hexagon (if it was neutral)
              if (hex[moveUnitsToHex].owner === 0){
                hex[moveUnitsToHex].owner = player;
              }
            }
            //Attacking
            else {
              attackingFunction(unitType, actualValue, maxValue);
            }

            //Change income (if necessary)
            changeIncome();
          }
        }

        //Close the sendUnitsUI
        showSendUnitUI = false;
        attacking = false;
      }
    }
  }
}

attackingFunction = function(unitType, actualValue, maxValue){
  if (unitType === "soldiers"){
    var originalSoldiersAmount = actualValue;    //this will not change and will be sent to the server
    var soldiersLost = 0;

    //Fight with enemy soldiers
    if (hex[moveUnitsToHex].soldiers !== 0){
      //Enemy has more soldiers
      if (hex[moveUnitsToHex].soldiers >= actualValue){
        //Kill enemy soldiers
        hex[moveUnitsToHex].soldiers -= actualValue;
                                                            //Must be in this order (kill -> lose)
         //Lose own soldiers
        soldiersLost = actualValue;
        actualValue = 0;
      }

      //Enemy has less soldiers
      if (hex[moveUnitsToHex].soldiers < actualValue){
        //Lose own soldiers
        soldiersLost = hex[moveUnitsToHex].soldiers;
        actualValue -= hex[moveUnitsToHex].soldiers;
                                                            //Must be in this order (lose -> kill)
        //Kill enemy soldiers
        hex[moveUnitsToHex].soldiers = 0;
      }
    }

    //Remove lost soldiers from the selected hexagon
    hex[hexSelected].soldiers -= soldiersLost;

    //Kill non-soldiers units   (if at least 1 soldier is alive)
    var workersKilled = 0;
    var magesKilled = 0;
    if (actualValue !== 0){
      var enemyUnitsCount = hex[moveUnitsToHex].workers + hex[moveUnitsToHex].mages;
      var enemiesKilled = 0;
      while(enemyUnitsCount !== 0){
        //Choose a unit to kill
        var unitToKill = chooseUnitToKill(hex[moveUnitsToHex].workers, hex[moveUnitsToHex].mages);

        //Kill the chosen unit, do actions connected with this
        hex[moveUnitsToHex][unitToKill] -= 1;
        enemiesKilled++;
        enemyUnitsCount--;

          //Server actions connected with this
        if (unitToKill === "workers")
          workersKilled++;
        else if (unitToKill === "mages")
          magesKilled++;


        //Break the loop if every soldier has killed 1 unit and some units are still alive.
        if (enemiesKilled === actualValue){
          break;
        }
      }

      sendUnitsSocket(hexSelected, moveUnitsToHex, unitType, originalSoldiersAmount, workersKilled, magesKilled);    //Send the data to the server

      //Soldiers that killed a unit are exhausted and need to rest.
      hex[hexSelected].soldiersWaiting += enemiesKilled;
      hex[hexSelected].soldiers -= enemiesKilled;
      actualValue -= enemiesKilled;

      //All enemy units are eliminated -> move remaining, not exhausted soldiers to the new hexagon
      if (enemyUnitsCount === 0 && actualValue !== 0){
        //Capture the hexagon
        hex[moveUnitsToHex].owner = player;

        //Move the remaining soldiers
        hex[moveUnitsToHex].soldiersWaiting += actualValue;

        //Subtract the units from the selected hexagon
        hex[hexSelected].soldiers -= actualValue;
      }
    }
    //If no attacking soldier is alive, no non-soldier units will be killed. Data about this need to be sent to the server.
    else {
      sendUnitsSocket(hexSelected, moveUnitsToHex, unitType, originalSoldiersAmount, workersKilled, magesKilled);
    }
  }
}

sendUnitsSocket = function(hex, moveUnitsToHex, unitsType, amount, workersKilled, magesKilled){
  //workersKilled and magesKilled are optional parameters. If attacking is false, these parameters will be undefined.

  var sendData = {
    hex:hex,
    moveUnitsToHex:moveUnitsToHex,
    unitsType:unitsType,
    amount:amount,
    workersKilled:workersKilled,
    magesKilled:magesKilled
  }
  socket.emit("sendUnits", sendData);
}

chooseUnitToKill = function(workersAmount, magesAmount){
  //Choose a unit to kill (0 = worker; 1 = mage)
  var unitToKill;
  if (hex[moveUnitsToHex].workers !== 0 && hex[moveUnitsToHex].mages !== 0){
    var unitToKill = Math.floor(Math.random()*2);
  }
  else if (hex[moveUnitsToHex].workers === 0){
    unitToKill = 1;
  }
  else if (hex[moveUnitsToHex].mages === 0){
    unitToKill = 0;
  }

  //Transfer the number into a string
  switch(unitToKill){
    case 0:
      unitReturn = "workers";
      break;
    case 1:
      unitReturn = "mages";
      break;
  }

  return unitReturn;
}

dontShowSendUnitsUI = function(){
  if (showSendUnitUI && !justOpenedSendUI){
    //Pokud hráč kliknul mimo lištu
    if (mouseUIcolliding.sendingUnitsBg === -1){
      showSendUnitUI = false;
      attacking = false;
    }

    //Pokud hráč kiknul na tlačítko pro zrušení
    if (mouseUIcolliding.sendingUnits !== -1){
      for (var key in ui["sendingUnits"]){
        if (key == mouseUIcolliding.sendingUnits && ui["sendingUnits"][key].name === "cancelButton"){
          showSendUnitUI = false;
          attacking = false;
        }
      }
    }
  }

  //Reset
  justOpenedSendUI = false;
}

dontShowConfirmSpellUI = function(){
  if (showConfirmSpellUI && !justOpenedConfirmSpellUI){
    //Pokud hráč kliknul mimo lištu
    if (mouseUIcolliding.confirmSpellBg === -1){
      showConfirmSpellUI = false;
    }

    //Pokud hráč kiknul na tlačítko pro zrušení
    if (mouseUIcolliding.confirmSpell !== -1 && ui["confirmSpell"][mouseUIcolliding.confirmSpell].name === "noButton"){
      showConfirmSpellUI = false;
    }
  }

  //Reset
  justOpenedConfirmSpellUI = false;
}

endTurn = function(socket){
  if (playing && !showSendUnitUI && !showConfirmSpellUI){
    if (mouseUIcolliding.main !== -1){
      if (ui["main"][mouseUIcolliding.main].name === "endTurn"){
        socket.emit("endTurn");
        refreshUnits();
        goldAmount += goldIncome;
        manaAmount += manaIncome;
        greedMultiplier = 1;
        changeIncome();
        playing = false;
      }
    }
  }
}

refreshUnits = function(){
  for (key in hex){
    for (var i = 0; i <= 2; i++){
      var unitType;
      switch(parseInt(i)){
        case 0:
          unitType = "workers";
          break;
        case 1:
          unitType = "soldiers";
          break;
        case 2:
          unitType = "mages";
          break;
      }

      var unitWaitingType = unitType + "Waiting";

      if (hex[key][unitWaitingType] !== 0){
        hex[key][unitType] += hex[key][unitWaitingType];
        hex[key][unitWaitingType] = 0;
      }
    }
  }
}

calculateTrainValue = function(trainDigits, trainButtonSelected){
  var value = 0;
  var array = trainDigits[trainButtonSelected];
  var length = array.length;
  for(var i in array){
    var multiple = Math.pow(10, length-1);
    value += array[i] * multiple;
    length--;
  }

  return value;
}

calculateSendValue = function(sendDigits, sendButtonSelected){
  var value = 0;
  var array = sendDigits[sendButtonSelected];
  var length = array.length;
  for(var i in array){
    var multiple = Math.pow(10, length-1);
    value += array[i] * multiple;
    length--;
  }

  return value;
}
