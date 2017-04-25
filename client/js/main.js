//Základní proměnné
var socket = io({transports: ['websocket']});
var timeout = 0;
var loopGame = false;

//Proměnné, které bude mít klient u sebe - toto budu ale muset kontrolovat i na serveru, jestli sedí (ochrana proti cheatům)
var myID = -1;
var playing = -1;   //kdo je na tahu

var mouseX = 0;
var mouseY = 0;

var index = 0;    //slouží při hidden ui

var trainValue = [0,0,0];    //hodnota, která se udává při trénování nebo propuštění jednotek. 3 tlačítka, proto 3 hodnoty v array.
var trainButtonSelected = -1;   //Které z tlačítek pro trénování je označeno. Pokud žádné, -1.
var trainDigits = [[],[],[]];   //3 arraye v arrayi. 1 podarray v sobě zahrnuje číslice, které hráč zmáčknul, když měl označené tlačítko pro zadávání počtu jednotek.

var mapCreated = false;

var columns = 5;
var mainColumnSize = 6;

var hex = {};   //Hexagon object - contains objects of each hexagon, named by a number (first index is 0)
var hexXpos = 275;	//Pozice, kde začíná mapa (kde se nachází hexagon s indexem 0)
var hexYpos = 280;

var mouseHexColliding = -1;		//What hexagon is mouse hovering over. If none, -1.
var mouseUIcolliding = -1;		//What UI element is mouse hovering over. If none, -1.
var mouseHiddenUIcolliding = -1;    //What hidden UI element is mouse hovering over. If none, -1.

var placingBuilding = -1;		//What building player has selected. If none, -1. 	//ID stavby = id stavby v UI.

var hexSelected = -1;		//What hexagon player has selected. If none, -1.

var showUnitUI = false;		//Jestli se má zobrazovat lišta pro trénování jednotek (zobrazuje se, pokud je označena nějaká země a je v ní budovu pro výcvik).

var hexMoveAvailable = [];		//If a hexagon is selected, it shows available moves. This array contains the id of hexagons, where the movement is possible.

//UI
var ui = {};
var uiHidden = {};

//Definované funkce
//Non-game socket functions
getSocketId = function(socket){
  socket.on("id", function(data){
    myID = data;
  });
}

onSearching = function(socket){
  socket.on("searching",function(data){
    //Background
    ctx.fillStyle = "gray";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    //Text
    ctx.font = "60px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText("Searching...", WIDTH/2, HEIGHT/2);
  });
}

sendTimeoutSocket = function(socket){
  socket.on("timeout", function(data){
    timeout = data;
    var random = Math.random();
    socket.emit("timein", random);
  });
}

onStartGame = function(socket){
  socket.on("startGame", function(data){
    loopGame = true;
    playing = data;
    console.log("Start game! Is this player first? " + playing);

    //Draw some basic text (temporary)
    ctx.fillStyle = "gray";
    ctx.fillRect(0,0,WIDTH,HEIGHT);

    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(playing, WIDTH/2, HEIGHT/2);
  });
}

//Game socket functions
onStartTurn = function(socket){
  socket.on("startTurn", function(){
    playing = true;
    console.log("Playing!");
  });
}

//Initial functions
createMap = function(columns,mainColumnSize){
	//Calculate hexCount
	var hexCount = mainColumnSize;
	var sideColumns = (columns - 1) / 2;
	for(var col = 1; col <= sideColumns; col++){
		hexCount += (mainColumnSize - col) * 2;
	}

	//Create the map
	var currentColFromMain = sideColumns;		//Jak daleko je momentální sloupec vzdálen od středu
	var currentDist = sideColumns;					//Jak daleko je momentální sloupec vzdálen od středu - pomocná proměnná
	var currentCol = 1;
	var currentColPos = 1;
	var currentColSize;

	//Create the hexagon objects, set their variables
	for(var id = 0; id < hexCount; id++){
		hex[id] = {};

		currentColSize = mainColumnSize - currentColFromMain;

		//Variables
		hex[id].x = hexXpos + (Img.hex.width*(currentCol-1) * 0.75);	//Musí se vynásobit 0.75, aby do sebe hexagony přesně zapadaly - jinak by byly daleko od sebe
		hex[id].y = hexYpos + Img.hex.height*(currentColPos-1) - Img.hex.height*(sideColumns-currentColFromMain) / 2 - currentColPos;
		hex[id].column = currentCol;
		hex[id].line = currentColPos + mainColumnSize - (mainColumnSize - Math.abs(currentDist)) / 2 - mainColumnSize / 2;
		hex[id].building = -1;
		hex[id].workers = 0;
		hex[id].soldiers = 0;
		hex[id].mages = 0;

		currentColPos++;
		if (currentColPos > currentColSize){
			currentColPos = 1;
			currentDist--;
			currentCol++;
			currentColFromMain = Math.abs(currentDist);
			currentColSize = mainColumnSize - currentColFromMain;
		}
	}

	mapCreated = true;
}

