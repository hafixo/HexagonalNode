//Step functions
stepEvent = function(){
	showUnitsUI();
	checkIfCanMoveUnits(hexSelected);
  resetValues();
}

showUnitsUI = function(){
	if (hexSelected !== -1){
		showUnitUI = true;
	}
	else {
		showUnitUI = false;
	}
}

checkIfCanMoveUnits = function(hexSelected){
	if (hexSelected !== -1){
		if (hex[hexSelected].workers !== 0 || hex[hexSelected].soldiers !== 0 || hex[hexSelected].mages !== 0){
			canMoveUnits = true;
		}
		else {
			canMoveUnits = false;
		}
	}
}

resetValues = function(){
	//Train
	if (!showUnitUI){
    trainValue = [0,0,0];
    trainDigits = [[],[],[]];
  }

	//Send
	if (!showSendUnitUI){
    sendValue = [0,0,0];
    sendDigits = [[],[],[]];
  }
}
