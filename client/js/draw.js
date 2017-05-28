//Draw functions
drawGame = function(){
	ctx.fillStyle = "green";
	ctx.fillRect(0,0,WIDTH,HEIGHT);

	drawHexagons();

	drawHexagonBackground();

	drawHexElements();

	//UI
	drawUI();

	drawUIhover();

	drawUItopLayer();

}

drawHexagons = function(){
	//ctx.drawImage(image,cropStartX,cropStartY,cropWidth,cropHeight,drawX,drawY,drawWidth,drawHeight)
	for(var id in hex){
		var centerX = hex[id].x - Img.hex.width/2;
		var centerY = hex[id].y - Img.hex.height/2;
		ctx.drawImage(Img.hex,0,0,Img.hex.width,Img.hex.height,centerX,centerY,Img.hex.width,Img.hex.height);
	}
}

drawHexagonBackground = function(){
	for(var key in hex){
		//This will be always drawn
		drawOwnerBackground(key);

		//Set a counter. If there's a correct background, counter will be changed and no other background will be drawn.
		hexBackgroundSelected = false;		//global var

		//Go through each layer
		drawHexSelected(key);
		drawHexAdjacentToSelectedHexHover(key);
		drawHexAdjacentToSelectedHexIfSendingUnits(key);
		drawHexAdjacentToSelectedHex(key);
		drawHexPlacingBuildingHover(key);
		drawHexPlacingBuildingAvailable(key);
		drawHexHover(key);
	}
}

drawHexSelected = function(key){
	//Draw background if this hexagon is selected
	if (playing && hexBackgroundSelected === false){
		if (key === hexSelected){
			var centerX = hex[key].x - Img.hex.width/2;
			var centerY = hex[key].y - Img.hex.height/2;
			ctx.drawImage(Img.hexSelected,0,0,Img.hexSelected.width,Img.hexSelected.height,centerX,centerY,Img.hexSelected.width,Img.hexSelected.height);

			hexBackgroundSelected = true;
		}
	}
}

drawHexAdjacentToSelectedHexIfSendingUnits = function(key){
	//Highlight targeted hexagon (if sending units)
 	if (canMoveUnits && showSendUnitUI && hexBackgroundSelected === false){
		if (key === moveUnitsToHex){
	 		var centerX = hex[moveUnitsToHex].x - Img.hex.width/2;
	 		var centerY = hex[moveUnitsToHex].y - Img.hex.height/2;
	 		ctx.drawImage(Img.hexTargeted,0,0,Img.hexTargeted.width,Img.hexTargeted.height,centerX,centerY,Img.hexTargeted.width,Img.hexTargeted.height);

			hexBackgroundSelected = true;
		}
 	}
}

drawHexAdjacentToSelectedHexHover = function(key){
	//Highlight targeted hexagon (if hovered by mouse)
	if (canMoveUnits && hexBackgroundSelected === false){		//If there's at least 1 unit in the selected hexagon
		for(var id in hexMoveAvailable){
			if (key === hexMoveAvailable[id] && key === mouseHexColliding && !showSendUnitUI && !showConfirmSpellUI){
				var centerX = hex[key].x - Img.hex.width/2;
				var centerY = hex[key].y - Img.hex.height/2;
				ctx.drawImage(Img.hexTargeted,0,0,Img.hexTargeted.width,Img.hexTargeted.height,centerX,centerY,Img.hexTargeted.width,Img.hexTargeted.height);

				hexBackgroundSelected = true;
			}
		}
	}
}

drawHexAdjacentToSelectedHex = function(key){
	//Draw hexagons which are available for unit to move into.
	if (canMoveUnits && hexBackgroundSelected === false){		//If there's at least 1 unit in the selected hexagon
		for(var id in hexMoveAvailable){
			if (key == hexMoveAvailable[id]){
				var centerX = hex[hexMoveAvailable[id]].x - Img.hex.width/2;
				var centerY = hex[hexMoveAvailable[id]].y - Img.hex.height/2;
				ctx.drawImage(Img.hexAvailable,0,0,Img.hexAvailable.width,Img.hexAvailable.height,centerX,centerY,Img.hexAvailable.width,Img.hexAvailable.height);

				hexBackgroundSelected = true;
			}
		}
	}
}

drawHexPlacingBuildingHover = function(key){
	//Draw background if mouse is hovering over a hexagon where a building can be built
	if (playing && placingBuilding !== -1 && hexBackgroundSelected === false){
		if (key === mouseHexColliding){		//check for collision
			if (hex[mouseHexColliding].owner === player && hex[mouseHexColliding].building === -1){	 //check if it's possible to build here
				var centerX = hex[mouseHexColliding].x - Img.hexTargeted.width/2;
				var centerY = hex[mouseHexColliding].y - Img.hexTargeted.height/2;
				ctx.drawImage(Img.hexTargeted,0,0,Img.hexTargeted.width,Img.hexTargeted.height,centerX,centerY,Img.hexTargeted.width,Img.hexTargeted.height);

				hexBackgroundSelected = true;
			}
		}
	}
}