createUI = function(){
	//struktura: createUIelements(image, name, id, x, y, hidden)

	//Levý horní roh
	createUIelements(Img.uiInfo, "info", 0, 0, 0, false);

	//Horní lišta
	createUIelements(Img.uiTrainBar, "trainBar", 0, 120, 0, false);
	createUIelements(Img.uiEndTurn, "endTurn", 0, 570, 0, false);

	//Levá lišta
	//Přepínání mezi budovami a kouzly
	createUIelements(Img.uiBuildingSpellSwitch, "buildingSpellSwitch", 0, 0, 100, false);
	createUIelements(Img.uiBuildingSpellSwitch, "buildingSpellSwitch", 1, 60, 100, false);

	//Budovy
	var startX = 0;
	var startY = 160;
	for(var i = 0; i <= 8; i++){
		createUIelements(Img.uiBuildingBg, "building", i, 0, startY + i*Img.uiBuildingBg.height, false);
	}

	//Hidden
	//Horní lišta - skryté ikony
		//Levá část
	createUIelements(Img.writeButton, "writeButton", 0, 180, 55, true);
	createUIelements(Img.sendButton, "sendButton", 0, 270, 55, true);

		//Pravá část
	createUIelements(Img.writeButton, "writeButton", 1, 400, 40, true);
	createUIelements(Img.sendButton, "sendButton", 1, 490, 40, true);
	createUIelements(Img.writeButton, "writeButton", 2, 400, 70, true);
	createUIelements(Img.sendButton, "sendButton", 2, 490, 70, true);
}

createUIelements = function(image, name, id, x, y, hidden){
	/*
	Struktura
	ui[index] = {
		image: název obrázku v objektu Img
		name: jméno elementu,
		id: pokud je více elementů se stejným jménem, mají odlišné id. V základu je id 0,
		x: x,
		y: y,
	}
	*/
	if (!hidden){
		ui[index] = {
			image: image,
			name: name,
			id: id,
			x: x,
			y: y,
		}
	}
	else {
		uiHidden[index] = {
			image: image,
			name: name,
			id: id,
			x: x,
			y: y,
		}
	}


	index++;		//index = global var
}

//Collision functions
checkCollision = function(){
	checkMouseHexCollision();
	checkMouseUIcollision();
}

checkMouseHexCollision = function(){
	mouseHexColliding = -1;		//Tato hodnota se změní, pokud bude colliding
	for(var i in hex){
		//Calculate X and Y difference between hexagon and mouse
		var xDiff = Math.abs(mouseX - hex[i].x);
		var yDiff = Math.abs(mouseY - hex[i].y);

		//Discard anything that's not colliding
		if (xDiff >= Img.hex.width/2 || yDiff >= Img.hex.height/2){
			continue;
		}
		else{
			if (xDiff >= Img.hex.width/4){
				var xEdge = (Img.hex.height - yDiff) * (Math.tan(30 * Math.PI / 180));
				if (xDiff >= xEdge){
					continue;
				}
			}
		}

		//Return colliding
		mouseHexColliding = i;
	}

	//Do something if colliding
}

checkMouseUIcollision = function(){
	mouseUIcolliding = -1;		//Tato hodnota se změní, pokud bude colliding
	for(var key in ui){
		if (mouseX >= ui[key].x &&
			mouseX <= ui[key].x + ui[key].image.width &&
			mouseY >= ui[key].y &&
			mouseY <= ui[key].y + ui[key].image.height){
				mouseUIcolliding = key;
		}
	}

  //Hidden UI
  mouseHiddenUIcolliding = -1;		//Tato hodnota se změní, pokud bude colliding
  if (showUnitUI){
    for(var key in uiHidden){
  		if (mouseX >= uiHidden[key].x &&
  			mouseX <= uiHidden[key].x + uiHidden[key].image.width &&
  			mouseY >= uiHidden[key].y &&
  			mouseY <= uiHidden[key].y + uiHidden[key].image.height){
  				mouseHiddenUIcolliding = key;
  		}
  	}
  }

}

//Step functions
stepEvent = function(){
	showUnitsUI();

  //Reset training / dismissing values
  if (!showUnitUI){
    trainValue = [0,0,0];
    trainDigits = [[],[],[]];
  }
}

