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
		hex[id].workersWaiting = 0;
		hex[id].soldiersWaiting = 0;
		hex[id].magesWaiting = 0;

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
	//struktura: createUIelements(image, name, id, x, y, subObject)

	//Main
		//Levý horní roh
	createUIelements(Img.uiInfo, "info", 0, 0, 0, "main");

		//Horní lišta
	createUIelements(Img.uiTrainBar, "trainBar", 0, 120, 0, "main");
	createUIelements(Img.uiEndTurn, "endTurn", 0, 570, 0, "main");

		//Levá lišta
		//Přepínání mezi budovami a kouzly
	createUIelements(Img.uiBuildingSpellSwitch, "buildingSpellSwitch", 0, 0, 100, "main");
	createUIelements(Img.uiBuildingSpellSwitch, "buildingSpellSwitch", 1, 60, 100, "main");

		//Budovy
	var startX = 0;
	var startY = 160;
	for(var i = 0; i <= 8; i++){
		createUIelements(Img.uiBuildingBg, "building", i, 0, startY + i*Img.uiBuildingBg.height, "main");
	}

	//Training units
		//Horní lišta - skryté ikony
		//Levá část
	createUIelements(Img.writeButton, "writeButton", 0, 180, 55, "trainingUnits");
	createUIelements(Img.sendButton, "sendButton", 0, 270, 55, "trainingUnits");

		//Pravá část
	createUIelements(Img.writeButton, "writeButton", 1, 400, 40, "trainingUnits");
	createUIelements(Img.sendButton, "sendButton", 1, 490, 40, "trainingUnits");
	createUIelements(Img.writeButton, "writeButton", 2, 400, 70, "trainingUnits");
	createUIelements(Img.sendButton, "sendButton", 2, 490, 70, "trainingUnits");

	//Sending units BG
		//Background
	var x = Math.round(120+(WIDTH-120) / 2 - Img.uiSendUnitsBg.width / 2);
	var y = Math.round(100+(HEIGHT-100) / 2 - Img.uiSendUnitsBg.height / 2);
	createUIelements(Img.uiSendUnitsBg, "sendUnitsBg", 0, x, y, "sendingUnitsBg");

	//Sending units
		//Buttons - cancel, send
	var newX = Math.round(x + Img.uiSendUnitsBg.width * 0.7);
	var newY = Math.round(y + Img.uiSendUnitsBg.height * 0.45);
	createUIelements(Img.uiSendUnitsButton, "cancelButton", 0, newX, newY, "sendingUnits");
	var newX = Math.round(x + Img.uiSendUnitsBg.width * 0.7);
	var newY = Math.round(y + Img.uiSendUnitsBg.height * 0.7);
	createUIelements(Img.uiSendUnitsButton, "sendButton", 0, newX, newY, "sendingUnits");

		//Buttons - choosing the amount
	var newX = Math.round(x + Img.uiSendUnitsBg.width * 0.25);
	var newY = Math.round(y + Img.uiSendUnitsBg.height * 0.425);
	createUIelements(Img.writeButton, "writeButton", 0, newX, newY, "sendingUnits");
	var newX = Math.round(x + Img.uiSendUnitsBg.width * 0.25);
	var newY = Math.round(y + Img.uiSendUnitsBg.height * 0.6);
	createUIelements(Img.writeButton, "writeButton", 1, newX, newY, "sendingUnits");
	var newX = Math.round(x + Img.uiSendUnitsBg.width * 0.25);
	var newY = Math.round(y + Img.uiSendUnitsBg.height * 0.775);
	createUIelements(Img.writeButton, "writeButton", 2, newX, newY, "sendingUnits");
}

createUIelements = function(image, name, id, x, y, subObject){
	/*
	Struktura
	ui[subObject][index] = {
		image: název obrázku v objektu Img
		name: jméno elementu,
		id: pokud je více elementů se stejným jménem, mají odlišné id. V základu je id 0,
		x: x,
		y: y,
	}
	*/

  ui[subObject][index] = {
    image: image,
    name: name,
    id: id,
    x: x,
    y: y,
  }

	index++;		//index = global var
}
