//Load images
var Img = {};
var imagesLoaded = [];
var imageCount = 0;
var allImagesLoaded = false;

//Make sure all images are loaded before doing anything else
loadImage = function(imageName){
  imageCount++;

  Img[imageName].onload = function(){
    //State that this image is loaded
    imagesLoaded.push(imageName);

    //Check if all images are loaded
    if (imageCount === imagesLoaded.length){
      allImagesLoaded = true;
    }
  }
}


//Hexagons
Img.hex = new Image();
Img.hex.src = "../client/img/hex.png";
loadImage("hex");
Img.hexHover = new Image();
Img.hexHover.src = "../client/img/hexHover70.png";
loadImage("hexHover");
Img.hexAvailable = new Image();
Img.hexAvailable.src = "../client/img/hexAvailable70.png";
loadImage("hexAvailable");
Img.hexSelected = new Image();
Img.hexSelected.src = "../client/img/hexSelected70.png";
loadImage("hexSelected");
Img.hexTargeted = new Image();
Img.hexTargeted.src = "../client/img/hexTargeted70.png";
loadImage("hexTargeted");
Img.hexOwner1 = new Image();
Img.hexOwner1.src = "../client/img/hexOwnerTest2.png";
loadImage("hexOwner1");
Img.hexOwner2 = new Image();
Img.hexOwner2.src = "../client/img/hexOwnerTest1.png";
loadImage("hexOwner2");

//Units
Img.worker = new Image();
Img.worker.src = "../client/img/worker.png";
loadImage("worker");
Img.soldier = new Image();
Img.soldier.src = "../client/img/soldier.png";
loadImage("soldier");
Img.mage = new Image();
Img.mage.src = "../client/img/mage.png";
loadImage("mage");

//UI
//UI main
Img.uiBuildingBg = new Image();
Img.uiBuildingBg.src = "../client/img/uiBuildingBg.png";
loadImage("uiBuildingBg");
Img.uiBuildingHover = new Image();
Img.uiBuildingHover.src = "../client/img/uiBuildingHover.png";
loadImage("uiBuildingHover");
Img.uiBuildingSpellSwitch = new Image();
Img.uiBuildingSpellSwitch.src = "../client/img/uiBuildingSpellSwitch.png";
loadImage("uiBuildingSpellSwitch");
Img.uiInfo = new Image();
Img.uiInfo.src = "../client/img/uiInfo.png";
loadImage("uiInfo");
Img.uiGoldIcon = new Image();
Img.uiGoldIcon.src = "../client/img/goldIcon.png";
loadImage("uiGoldIcon");
Img.uiManaIcon = new Image();
Img.uiManaIcon.src = "../client/img/manaIcon.png";
loadImage("uiManaIcon");
Img.uiTrainBar = new Image();
Img.uiTrainBar.src = "../client/img/uiTrainBar.png";
loadImage("uiTrainBar");
Img.uiEndTurn = new Image();
Img.uiEndTurn.src = "../client/img/uiEndTurn.png";
loadImage("uiEndTurn");
Img.uiEndTurnHover = new Image();
Img.uiEndTurnHover.src = "../client/img/uiEndTurnHover.png";
loadImage("uiEndTurnHover");

//UI Main - buildings
Img.uiFarm = new Image();
Img.uiFarm.src = "../client/img/uiFarm.png";
loadImage("uiFarm");
Img.uiBarracks = new Image();
Img.uiBarracks.src = "../client/img/uiBarracks.png";
loadImage("uiBarracks");
Img.uiSchoolOfMagic = new Image();
Img.uiSchoolOfMagic.src = "../client/img/uiSchoolOfMagic.png";
loadImage("uiSchoolOfMagic");
Img.uiMill = new Image();
Img.uiMill.src = "../client/img/uiMill.png";
loadImage("uiMill");
Img.uiWell = new Image();
Img.uiWell.src = "../client/img/uiWell.png";
loadImage("uiWell");
Img.uiTemple = new Image();
Img.uiTemple.src = "../client/img/uiTemple.png";
loadImage("uiTemple");
Img.uiYellowCrystal = new Image();
Img.uiYellowCrystal.src = "../client/img/uiYellowCrystal.png";
loadImage("uiYellowCrystal");
Img.uiRedCrystal = new Image();
Img.uiRedCrystal.src = "../client/img/uiRedCrystal.png";
loadImage("uiRedCrystal");
Img.uiBlueCrystal = new Image();
Img.uiBlueCrystal.src = "../client/img/uiBlueCrystal.png";
loadImage("uiBlueCrystal");

//UI Training units
Img.writeButton = new Image();
Img.writeButton.src = "../client/img/writeButton.png";
loadImage("writeButton");
Img.writeButtonHover = new Image();
Img.writeButtonHover.src = "../client/img/writeButtonHover.png";
loadImage("writeButtonHover");
Img.writeButtonType = new Image();
Img.writeButtonType.src = "../client/img/writeButtonType.png";
loadImage("writeButtonType");
Img.sendButton = new Image();
Img.sendButton.src = "../client/img/sendButton.png";
loadImage("sendButton");
Img.sendButtonHover = new Image();
Img.sendButtonHover.src = "../client/img/sendButtonHover.png";
loadImage("sendButtonHover");

//UI Sending units
Img.uiSendUnitsBg = new Image();
Img.uiSendUnitsBg.src = "../client/img/uiSendUnitsBg.png";
loadImage("uiSendUnitsBg");
Img.uiSendUnitsButton = new Image();
Img.uiSendUnitsButton.src = "../client/img/uiSendUnitsButton.png";
loadImage("uiSendUnitsButton");
Img.uiSendUnitsButtonHover = new Image();
Img.uiSendUnitsButtonHover.src = "../client/img/uiSendUnitsButtonHover.png";
loadImage("uiSendUnitsButtonHover");

//Buildings
Img.farm = new Image();
Img.farm.src = "../client/img/farm.png";
loadImage("farm");
Img.barracks = new Image();
Img.barracks.src = "../client/img/barracks.png";
loadImage("barracks");
Img.schoolOfMagic = new Image();
Img.schoolOfMagic.src = "../client/img/schoolOfMagic.png";
loadImage("schoolOfMagic");
Img.mill = new Image();
Img.mill.src = "../client/img/mill.png";
loadImage("mill");
Img.well = new Image();
Img.well.src = "../client/img/well.png";
loadImage("well");
Img.temple = new Image();
Img.temple.src = "../client/img/temple.png";
loadImage("temple");
Img.yellowCrystal = new Image();
Img.yellowCrystal.src = "../client/img/yellowCrystal.png";
loadImage("yellowCrystal");
Img.redCrystal = new Image();
Img.redCrystal.src = "../client/img/redCrystal.png";
loadImage("redCrystal");
Img.blueCrystal = new Image();
Img.blueCrystal.src = "../client/img/blueCrystal.png";
loadImage("blueCrystal");
