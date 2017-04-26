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
