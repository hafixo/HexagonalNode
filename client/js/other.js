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
	for (var i in ui["main"]){
		if (ui["main"][i].name === "building")
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
