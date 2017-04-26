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
