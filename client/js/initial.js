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
