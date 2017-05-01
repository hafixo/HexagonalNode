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
      selectTrainButton();
      selectSendButton();
      unitsSendButton();
      showSendUnitsUI();
      endTurn(socket);
      dontShowSendUnitsUI();    //Musí být na konci
    }
  }

  document.oncontextmenu = function(mouse){		//oncontextmenu = right click
    if (!showSendUnitUI){
      placingBuilding = -1;
    	hexSelected = -1;
    }

    dontShowSendUnitsUI();

  	return false;		//Musí být, aby se neukázalo otravné HTML okno
  }

  document.onkeydown = function(event){
    //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    for(var i = 0; i <= 9; i++){
      if(event.keyCode === 48 + i || event.keyCode === 96 + i){    //48 = 0; 57 = 9;   NUM: 96 = 0; 105 = 9;
        var numberPressed = i;
        if (trainButtonSelected !== -1){
          if (trainDigits[trainButtonSelected].length < 4 && (!(trainDigits[trainButtonSelected].length === 0 && numberPressed === 0))){    //Číslo se nepřidá, pokud a) je délka 4; b) je délka 0 a zmáčknutá klávesa je 0
            trainDigits[trainButtonSelected].push(numberPressed);
            trainValue[trainButtonSelected] = calculateTrainValue(trainDigits, trainButtonSelected);
          }
        }
      }
    }

    //test
    if(event.keyCode === 8){
      console.log("Works 1");
      if (trainButtonSelected !== -1){
        console.log("Works 2");
        trainDigits[trainButtonSelected] = [];
        trainValue[trainButtonSelected] = 0;
      }
    }
  }

}

selectHexagon = function(){
  if (playing && !showSendUnitUI){
  	var notUnselect = false;		//Zajistí, aby se země neodznačila hned po to, co je označena.
  	//Klikne na zemi a nestaví budovu
  	if ((mouseHexColliding !== -1) && (placingBuilding === -1)){
  		//Pokud klikne na zemi, tak danou zemi označí.
  		if (hexSelected === -1){
  			hexSelected = mouseHexColliding;
  			notUnselect = true;
        hexMoveAvailable = findAdjacentHexagons(hexSelected);
  		}
  	}
  	//Pokud má označenou zemi a klikne, tak se označení zruší. Jsou zde 2 výjimky.
  	if ((hexSelected !== -1) && (notUnselect === false)) {
  		var unselect = true;
  		for (var i in hexMoveAvailable){
  			if (hexMoveAvailable[i] === mouseHexColliding){		//Označení se nezruší, pokud klikne na sousední zemi
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
  if (playing && !showSendUnitUI){
  	//Pokud klikne na budovu v UI, budovu tím vybere.
  	if (mouseUIcolliding.main !== -1){
  		if (ui["main"][mouseUIcolliding.main].name === "building"){
  			placingBuilding = mouseUIcolliding.main;
  		}
      else {
        placingBuilding = -1;     //Označení se zruší, pokud klikne jinam do UI.
      }
  	}
  	else {
  		//Kliknutí na zemi
  		if (mouseHexColliding !== -1){
  			//Pokud klikne na možnou zemi, postaví se tam budova
  			if (placingBuilding !== -1){
  				if (hex[mouseHexColliding].building === -1){
  					hex[mouseHexColliding].building = placingBuilding;
  				}
  			}
  		}
  		placingBuilding = -1;			//Pokud budovu postaví nebo ji má vybranou a klikne mimo možnou zemi, tak se zruší označení budovy.
  	}
  }
}

selectTrainButton = function(){
  trainButtonSelected = -1;
  if (mouseUIcolliding.trainingUnits !== -1 && !showSendUnitUI){
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
  if (mouseUIcolliding.sendingUnits !== -1 && showSendUnitUI){
    for(var key in ui["sendingUnits"]){
      if (key == mouseUIcolliding.sendingUnits && ui["sendingUnits"][key].name === "writeButton"){
        sendButtonSelected = ui["sendingUnits"][key].id;
      }
    }
  }
}

unitsSendButton = function(){
  if (showUnitUI && hexSelected !== -1 && !showSendUnitUI){
    for(var i in ui["trainingUnits"]){
      if (mouseUIcolliding.trainingUnits === i){
        if (ui["trainingUnits"][i].name === "sendButton"){
          //Train
          if (ui["trainingUnits"][i].id === 0){
            for (var id in ui["main"]){
              if (ui["main"][id].name === "building")
                break;
                //Vrátí id jako číslo první budovy. Další výcvikové budovy jsou id+1 a id+2.
                //Pozn. - nutno převést id na integer
            }

            var id = parseInt(id);
            var building = parseInt(hex[hexSelected].building);

            switch(building){
              case id:    //Yellow (workers)
                trainUnits("workers",i);
                break;
              case id+1:  //Red (soldiers)
                trainUnits("soldiers",i);
                break;
              case id+2:  //Blue (games)
                trainUnits("mages",i);
                break;
            }
          }

          //Dismiss
          //Red (soldiers)
          if (ui["trainingUnits"][i].id === 1){
            if (hex[hexSelected].soldiers < trainValue[ui["trainingUnits"][i].id]){
              hex[hexSelected].soldiers = 0;
            }
            else {
              hex[hexSelected].soldiers -= trainValue[ui["trainingUnits"][i].id];
            }
          }
          //Blue (mages)
          else if (ui["trainingUnits"][i].id === 2){
            if (hex[hexSelected].mages < trainValue[ui["trainingUnits"][i].id]){
              hex[hexSelected].mages = 0;
            }
            else {
              hex[hexSelected].mages -= trainValue[ui["trainingUnits"][i].id];
            }
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
  hex[hexSelected][units] += trainValue[ui["trainingUnits"][i].id];
}

showSendUnitsUI = function(){
	//Jestli se má zobrazovat UI pro posílání jednotek
  if (canMoveUnits && !showSendUnitUI && mouseHexColliding !== -1){
    for(var id in hexMoveAvailable){
  		if (hexMoveAvailable[id] === mouseHexColliding){
  			showSendUnitUI = true;
        moveUnitsToHex = mouseHexColliding;
        justOpened = true;
  		}
  	}
  }
}

dontShowSendUnitsUI = function(){
  if (showSendUnitUI && !justOpened){
    //Pokud hráč kliknul mimo lištu
    if (mouseUIcolliding.sendingUnitsBg === -1){
      showSendUnitUI = false;
    }

    //Pokud hráč kiknul na tlačítko pro zrušení
    if (mouseUIcolliding.sendingUnits !== -1){
      for (var key in ui["sendingUnits"]){
        if (key == mouseUIcolliding.sendingUnits && ui["sendingUnits"][key].name === "cancelButton"){
          showSendUnitUI = false;
        }
      }
    }
  }


  //Reset
  justOpened = false;
}

endTurn = function(socket){
  if (playing && !showSendUnitUI){
    if (mouseUIcolliding.main !== -1){
      if (ui["main"][mouseUIcolliding.main].name === "endTurn"){
        socket.emit("endTurn");
        playing = false;
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