showUnitsUI = function(){
	if (hexSelected !== -1){
		showUnitUI = true;
	}
	else {
		showUnitUI = false;
	}
}

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
      unitsSendButton();
      endTurn(socket);
    }
  }

  document.oncontextmenu = function(mouse){		//oncontextmenu = right click
  	placingBuilding = -1;
  	hexSelected = -1;

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
  if (playing){
  	var notUnselect = false;		//Zajistí, aby se země neodznačila hned po to, co je označena.
  	//Kliknutí na zemi a nestaví budovu
  	if ((mouseHexColliding !== -1) && (placingBuilding === -1)){
  		//Pokud klikne na zemi, tak danou zemi označí.
  		if (hexSelected === -1){
  			hexSelected = mouseHexColliding;
  			notUnselect = true;
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

  		if (mouseUIcolliding !== -1){
  			if (ui[mouseUIcolliding].name === "trainBar"){			//Označení se nezruší, pokud klikne na train bar (pokud chce trénovat nebo propustit jednotky)
  				unselect = false;
  			}
  		}

  		if (unselect === true){
  			hexSelected = -1;
  		}
  	}
  }
}

placeBuilding = function(){
  if (playing){
  	//Pokud klikne na budovu v UI, budovu tím vybere.
  	if (mouseUIcolliding !== -1){
  		if (ui[mouseUIcolliding].name === "building"){
  			placingBuilding = mouseUIcolliding;
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
  if (mouseHiddenUIcolliding !== -1){
    for(var i in uiHidden){
      if (i == mouseHiddenUIcolliding && uiHidden[i].name === "writeButton"){
        trainButtonSelected = uiHidden[i].id;
      }
    }
  }
}

unitsSendButton = function(){
  if (showUnitUI && hexSelected !== -1){
    for(var i in uiHidden){
      if (mouseHiddenUIcolliding === i){
        if (uiHidden[i].name === "sendButton"){
          //Train
          if (uiHidden[i].id === 0){
            for (var id in ui){
              if (ui[id].name === "building")
                break;
                //Vrátí id jako číslo první budovy. Další výcvikové buvody jsou id+1 a id+2.
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
          if (uiHidden[i].id === 1){
            if (hex[hexSelected].soldiers < trainValue[uiHidden[i].id]){
              hex[hexSelected].soldiers = 0;
            }
            else {
              hex[hexSelected].soldiers -= trainValue[uiHidden[i].id];
            }
          }
          //Blue (mages)
          else if (uiHidden[i].id === 2){
            if (hex[hexSelected].mages < trainValue[uiHidden[i].id]){
              hex[hexSelected].mages = 0;
            }
            else {
              hex[hexSelected].mages -= trainValue[uiHidden[i].id];
            }
          }

          //Reset value
          trainValue[uiHidden[i].id] = 0;
          trainDigits[uiHidden[i].id] = [];
        }
      }
    }
  }
}

trainUnits = function(units,i){
  //Zde budu muset později přidat kontrolu, jestli má hráč dostatek zlata
  hex[hexSelected][units] += trainValue[uiHidden[i].id];
}

endTurn = function(socket){
  if (playing){
    if (mouseUIcolliding !== -1){
      if (ui[mouseUIcolliding].name === "endTurn"){
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

//Other functions
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

checkIfCanTrain = function(hexSelected){
	for (var i in ui){
		if (ui[i].name === "building")
			break;
			//Vrátí i jako číslo první budovy. Další výcvikové buvody jsou i+1 a i+2.
			//Pozn. - nutno převést i na integer
	}
	var i = parseInt(i);
	if ((hex[hexSelected].building >= i) && (hex[hexSelected].building <= i+2))
		return true;
	else
		return false;
}

selectUiImage = function(key){
	var image;
	switch(ui[key].id){
		case 0:
			image = Img.uiFarm;
			break;
		case 1:
			image = Img.uiBarracks;
			break;
		case 2:
			image = Img.uiSchoolOfMagic;
			break;
		case 3:
			image = Img.uiMill;
			break;
		case 4:
			image = Img.uiWell;
			break;
		case 5:
			image = Img.uiTemple;
			break;
		case 6:
			image = Img.uiYellowCrystal;
			break;
		case 7:
			image = Img.uiRedCrystal;
			break;
		case 8:
			image = Img.uiBlueCrystal;
			break;
	}
	return image;
}

selectImage = function(key){
	var image;
	switch(ui[key].id){
		case 0:
			image = Img.farm;
			break;
		case 1:
			image = Img.barracks;
			break;
		case 2:
			image = Img.schoolOfMagic;
			break;
		case 3:
			image = Img.mill;
			break;
		case 4:
			image = Img.well;
			break;
		case 5:
			image = Img.temple;
			break;
		case 6:
			image = Img.yellowCrystal;
			break;
		case 7:
			image = Img.redCrystal;
			break;
		case 8:
			image = Img.blueCrystal;
			break;
	}
	return image;
}


//gameLoop - starts looping when a match is found
gameLoop = function(){
  if (loopGame){
    //Create the map
  	if (mapCreated === false){
  		createMap(columns,mainColumnSize);
  		createUI();
  	}

    //Check collision
    checkCollision();

    //Step event
  	stepEvent();

  	//Draw
  	drawGame();

    //test
    /*
    if (showUnitUI)
      console.log(hex[hexSelected].building);
    */
  }
}

//Non-game sockets - interaction with the server
getSocketId(socket);

onSearching(socket);

onStartGame(socket);

sendTimeoutSocket(socket);

onStartTurn(socket);

//Inputs
input();

//Game loop
setInterval(gameLoop, 1000/25);