drawHexPlacingBuildingAvailable = function(key){
	//Draw background if a building can be placed here (when the player wants to build)
	if (playing && placingBuilding !== -1 && hexBackgroundSelected === false){
		if (hex[key].owner === player && hex[key].building === -1){
			var centerX = hex[key].x - Img.hex.width/2;
			var centerY = hex[key].y - Img.hex.height/2;
			ctx.drawImage(Img.hexAvailable,0,0,Img.hexAvailable.width,Img.hexAvailable.height,centerX,centerY,Img.hexAvailable.width,Img.hexAvailable.height);

			hexBackgroundSelected = true;
		}
	}
}

drawHexHover = function(key){
	//Draw mouse hovering over a normal hexagon with no other background (except owner's bachground)
	if (playing && hexBackgroundSelected === false && !showConfirmSpellUI){
  	if (mouseHexColliding === key && hex[mouseHexColliding].owner === player && hexSelected === -1 && placingBuilding === -1){
  		var centerX = hex[mouseHexColliding].x - Img.hexHover.width/2;
  		var centerY = hex[mouseHexColliding].y - Img.hexHover.height/2;
  		ctx.drawImage(Img.hexHover,0,0,Img.hexHover.width,Img.hexHover.height,centerX,centerY,Img.hexHover.width,Img.hexHover.height);

			hexBackgroundSelected = true;
  	}
  }
}

drawOwnerBackground = function(key){
	//Draw standard owner's background
	var image = undefined;
	if (hex[key].owner === 1)
		image = Img.hexOwner1;
	if (hex[key].owner === 2)
		image = Img.hexOwner2;

	if (image !== undefined){
		var centerX = hex[key].x - Img.hex.width/2;
		var centerY = hex[key].y - Img.hex.height/2;
		ctx.drawImage(image,0,0,image.width,image.height,centerX,centerY,image.width,image.height);
	}
}

drawHexElements = function(){
	for(var id in hex){
		//Building
		if (hex[id].building !== -1){
			var xOffset = Img.hex.width/2 * 0;
			var yOffset = Img.hex.height/2 * 0.6;
			var centerX = Math.round(hex[id].x - Img.farm.width/2 - xOffset);
			var centerY = Math.round(hex[id].y - Img.farm.height/2 + yOffset);
			var image = selectImage(hex[id].building);
			ctx.drawImage(image,0,0,image.width,image.height,centerX,centerY,image.width,image.height);
		}

		//Units
		if (hex[id].workers !== 0 || hex[id].workersWaiting !== 0){
			drawEachUnit("worker", 0.5, 0.1, id);
		}
		if (hex[id].soldiers !== 0 || hex[id].soldiersWaiting !== 0){
			drawEachUnit("soldier", 0, -0.2, id);
		}
		if (hex[id].mages !== 0 || hex[id].magesWaiting !== 0){
			drawEachUnit("mage", -0.5, 0.1, id);
		}
	}
}

drawEachUnit = function(type, xOff, yOff, id){
	//Image
	var xOffset = Img.hex.width/2 *xOff;
	var yOffset = Img.hex.height/2 * yOff;
	var centerX = Math.round(hex[id].x - Img[type].width/2 - xOffset);
	var centerY = Math.round(hex[id].y - Img[type].height/2 + yOffset);;
	ctx.drawImage(Img[type],0,0,Img[type].width,Img[type].height,centerX,centerY,Img[type].width,Img[type].height);

	//Text
	ctx.font = "11px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign="center";
	ctx.textBaseline="middle";
	var unitVarName = type + "s";
	var x = centerX + Img[type].width/2;
	var y = centerY + Img[type].width/2;
	ctx.fillText(hex[id][unitVarName], x, y);

	//Waiting units
	unitWaitingVarName = unitVarName + "Waiting";
	if (hex[id][unitWaitingVarName] !== 0){
		ctx.fillText("+" + hex[id][unitWaitingVarName], x-3, y-18);
	}
}

