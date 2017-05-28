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
	checkEachUIcollision("confirmSpell", mouseX, mouseY);
	checkEachUIcollision("confirmSpellBg", mouseX, mouseY);
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
