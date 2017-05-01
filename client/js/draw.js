//Draw functions
drawGame = function(){
	ctx.fillStyle = "green";
	ctx.fillRect(0,0,WIDTH,HEIGHT);

	drawHexagons();

	drawHexHover();

	drawHexAvailable();

	drawTargetHex();

	drawHexSelected();

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

drawHexHover = function(hexId){
  if (playing){
    var hexId = mouseHexColliding;
  	if (hexId !== -1 && hexSelected === -1 && placingBuilding === -1){
  		var centerX = hex[hexId].x - Img.hexHover.width/2;
  		var centerY = hex[hexId].y - Img.hexHover.height/2;
  		ctx.drawImage(Img.hexHover,0,0,Img.hexHover.width,Img.hexHover.height,centerX,centerY,Img.hexHover.width,Img.hexHover.height);
  	}
  }
}

drawHexAvailable = function(){
	//Draw which hexagons are available when placing buildings
	if (placingBuilding !== -1){
		for(var id in hex){
			if (hex[id].building === -1){
				var centerX = hex[id].x - Img.hex.width/2;
				var centerY = hex[id].y - Img.hex.height/2;
				ctx.drawImage(Img.hexAvailable,0,0,Img.hexAvailable.width,Img.hexAvailable.height,centerX,centerY,Img.hexAvailable.width,Img.hexAvailable.height);
			}
		}
	}
}

drawTargetHex = function(){
	//Placing buildings
	if (placingBuilding !== -1){
		var hexId = mouseHexColliding;
		if (hexId !== -1){
			if (hex[hexId].building === -1){
				var centerX = hex[hexId].x - Img.hexTargeted.width/2;
				var centerY = hex[hexId].y - Img.hexTargeted.height/2;
				ctx.drawImage(Img.hexTargeted,0,0,Img.hexTargeted.width,Img.hexTargeted.height,centerX,centerY,Img.hexTargeted.width,Img.hexTargeted.height);
			}
		}
	}
}

drawHexSelected = function(){
	if (hexSelected !== -1){
		for(var id in hex){
			if (id == hexSelected){
				var centerX = hex[id].x - Img.hex.width/2;
				var centerY = hex[id].y - Img.hex.height/2;
				ctx.drawImage(Img.hexSelected,0,0,Img.hexSelected.width,Img.hexSelected.height,centerX,centerY,Img.hexSelected.width,Img.hexSelected.height);
			}
		}
		drawAdjacentHexagons(hexSelected);
	}
}

drawAdjacentHexagons = function(hexSelected){
	//Draw available hexagons
	if (canMoveUnits){		//If there's at least 1 unit in the selected hexagon
		for(var id in hexMoveAvailable){
			var centerX = hex[hexMoveAvailable[id]].x - Img.hex.width/2;
			var centerY = hex[hexMoveAvailable[id]].y - Img.hex.height/2;
			ctx.drawImage(Img.hexAvailable,0,0,Img.hexAvailable.width,Img.hexAvailable.height,centerX,centerY,Img.hexAvailable.width,Img.hexAvailable.height);

			//Highlight targeted hexagon (if hovered by mouse)
			if (hexMoveAvailable[id] === mouseHexColliding && !showSendUnitUI){
				ctx.drawImage(Img.hexTargeted,0,0,Img.hexTargeted.width,Img.hexTargeted.height,centerX,centerY,Img.hexTargeted.width,Img.hexTargeted.height);
			}
		}

		//Highlight hexagon (if sending units)
		if (showSendUnitUI){
			var centerX = hex[moveUnitsToHex].x - Img.hex.width/2;
			var centerY = hex[moveUnitsToHex].y - Img.hex.height/2;
			ctx.drawImage(Img.hexTargeted,0,0,Img.hexTargeted.width,Img.hexTargeted.height,centerX,centerY,Img.hexTargeted.width,Img.hexTargeted.height);
		}
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
		if (hex[id].workers !== 0){
			drawEachUnit("worker", 0.5, 0.1, id);
		}
		if (hex[id].soldiers !== 0){
			drawEachUnit("soldier", 0, -0.2, id);
		}
		if (hex[id].mages !== 0){
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
}

drawUI = function(){
	//Main
	for(var key in ui["main"]){
    //Images
		ctx.drawImage(ui["main"][key].image, 0, 0, ui["main"][key].image.width, ui["main"][key].image.height, ui["main"][key].x, ui["main"][key].y, ui["main"][key].image.width, ui["main"][key].image.height);
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
        //Draw images
				ctx.drawImage(ui["trainingUnits"][key].image, 0, 0, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height, ui["trainingUnits"][key].x, ui["trainingUnits"][key].y, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height);
      }
			//Train
			else {
				if (checkIfCanTrain(hexSelected)){
          //Draw images
					ctx.drawImage(ui["trainingUnits"][key].image, 0, 0, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height, ui["trainingUnits"][key].x, ui["trainingUnits"][key].y, ui["trainingUnits"][key].image.width, ui["trainingUnits"][key].image.height);
        }
			}
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
			ctx.drawImage(ui["sendingUnits"][key].image, 0, 0, ui["sendingUnits"][key].image.width, ui["sendingUnits"][key].image.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, ui["sendingUnits"][key].image.width, ui["sendingUnits"][key].image.height);
		}

		//Text
		ctx.font="34px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign="center";
		ctx.textBaseline="top";
		var x = 120+(WIDTH-120) / 2;
		var y = 100+(HEIGHT-100) / 2 - Img.uiSendUnitsBg.height / 2 + 15;		//poslední číslo = odsazení od horního okraje
		ctx.fillText("How many units to send?", x, y);
	}
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

drawUIhover = function(){
  if (playing){
		//Main
    if (mouseUIcolliding.main !== -1){
      var key = mouseUIcolliding.main;
			if (!showSendUnitUI){
				if (ui["main"][key].name === "building")
	        ctx.drawImage(Img.uiBuildingHover, 0, 0, Img.uiBuildingHover.width, Img.uiBuildingHover.height, ui["main"][key].x, ui["main"][key].y, Img.uiBuildingHover.width, Img.uiBuildingHover.height);
	      if (ui["main"][key].name === "endTurn")
	        ctx.drawImage(Img.uiEndTurnHover, 0, 0, Img.uiEndTurnHover.width, Img.uiEndTurnHover.height, ui["main"][key].x, ui["main"][key].y, Img.uiEndTurnHover.width, Img.uiEndTurnHover.height);
				}
      }

    //Training units
    var keyHidden = mouseUIcolliding.trainingUnits;
    if (keyHidden !== -1 && showUnitUI && !showSendUnitUI){
			if ((ui["trainingUnits"][keyHidden].id !== 0) || (ui["trainingUnits"][keyHidden].id === 0 && checkIfCanTrain(hexSelected))){
				if (ui["trainingUnits"][keyHidden].name === "writeButton")
	        ctx.drawImage(Img.writeButtonHover, 0, 0, Img.writeButtonHover.width, Img.writeButtonHover.height, ui["trainingUnits"][keyHidden].x, ui["trainingUnits"][keyHidden].y, Img.writeButtonHover.width, Img.writeButtonHover.height);
				if (ui["trainingUnits"][keyHidden].name === "sendButton")
					ctx.drawImage(Img.sendButtonHover, 0, 0, Img.sendButtonHover.width, Img.sendButtonHover.height, ui["trainingUnits"][keyHidden].x, ui["trainingUnits"][keyHidden].y, Img.sendButtonHover.width, Img.sendButtonHover.height);
			}
    }

		//Sending units
		var key = mouseUIcolliding.sendingUnits;
		if (key !== -1 && showSendUnitUI){
			if (ui["sendingUnits"][key].name === "writeButton")
				ctx.drawImage(Img.writeButtonHover, 0, 0, Img.writeButtonHover.width, Img.writeButtonHover.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, Img.writeButtonHover.width, Img.writeButtonHover.height);
			if (ui["sendingUnits"][key].name === "sendButton" || ui["sendingUnits"][key].name === "cancelButton")
				ctx.drawImage(Img.uiSendUnitsButtonHover, 0, 0, Img.uiSendUnitsButtonHover.width, Img.uiSendUnitsButtonHover.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, Img.uiSendUnitsButtonHover.width, Img.uiSendUnitsButtonHover.height);
		}
  }
}

drawUItopLayer = function(){
	//Main
	for(var key in ui["main"]){
    //Draw images of buildings
		if (ui["main"][key].name === "building"){
			var image = selectUiImage(key);

			if (image !== undefined){
				var xOffset = 10;		//O kolik bude obrázek posunut doleva od pravého okraje
				var x = ui["main"][key].x + ui["main"][key].image.width - image.width - xOffset;
				var y = ui["main"][key].y + ui["main"][key].image.height/2 - image.height/2;

				ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
			}
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
	}

  //Training units
  if (showUnitUI){
    for(var key in ui["trainingUnits"]){
			if (ui["trainingUnits"][key].name === "writeButton" && ui["trainingUnits"][key].id === trainButtonSelected){
				ctx.drawImage(Img.writeButtonType, 0, 0, Img.writeButtonType.width, Img.writeButtonType.height, ui["trainingUnits"][key].x, ui["trainingUnits"][key].y, Img.writeButtonType.width, Img.writeButtonType.height);
			}

      drawTrainButtonsText(key);
    }
  }

	//Sending units
	if (showSendUnitUI){
		for(var key in ui["sendingUnits"]){
			if (ui["sendingUnits"][key].name === "writeButton" && ui["sendingUnits"][key].id === sendButtonSelected){
				ctx.drawImage(Img.writeButtonType, 0, 0, Img.writeButtonType.width, Img.writeButtonType.height, ui["sendingUnits"][key].x, ui["sendingUnits"][key].y, Img.writeButtonType.width, Img.writeButtonType.height);
			}

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
	switch(ui["main"][key].id){
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