drawUI = function(){
	//Main
	for(var key in ui["main"]){
    //Images
		if (ui["main"][key].name === "building" && buildingOrSpell === "spell"){
			drawSpellBackground(key);
		}
		else {
			ctx.drawImage(ui["main"][key].image, 0, 0, ui["main"][key].image.width, ui["main"][key].image.height, ui["main"][key].x, ui["main"][key].y, ui["main"][key].image.width, ui["main"][key].image.height);
		}
	}

	//Training units
	//Tlačítka pro propouštění jednotek se zobrazí jenom v případě, že je označena země. Tlačítka pro trénování jednotek se objeví jenom v případě, že je v dané zemi postavena stavba pro výcvik.
  if (showUnitUI === true ){
    //Titles
    ctx.font="30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.textBaseline="top";
    ctx.fillText("Train",248,5);
    ctx.fillText("Dismiss",470,5);

    for(var key in ui["trainingUnits"]){
			//Dismiss
			if (ui["trainingUnits"][key].id !== 0){
        //Draw buttons
				ctx.drawImage(ui["trainingUnits"][key].image, 0, 0, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height, ui["trainingUnits"][key].x, ui["trainingUnits"][key].y, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height);
				}
			//Train
			else {
				if (checkIfCanTrain(hexSelected)){
          //Draw buttons
					ctx.drawImage(ui["trainingUnits"][key].image, 0, 0, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height, ui["trainingUnits"][key].x, ui["trainingUnits"][key].y, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height);
        }
			}

			//Draw unit images
			drawUiUnitImage(key, "trainingUnits");
		}

		//Show text if units can't be trained in this hexagon
		if (!checkIfCanTrain(hexSelected)){
			ctx.font="24px Arial";
	    ctx.fillStyle = "black";
	    ctx.textAlign="center";
	    ctx.textBaseline="top";
			ctx.fillText("Cannot train here!",250,50);
		}
	}

	//Sending units
	if (showSendUnitUI){
		//Images
		//Background
		for(var key in ui["sendingUnitsBg"]){
			ctx.drawImage(ui["sendingUnitsBg"][key].image, 0, 0, ui["sendingUnitsBg"][key].image.width, ui["sendingUnitsBg"][key].image.height, ui["sendingUnitsBg"][key].x, ui["sendingUnitsBg"][key].y, ui["sendingUnitsBg"][key].image.width, ui["sendingUnitsBg"][key].image.height);
		}
		//Foreground
		for(var key in ui["sendingUnits"]){
			if ((!attacking) || (attacking && ui["sendingUnits"][key].name !== "writeButton") || (attacking && ui["sendingUnits"][key].name === "writeButton" && ui["sendingUnits"][key].id === 1)){		//Jednoduše řečeno - pokud se útočí, tak se nezobrazuje kolonka pro farmáře a mágy, pouze pro vojáky
				ctx.drawImage(ui["sendingUnits"][key].image, 0, 0, ui["sendingUnits"][key].image.width, ui["sendingUnits"][key].image.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, ui["sendingUnits"][key].image.width, ui["sendingUnits"][key].image.height);

				drawUiUnitImage(key, "sendingUnits");

				//Text (maximum amount of units that can be sent)
				drawSendMaxAmount(key, hexSelected);
			}
		}

		//General text
		ctx.font="34px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		var x = 120+(WIDTH-120) / 2;
		var y = 100+(HEIGHT-100) / 2 - Img.uiSendUnitsBg.height / 2 + 15;		//poslední číslo = odsazení od horního okraje
		ctx.fillText("How many units to send?", x, y);
	}

	//Confirm spell
	if (showConfirmSpellUI){
		//Images
		//Background
		for(var key in ui["confirmSpellBg"]){
			ctx.drawImage(ui["confirmSpellBg"][key].image, 0, 0, ui["confirmSpellBg"][key].image.width, ui["confirmSpellBg"][key].image.height, ui["confirmSpellBg"][key].x, ui["confirmSpellBg"][key].y, ui["confirmSpellBg"][key].image.width, ui["confirmSpellBg"][key].image.height);
		}
		//Foreground
		for(var key in ui["confirmSpell"]){
			ctx.drawImage(ui["confirmSpell"][key].image, 0, 0, ui["confirmSpell"][key].image.width, ui["confirmSpell"][key].image.height, ui["confirmSpell"][key].x, ui["confirmSpell"][key].y, ui["confirmSpell"][key].image.width, ui["confirmSpell"][key].image.height);
		}
	}
}

drawSpellBackground = function(key){
	if (ui["main"][key].id >= 0 && ui["main"][key].id <= 2){
		var image = Img.uiEconomicSpellBg;
	}
	if (ui["main"][key].id >= 3 && ui["main"][key].id <= 5){
		var image = Img.uiDestructiveSpellBg;
	}
	if (ui["main"][key].id >= 6 && ui["main"][key].id <= 8){
		var image = Img.uiSupportiveSpellBg;
	}

	ctx.drawImage(image, 0, 0, image.width, image.height, ui["main"][key].x, ui["main"][key].y, image.width, image.height);
}

drawUiUnitImage = function(key, uiType){
	if (ui[uiType][key].name === "writeButton"){
		var xOffset = -30;
		var yOffset = 0;
		var x = Math.round(ui[uiType][key].x + xOffset);
		var y = Math.round((ui[uiType][key].y + ui[uiType][key].image.height/2 - Img.worker.height/2) + yOffset);

		var image;
		switch (ui[uiType][key].id){
			case 0:
				if (uiType === "trainingUnits")
					image = getTrainingUnitImage(hexSelected);
				else if (uiType === "sendingUnits")
					image = Img.worker;
				break;
			case 1:
				image = Img.soldier;
				break;
			case 2:
				image = Img.mage;
				break;
		}

		if (image !== undefined)			//Zabrání vykreslování neexistujícího obrázku, pokud nelze v dané zemi trénovat jednotky
			ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
		}
}

