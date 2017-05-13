var createGameVariables = function(gameID, columns, mainColumnSize){
  gamesList[gameID].player1 = undefined;
  gamesList[gameID].player2 = undefined;

  gamesList[gameID].hex = {};       //Hexagon object - contains objects of each hexagon, named by a number (first index is 0)

  createMap(gameID, columns, mainColumnSize);
}

createMap = function(gameID, columns, mainColumnSize){
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
    gamesList[gameID].hex[id] = {};

    currentColSize = mainColumnSize - currentColFromMain;

    //Variables
    /*
    hex[id].x = hexXpos + (Img.hex.width*(currentCol-1) * 0.75);	//Musí se vynásobit 0.75, aby do sebe hexagony přesně zapadaly - jinak by byly daleko od sebe
    hex[id].y = hexYpos + Img.hex.height*(currentColPos-1) - Img.hex.height*(sideColumns-currentColFromMain) / 2 - currentColPos;
    */
    gamesList[gameID].hex[id].column = currentCol;
    gamesList[gameID].hex[id].line = currentColPos + mainColumnSize - (mainColumnSize - Math.abs(currentDist)) / 2 - mainColumnSize / 2;
    gamesList[gameID].hex[id].building = -1; setHexBuilding(gamesList[gameID].hex[id].column, gamesList[gameID].hex[id].line); //zde
    gamesList[gameID].hex[id].workers = 0;
    gamesList[gameID].hex[id].soldiers = 0;
    gamesList[gameID].hex[id].mages = 0;
    gamesList[gameID].hex[id].workersWaiting = 0;
		gamesList[gameID].hex[id].soldiersWaiting = 0;
		gamesList[gameID].hex[id].magesWaiting = 0;
    gamesList[gameID].hex[id].owner = setHexOwner(gamesList[gameID].hex[id].column, gamesList[gameID].hex[id].line);	//zde

    currentColPos++;
    if (currentColPos > currentColSize){
      currentColPos = 1;
      currentDist--;
      currentCol++;
      currentColFromMain = Math.abs(currentDist);
      currentColSize = mainColumnSize - currentColFromMain;
    }
  }
}

setHexBuilding = function(column, line){
	var building = -1;		//nic
	if ((column === (columns+1) / 2) && (line === 1 || line === mainColumnSize)){		//Pokud se jedná o počáteční pole (nahoře nebo dole)
		building = 1;   //1 = farma
	}

	return building;
}

setHexOwner = function(column, line){
	var owner = 0;
	if (column === (columns+1) / 2){		//Pokud se jedná o prostřední sloupec
		switch(line){
			case 1:
				owner = 2;
				break;
			case mainColumnSize:
				owner = 1;
				break;
			default:
				owner = 0;
				break;
		}
	}

	return owner;
}

//Export
module.exports = createGameVariables;
