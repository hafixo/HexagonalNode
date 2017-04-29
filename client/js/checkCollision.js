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
	//checkEachUIcollision(uiTypeName, mouseX, mouseY)
	checkEachUIcollision("main", mouseX, mouseY);
	checkEachUIcollision("trainingUnits", mouseX, mouseY);
	checkEachUIcollision("sendingUnitsBg", mouseX, mouseY);
	checkEachUIcollision("sendingUnits", mouseX, mouseY);
	/*
	mouseUIcolliding = -1;		//Tato hodnota se změní, pokud bude colliding
	for(var key in ui["main"]){
		if (mouseX >= ui["main"][key].x &&
			mouseX <= ui["main"][key].x + ui["main"][key].image.width &&
			mouseY >= ui["main"][key].y &&
			mouseY <= ui["main"][key].y + ui["main"][key].image.height){
				mouseUIcolliding = key;
		}
	}

  //Hidden UI
  mouseHiddenUIcolliding = -1;		//Tato hodnota se změní, pokud bude colliding
  if (showUnitUI){
    for(var key in ui["trainingUnits"]){
  		if (mouseX >= ui["trainingUnits"][key].x &&
  			mouseX <= ui["trainingUnits"][key].x + ui["trainingUnits"][key].image.width &&
  			mouseY >= ui["trainingUnits"][key].y &&
  			mouseY <= ui["trainingUnits"][key].y + ui["trainingUnits"][key].image.height){
  				mouseHiddenUIcolliding = key;
  		}
  	}
  }

	//Sending units
	if (showSendUnitUI){
		for(var key in ui["sendingUnitsBg"]){
  		if (mouseX >= ui["sendingUnitsBg"][key].x &&
  			mouseX <= ui["sendingUnitsBg"][key].x + ui["sendingUnitsBg"][key].image.width &&
  			mouseY >= ui["sendingUnitsBg"][key].y &&
  			mouseY <= ui["sendingUnitsBg"][key].y + ui["sendingUnitsBg"][key].image.height){
  				mouseHiddenUIcolliding = key;
  		}
  	}
	}

	if (showSendUnitUI){
		for(var key in ui["sendingUnitsBg"]){
  		if (mouseX >= ui["sendingUnitsBg"][key].x &&
  			mouseX <= ui["sendingUnitsBg"][key].x + ui["sendingUnitsBg"][key].image.width &&
  			mouseY >= ui["sendingUnitsBg"][key].y &&
  			mouseY <= ui["sendingUnitsBg"][key].y + ui["sendingUnitsBg"][key].image.height){
  				mouseHiddenUIcolliding = key;
  		}
  	}
	}
	*/
}

checkEachUIcollision = function(uiTypeName, mouseX, mouseY){
	mouseUIcolliding[uiTypeName] = -1;		//Tato hodnota se změní, pokud bude colliding
	for(var key in ui[uiTypeName]){
		if (mouseX >= ui[uiTypeName][key].x &&
			mouseX <= ui[uiTypeName][key].x + ui[uiTypeName][key].image.width &&
			mouseY >= ui[uiTypeName][key].y &&
			mouseY <= ui[uiTypeName][key].y + ui[uiTypeName][key].image.height){
				mouseUIcolliding[uiTypeName] = key;
		}
	}
}