drawSendMaxAmount = function(key, hexSelected){
	if (ui["sendingUnits"][key].name === "writeButton"){
		ctx.font="19px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign="left";
		ctx.textBaseline="middle";

		var xOffset = 58;
		var yOffset = 0;
		var x = Math.round(ui["sendingUnits"][key].x + xOffset);
		var y = Math.round((ui["sendingUnits"][key].y + ui["sendingUnits"][key].image.height/2) + yOffset);

		var unitType;
		switch (ui["sendingUnits"][key].id){
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

		ctx.fillText("/ " + hex[hexSelected][unitType], x, y);
	}
}

getTrainingUnitImage = function(hexSelected){
	var building = hex[hexSelected].building;
	var image;
	switch(building){
		case 0:
			image = Img.worker;
			break;
		case 1:
			image = Img.soldier;
			break;
		case 2:
			image = Img.mage;
			break;
	}

	return image;
}

drawUIhover = function(){
	//Main
  if (mouseUIcolliding.main !== -1){
    var key = mouseUIcolliding.main;
		if (!showSendUnitUI && !showConfirmSpellUI){
			if (ui["main"][key].name === "building"){
				if (playing){
					//Change colour when hovered
					if (buildingOrSpell === "building"){
						ctx.drawImage(Img.uiBuildingHover, 0, 0, Img.uiBuildingHover.width, Img.uiBuildingHover.height, ui["main"][key].x, ui["main"][key].y, Img.uiBuildingHover.width, Img.uiBuildingHover.height);
					}
					else {
						drawSpellHover(key);
					}
				}
				//Show description (doesn't need to be playing)
				drawBuildingDescription(key);
			}

			if (playing){
				if (ui["main"][key].name === "endTurn")
	        ctx.drawImage(Img.uiEndTurnHover, 0, 0, Img.uiEndTurnHover.width, Img.uiEndTurnHover.height, ui["main"][key].x, ui["main"][key].y, Img.uiEndTurnHover.width, Img.uiEndTurnHover.height);
				}
			if (ui["main"][key].name === "buildingSpellSwitch")
		    ctx.drawImage(Img.uiBuildingSpellSwitchHover, 0, 0, Img.uiBuildingSpellSwitchHover.width, Img.uiBuildingSpellSwitchHover.height, ui["main"][key].x, ui["main"][key].y, Img.uiBuildingSpellSwitchHover.width, Img.uiBuildingSpellSwitchHover.height);
    }
  }

  //Training units
	if (playing){
	  var keyHidden = mouseUIcolliding.trainingUnits;
	  if (keyHidden !== -1 && showUnitUI && !showSendUnitUI && !showConfirmSpellUI){
			if ((ui["trainingUnits"][keyHidden].id !== 0) || (ui["trainingUnits"][keyHidden].id === 0 && checkIfCanTrain(hexSelected))){
				if (ui["trainingUnits"][keyHidden].name === "writeButton")
	        ctx.drawImage(Img.writeButtonHover, 0, 0, Img.writeButtonHover.width, Img.writeButtonHover.height, ui["trainingUnits"][keyHidden].x, ui["trainingUnits"][keyHidden].y, Img.writeButtonHover.width, Img.writeButtonHover.height);
				if (ui["trainingUnits"][keyHidden].name === "sendButton")
					ctx.drawImage(Img.sendButtonHover, 0, 0, Img.sendButtonHover.width, Img.sendButtonHover.height, ui["trainingUnits"][keyHidden].x, ui["trainingUnits"][keyHidden].y, Img.sendButtonHover.width, Img.sendButtonHover.height);
			}
	  }
	}

	//Sending units
	if (playing){
		var key = mouseUIcolliding.sendingUnits;
		if (key !== -1 && showSendUnitUI){
			if (ui["sendingUnits"][key].name === "writeButton"){
				if ((!attacking) || (attacking && ui["sendingUnits"][key].id === 1)){		//Pokud se útočí, tak se nezobrazuje kolonka pro farmáře a mágy, pouze pro vojáky
					ctx.drawImage(Img.writeButtonHover, 0, 0, Img.writeButtonHover.width, Img.writeButtonHover.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, Img.writeButtonHover.width, Img.writeButtonHover.height);
				}
			}

			if (ui["sendingUnits"][key].name === "sendButton" || ui["sendingUnits"][key].name === "cancelButton"){
				ctx.drawImage(Img.uiSendUnitsButtonHover, 0, 0, Img.uiSendUnitsButtonHover.width, Img.uiSendUnitsButtonHover.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, Img.uiSendUnitsButtonHover.width, Img.uiSendUnitsButtonHover.height);
			}
		}
	}

	//Confirm spell
	if (playing){
		var key = mouseUIcolliding.confirmSpell;
		if (key !== -1 && showConfirmSpellUI){
			ctx.drawImage(Img.uiConfirmCastingSpellButtonHover, 0, 0, Img.uiConfirmCastingSpellButtonHover.width, Img.uiConfirmCastingSpellButtonHover.height, ui["confirmSpell"][key].x, ui["confirmSpell"][key].y, Img.uiConfirmCastingSpellButtonHover.width, Img.uiConfirmCastingSpellButtonHover.height);
		}
	}
}

drawSpellHover = function(key){
	if (ui["main"][key].id >= 0 && ui["main"][key].id <= 2){
		var image = Img.uiEconomicSpellHover;
	}
	if (ui["main"][key].id >= 3 && ui["main"][key].id <= 5){
		var image = Img.uiDestructiveSpellHover;
	}
	if (ui["main"][key].id >= 6 && ui["main"][key].id <= 8){
		var image = Img.uiSupportiveSpellHover;
	}

	ctx.drawImage(image, 0, 0, image.width, image.height, ui["main"][key].x, ui["main"][key].y, image.width, image.height);
}

drawBuildingDescription = function(key){
	//Choose text
	var description = chooseDescriptionText(ui["main"][key].id);

	//Modify font
	ctx.font = "18px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign="left";
	ctx.textBaseline="top";

	//Set position
	var spaceFromEdge = 15;		//Jak blízko může být text okraji canvasu
	var spaceFromUI = 15;			//Jak blízko bude text UI tlačítkům

	var x = ui["main"][key].x + spaceFromUI + ui["main"][key].image.width;
	var y = ui["main"][key].y - ui["main"][key].image.height;
	if (y + spaceFromEdge + Img.uiBuildingDescription.height > HEIGHT){
		y = HEIGHT - spaceFromEdge - Img.uiBuildingDescription.height;
	}

	ctx.drawImage(Img.uiBuildingDescription, 0, 0, Img.uiBuildingDescription.width, Img.uiBuildingDescription.height, x, y, Img.uiBuildingDescription.width, Img.uiBuildingDescription.height);
	for(var i in description.row){
		var textX = x + 10;
		var textY = y + 10 + i*30;
		ctx.fillText(description.row[i], textX, textY);
	}
}

chooseDescriptionText = function(id){
	var description = {};
	description.row = [];

	//Buildings
	if (buildingOrSpell === "building"){
		switch(id){
			case 0:
				description.row.push("Farm");
				description.row.push("Price: " + balance.farmCost + " gold");
				description.row.push("Allows you to train farmers. Farmers cost");
				description.row.push(balance.workerCost + " gold and increase your gold income");
				description.row.push("by " + balance.workerIncome + ".");
				break;
			case 1:
				description.row.push("Barracks");
				description.row.push("Price: " + balance.barracksCost + " gold");
				description.row.push("Allows you to train soldiers. Soldiers cost");
				description.row.push(balance.soldierCost + " gold and decrease your gold income");
				description.row.push("by " + balance.soldierFee + ". They can attack and defend.");
				break;
			case 2:
				description.row.push("School of magic");
				description.row.push("Price: " + balance.schoolOfMagicCost + " gold");
				description.row.push("Allows you to train mages. Mages cost");
				description.row.push(balance.mageCost + " gold. They decrease your gold income");
				description.row.push("by " + balance.mageFee + " and increase your mana income by 1.");
				break;
			case 3:
				description.row.push("Mill");
				description.row.push("Price: " + balance.millCost + " gold");
				description.row.push("Increases your gold income by " + balance.millIncome + ".");
				break;
			case 4:
				description.row.push("Well");
				description.row.push("Price: " + balance.wellCost + " gold");
				description.row.push("Increases your mana income by " + balance.wellIncome + ".");
				break;
			case 5:
				description.row.push("Temple");
				description.row.push("Price: " + balance.templeCost + " gold");
				description.row.push("Doubles the mana income from mages in");
				description.row.push("this hexagon.");
				break;
			case 6:
				description.row.push("Yellow crystal");
				description.row.push("Price: " + balance.yellowCrystalCost + " gold");
				description.row.push("Allows you to cast yellow (economic)");
				description.row.push("spells.");
				break;
			case 7:
				description.row.push("Red crystal");
				description.row.push("Price: " + balance.redCrystalCost + " gold");
				description.row.push("Allows you to cast red (destructive) spells.");
				break;
			case 8:
				description.row.push("Blue crystal");
				description.row.push("Price: " + balance.blueCrystalCost + " gold");
				description.row.push("Allows you to cast blue (supportive) spells.");
				break;
		}
	}
	//Spells
	else {
		switch(id){
			case 0:
				description.row.push("Happiness");
				description.row.push("Price: " + balance.happinessCost + " mana");
				description.row.push("Increases your gold income by " + balance.happinessMultiplier*100 + " % this");
				description.row.push("turn. Casting this spell multiple times does");
				description.row.push("not stack.");
				break;
			case 1:
				description.row.push("Greed");
				description.row.push("Price: " + balance.greedCost + " mana");
				description.row.push("The enemy pays " + balance.greedMultiplier + " times higher fee for");
				description.row.push("their units. Casting this spell multiple");
				description.row.push("times does not stack.");
				break;
			case 2:
				description.row.push("Efficiency");
				description.row.push("Price: " + balance.efficiencyCost + " mana");
				description.row.push("The next building you build costs " + balance.efficiencySale*100 + " %");
				description.row.push("less.");
				break;
			case 3:
				description.row.push("Black magic");
				description.row.push("Price: " + balance.blackMagicCost + " mana");
				description.row.push("Kills " + balance.blackMagicKills*100 + " % of mages in a selected hexagon.");
				break;
			case 4:
				description.row.push("Poisonous plants");
				description.row.push("Price: " + balance.poisonousPlantsCost + " mana");
				description.row.push("Kills " + balance.poisonousPlantsKillsMain*100 + " % of farmers in a selected");
				description.row.push("hexagon and " + balance.poisonousPlantsKillsAdjacent*100 + " % of farmers in all");
				description.row.push("adjacent hexagons.");
				break;
			case 5:
				description.row.push("Armageddon");
				description.row.push("Price: " + balance.armageddonCost + " mana");
				description.row.push("Kills " + balance.armageddonKills*100 + " % of ALL units.");
				break;
			case 6:
				description.row.push("Energy boost");
				description.row.push("Price: " + balance.energyBoostCost + " mana");
				description.row.push("All units in a selected hexagon can move");
				description.row.push("and attack. If they already moved or");
				description.row.push("attacked, they can do it again.");
				break;
			case 7:
				description.row.push("Magic wind");
				description.row.push("Price: " + balance.magicWindCost + " mana");
				description.row.push("Moves all units from a selected hexagon to");
				description.row.push("an adjacent hexagon of that player. Units");
				description.row.push("are not exhausted by moving this way.");
				break;
			case 8:
				description.row.push("Recycling");
				description.row.push("Price: " + balance.recyclingCost + " mana");
				description.row.push("Destroys your own building. Refunds the");
				description.row.push("original cost of the building.");
				break;
		}
	}

	return description;
}

drawUItopLayer = function(){
	//Main
	for(var key in ui["main"]){
    //Draw images of buildings or names of spells
		if (ui["main"][key].name === "building"){
			//Buildings
			if (buildingOrSpell === "building"){
				var image = selectUiImage(key);

				if (image !== undefined){
					var xOffset = 10;		//O kolik bude obrázek posunut doleva od pravého okraje
					var x = ui["main"][key].x + ui["main"][key].image.width - image.width - xOffset;
					var y = ui["main"][key].y + ui["main"][key].image.height/2 - image.height/2;

					ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
				}
			}
			//Spells
			else {
				ctx.font = "14px Arial";
				ctx.fillStyle = "black";
				ctx.textAlign="right";
				ctx.textBaseline="middle";

				var xFromEdge = 7;
				var x = ui["main"][key].x + ui["main"][key].image.width - xFromEdge;
				var y = ui["main"][key].y + ui["main"][key].image.height / 2;

				var name = getSpellName(ui["main"][key].id);
				ctx.fillText(name, x, y);
			}
		}

		//Draw info
		if (ui["main"][key].name === "info"){
			//Draw info images
			var x = 10;
			var y = 5;
			ctx.drawImage(Img.uiGoldIcon, 0, 0, Img.uiGoldIcon.width, Img.uiGoldIcon.height, x, y, Img.uiGoldIcon.width, Img.uiGoldIcon.height);

			var x = 10;
			var y = 55;
			ctx.drawImage(Img.uiManaIcon, 0, 0, Img.uiManaIcon.width, Img.uiManaIcon.height, x, y, Img.uiManaIcon.width, Img.uiManaIcon.height);

			//Draw info text
			ctx.font = "18px Arial";
			ctx.fillStyle = "black";
			ctx.textAlign="left";
			ctx.textBaseline="top";

			var x = 45;
			var y = 9;
			ctx.fillText(goldAmount, x, y);

			var x = 45;
			var y = 59;
			ctx.fillText(manaAmount, x, y);

			ctx.font = "14px Arial";
			var x = 45;
			var y = 26;
			var goldText;
			if (goldIncome >= 0){
				goldText = " + ";
			}
			else {
				goldText = " - ";
			}
			ctx.fillText(goldText + Math.abs(goldIncome), x, y);

			var x = 45;
			var y = 76;
			ctx.fillText(" + " + manaIncome, x, y);
		}

    //End turn text
    if (ui["main"][key].name === "endTurn"){
      ctx.font = "32px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      var x = ui["main"][key].x + (ui["main"][key].image.width / 2);
      var y = ui["main"][key].y + (ui["main"][key].image.height / 2);
      var text1;
      var text2 = "turn"
      if (playing) text1 = "End";
      if (!playing) text1 = "Enemy"
      ctx.fillText(text1,x,y-18);
      ctx.fillText(text2,x,y+18);
    }

		//Building / spell switch
    if (ui["main"][key].name === "buildingSpellSwitch"){
			//Text
      ctx.font = "40px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      var x = ui["main"][key].x + (ui["main"][key].image.width / 2);
      var y = ui["main"][key].y + (ui["main"][key].image.height / 2);

			var text;
			switch(ui["main"][key].id){
				case 0:
					text = "S";
					break;
				case 1:
					text = "B";
					break;
			}
      ctx.fillText(text, x, y);

			//Image
			var i;
			switch(buildingOrSpell){
				case "building":
					i = 1;
					break;
				case "spell":
					i = 0;
					break;
			}
			if (ui["main"][key].id === 0){		//Zajistí, aby se vykreslovalo pouze jednou
				var x = ui["main"][key].x + ui["main"][key].image.width*i;
				var y = ui["main"][key].y;
				ctx.drawImage(Img.uiBuildingSpellSwitchSelected, 0, 0, Img.uiBuildingSpellSwitchSelected.width, Img.uiBuildingSpellSwitchSelected.height, x, y, Img.uiBuildingSpellSwitchSelected.width, Img.uiBuildingSpellSwitchSelected.height);
			}
		}
	}

  //Training units
  if (showUnitUI){
    for(var key in ui["trainingUnits"]){
			if (ui["trainingUnits"][key].name === "writeButton" && ui["trainingUnits"][key].id === trainButtonSelected){
				ctx.drawImage(Img.writeButtonType, 0, 0, Img.writeButtonType.width, Img.writeButtonType.height, ui["trainingUnits"][key].x, ui["trainingUnits"][key].y, Img.writeButtonType.width, Img.writeButtonType.height);
			}

			//Draw train / dismiss amount
      drawTrainButtonsText(key);

			//Draw max amount of units to train / dismiss
			drawTrainMaxAmount(key);
    }
  }

	//Sending units
	if (showSendUnitUI){
		for(var key in ui["sendingUnits"]){
			if (ui["sendingUnits"][key].name === "writeButton" && ui["sendingUnits"][key].id === sendButtonSelected){			//Tady se nemusím už starat o to, jestli se útočí nebo ne, protože o to jsem se už postaral v inputu. Nevhodná pole při útočení nejsou označena.
				ctx.drawImage(Img.writeButtonType, 0, 0, Img.writeButtonType.width, Img.writeButtonType.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, Img.writeButtonType.width, Img.writeButtonType.height);
			}

			if ((!attacking) || (attacking && ui["sendingUnits"][key].name !== "writeButton") || (attacking && ui["sendingUnits"][key].name === "writeButton" && ui["sendingUnits"][key].id === 1)){		//Jednoduše řečeno - pokud se útočí, tak se nezobrazuje kolonka pro farmáře a mágy, pouze pro vojáky
				drawSendButtonsText(key);
			}
		}
	}

	//Confirm spell
	if (showConfirmSpellUI){
		//Background
		ctx.font = "34px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign="center";
		ctx.textBaseline="top";

		var spellName;
		switch(castingSpell){
			case 0:
				spellName = "Happiness";
		}
		var x = 120+(WIDTH-120) / 2;
		var y = 100+(HEIGHT-100) / 2 - Img.uiSendUnitsBg.height / 2 + 15;		//poslední číslo = odsazení od horního okraje
		ctx.fillText("Are you sure you want to", x, y);
		ctx.fillText("cast " + spellName + "?", x, y+38);

		//Buttons
		for(var key in ui["confirmSpell"]){
			var text;
			if (ui["confirmSpell"][key].name === "noButton"){
				text = "No";
			}
			else if (ui["confirmSpell"][key].name === "yesButton"){
				text = "Yes";
			}

			ctx.font = "22px Arial";
			ctx.fillStyle = "black";
			ctx.textAlign="center";
			ctx.textBaseline="middle";
			var x = ui["confirmSpell"][key].x + ui["confirmSpell"][key].image.width / 2;
			var y = ui["confirmSpell"][key].y + ui["confirmSpell"][key].image.height / 2;
			ctx.fillText(text, x, y);
		}
	}
}

getSpellName = function(id){
	var name;
	switch(id){
		case 0:
			name = "Happiness";
			break;
		case 1:
			name = "Greed";
			break;
		case 2:
			name = "Efficiency";
			break;
		case 3:
			name = "Black magic";
			break;
		case 4:
			name = "Poisonous plants";
			break;
		case 5:
			name = "Armageddon";
			break;
		case 6:
			name = "Energy boost";
			break;
		case 7:
			name = "Magic wind";
			break;
		case 8:
			name = "Recycling";
			break;
	}

	return name;
}

drawTrainButtonsText = function(key){
	if ((ui["trainingUnits"][key].id === 0 && checkIfCanTrain(hexSelected)) || ui["trainingUnits"][key].id !== 0){
		if (ui["trainingUnits"][key].name === "sendButton"){
	    ctx.font = "18px Arial";
	    ctx.fillStyle = "black";
	    ctx.textAlign="center";
	    ctx.textBaseline="middle";
	    var x = ui["trainingUnits"][key].x + (ui["trainingUnits"][key].image.width / 2);
	    var y = ui["trainingUnits"][key].y + (ui["trainingUnits"][key].image.height / 2);
	    ctx.fillText("OK",x,y);
	  }

	  if (ui["trainingUnits"][key].name === "writeButton"){
			if (ui["trainingUnits"][key].id !== trainButtonSelected || trainValue[ui["trainingUnits"][key].id] !== 0){
				ctx.font = "18px Arial";
		    ctx.fillStyle = "black";
		    ctx.textAlign="center";
		    ctx.textBaseline="middle";
		    var x = ui["trainingUnits"][key].x + (ui["trainingUnits"][key].image.width / 2);
		    var y = ui["trainingUnits"][key].y + (ui["trainingUnits"][key].image.height / 2);
		    var value = trainValue[ui["trainingUnits"][key].id];
		    ctx.fillText(value,x,y);
			}
	  }
	}
}

drawTrainMaxAmount = function(key){
	if (ui["trainingUnits"][key].name === "writeButton"){
		//Get max amount
		var maxAmount;
		switch(ui["trainingUnits"][key].id){
			case 0:
				//Zjistit, o jakou jednotku se jedná
				var cost;
				switch(hex[hexSelected].building){
					case 0:
						cost = balance.workerCost;
						break;
					case 1:
						cost = balance.soldierCost;
						break;
					case 2:
						cost = balance.mageCost;
						break;
				}
				if (cost !== undefined){
					maxAmount = Math.floor(goldAmount / cost);
				}
				break;

			case 1:
				maxAmount = hex[hexSelected].soldiers;
				break;

			case 2:
				maxAmount = hex[hexSelected].mages;
				break;
		}

		//Draw the text
		ctx.font="16px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign="left";
		ctx.textBaseline="middle";

		var xOffset = 55;
		var yOffset = 0;
		var x = Math.round(ui["trainingUnits"][key].x + xOffset);
		var y = Math.round((ui["trainingUnits"][key].y + ui["trainingUnits"][key].image.height/2) + yOffset);
		if (maxAmount !== undefined){		//Zabrání zobrazování textu NaN, pokud v zemi nelze trénovat jednotky
			ctx.fillText("/ " + maxAmount, x, y);
		}
	}
}

drawSendButtonsText = function(key){
	//Draw text - cancel button and send button
	ctx.font = "20px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign="center";
	ctx.textBaseline="middle";
	if (ui["sendingUnits"][key].name === "cancelButton"){
		var x = ui["sendingUnits"][key].x + (ui["sendingUnits"][key].image.width / 2);
		var y = ui["sendingUnits"][key].y + (ui["sendingUnits"][key].image.height / 2);
		ctx.fillText("Cancel",x,y);
	}

	if (ui["sendingUnits"][key].name === "sendButton"){
		var x = ui["sendingUnits"][key].x + (ui["sendingUnits"][key].image.width / 2);
		var y = ui["sendingUnits"][key].y + (ui["sendingUnits"][key].image.height / 2);
		ctx.fillText("Send",x,y);
	}

	//Draw values
	 if (ui["sendingUnits"][key].name === "writeButton"){
		if (ui["sendingUnits"][key].id !== sendButtonSelected || sendValue[ui["sendingUnits"][key].id] !== 0){
			ctx.font = "18px Arial";
		  ctx.fillStyle = "black";
		  ctx.textAlign="center";
		  ctx.textBaseline="middle";
		  var x = ui["sendingUnits"][key].x + (ui["sendingUnits"][key].image.width / 2);
		  var y = ui["sendingUnits"][key].y + (ui["sendingUnits"][key].image.height / 2);
		  var value = sendValue[ui["sendingUnits"][key].id];
		 	ctx.fillText(value,x,y);
	  }
	}
}

//Supporting functions
selectUiImage = function(key){
	var image;
	switch(ui["main"][key].id){
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
	switch(key){
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

checkIfCanTrain = function(hexSelected){
	if ((hex[hexSelected].building >= 0) && (hex[hexSelected].building <= 2))
		return true;
	else
		return false;
}
