//Step functions
stepEvent = function(){
	showUnitsUI();

  //Reset training / dismissing values
  if (!showUnitUI){
    trainValue = [0,0,0];
    trainDigits = [[],[],[]];
  }
}

showUnitsUI = function(){
	if (hexSelected !== -1){
		showUnitUI = true;
	}
	else {
		showUnitUI = false;
	}
}
