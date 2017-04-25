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
	//Moving units

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
	hexMoveAvailable = findAdjacentHexagons(hexSelected);
	for(var id in hexMoveAvailable){
		var centerX = hex[hexMoveAvailable[id]].x - Img.hex.width/2;
		var centerY = hex[hexMoveAvailable[id]].y - Img.hex.height/2;
		ctx.drawImage(Img.hexAvailable,0,0,Img.hexAvailable.width,Img.hexAvailable.height,centerX,centerY,Img.hexAvailable.width,Img.hexAvailable.height);

		//Highlight targeted hexagon (if targeted)
		if (hexMoveAvailable[id] === mouseHexColliding){
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
	for(var key in ui){
    //Images
		ctx.drawImage(ui[key].image, 0, 0, ui[key].image.width, ui[key].image.height, ui[key].x, ui[key].y, ui[key].image.width, ui[key].image.height);
	}

	//Tlačítka pro propouštění jednotek se zobrazí jenom v případě, že je označena země. Tlačítka pro trénování jednotek se objeví jenom v případě, že je v dané zemi postavena stavba pro výcvik.
  if (showUnitUI === true ){
    //Titles
    ctx.font="30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign="center";
    ctx.textBaseline="top";
    ctx.fillText("Train",248,5);
    ctx.fillText("Dismiss",470,5);

    for(var key in uiHidden){
			//Dismiss
			if (uiHidden[key].id !== 0){
        //Draw images
				ctx.drawImage(uiHidden[key].image, 0, 0, uiHidden[key].image.width, uiHidden[key].image.height, uiHidden[key].x, uiHidden[key].y, uiHidden[key].image.width, uiHidden[key].image.height);
      }
			//Train
			else {
				if (checkIfCanTrain(hexSelected)){
          //Draw images
					ctx.drawImage(uiHidden[key].image, 0, 0, uiHidden[key].image.width, uiHidden[key].image.height, uiHidden[key].x, uiHidden[key].y, uiHidden[key].image.width, uiHidden[key].image.height);
        }
			}
		}

		//Show text if units can't be trained in this land
		if (!checkIfCanTrain(hexSelected)){
			ctx.font="24px Arial";
	    ctx.fillStyle = "black";
	    ctx.textAlign="center";
	    ctx.textBaseline="top";
			ctx.fillText("Cannot train here!",250,50);
		}
	}
}

drawTrainButtonsText = function(key){
	if ((uiHidden[key].id === 0 && checkIfCanTrain(hexSelected)) || uiHidden[key].id !== 0){
		if (uiHidden[key].name === "sendButton"){
	    ctx.font = "18px Arial";
	    ctx.fillStyle = "black";
	    ctx.textAlign="center";
	    ctx.textBaseline="middle";
	    var x = uiHidden[key].x + (uiHidden[key].image.width / 2);
	    var y = uiHidden[key].y + (uiHidden[key].image.height / 2);
	    ctx.fillText("OK",x,y);
	  }

	  if (uiHidden[key].name === "writeButton"){
			if (uiHidden[key].id !== trainButtonSelected || trainValue[uiHidden[key].id] !== 0){
				ctx.font = "18px Arial";
		    ctx.fillStyle = "black";
		    ctx.textAlign="center";
		    ctx.textBaseline="middle";
		    var x = uiHidden[key].x + (uiHidden[key].image.width / 2);
		    var y = uiHidden[key].y + (uiHidden[key].image.height / 2);
		    var value = trainValue[uiHidden[key].id];
		    ctx.fillText(value,x,y);
			}
	  }
	}
}

drawUIhover = function(){
  if (playing){
    if (mouseUIcolliding !== -1){
      var key = mouseUIcolliding;
      if (ui[key].name === "building")
        ctx.drawImage(Img.uiBuildingHover, 0, 0, Img.uiBuildingHover.width, Img.uiBuildingHover.height, ui[key].x, ui[key].y, Img.uiBuildingHover.width, Img.uiBuildingHover.height);
      if (ui[key].name === "endTurn")
        ctx.drawImage(Img.uiEndTurnHover, 0, 0, Img.uiEndTurnHover.width, Img.uiEndTurnHover.height, ui[key].x, ui[key].y, Img.uiEndTurnHover.width, Img.uiEndTurnHover.height);
    }

    //Hidden
    var keyHidden = mouseHiddenUIcolliding;
    if (keyHidden !== -1 && showUnitUI){
      if (uiHidden[keyHidden].name === "writeButton")
        ctx.drawImage(Img.writeButtonHover, 0, 0, Img.writeButtonHover.width, Img.writeButtonHover.height, uiHidden[keyHidden].x, uiHidden[keyHidden].y, Img.writeButtonHover.width, Img.writeButtonHover.height);
				if (uiHidden[keyHidden].name === "sendButton")
					ctx.drawImage(Img.sendButtonHover, 0, 0, Img.sendButtonHover.width, Img.sendButtonHover.height, uiHidden[keyHidden].x, uiHidden[keyHidden].y, Img.sendButtonHover.width, Img.sendButtonHover.height);
    }
  }
}

drawUItopLayer = function(){
	for(var key in ui){
    //Draw images of buildings
		if (ui[key].name === "building"){
			var image = selectUiImage(key);

			if (image !== undefined){
				var xOffset = 10;		//O kolik bude obrázek posunut doleva od pravého okraje
				var x = ui[key].x + ui[key].image.width - image.width - xOffset;
				var y = ui[key].y + ui[key].image.height/2 - image.height/2;

				ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
			}
		}

    //End turn text
    if (ui[key].name === "endTurn"){
      ctx.font = "32px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      var x = ui[key].x + (ui[key].image.width / 2);
      var y = ui[key].y + (ui[key].image.height / 2);
      var text1;
      var text2 = "turn"
      if (playing) text1 = "End";
      if (!playing) text1 = "Enemy"
      ctx.fillText(text1,x,y-18);
      ctx.fillText(text2,x,y+18);
    }
	}

  //Hidden
  if(showUnitUI){
    for(var key in uiHidden){
			if (uiHidden[key].name === "writeButton" && uiHidden[key].id === trainButtonSelected){
				ctx.drawImage(Img.writeButtonType, 0, 0, Img.writeButtonType.width, Img.writeButtonType.height, uiHidden[key].x, uiHidden[key].y, Img.writeButtonType.width, Img.writeButtonType.height);
			}

      drawTrainButtonsText(key);
    }
  }
}
