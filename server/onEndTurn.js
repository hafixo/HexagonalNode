var onEndTurn = function(socket){
  socket.on("endTurn", function(){
    var gameID = socketList[socket.id].gameID;
    if (socket.playing){    //anticheat
      var otherPlayer = findOtherPlayer(socket, gameID);

      //Switch who is playing
      socketList[socket.id].playing = false;
      socketList[otherPlayer].playing = true;

      //Refresh units
      refreshUnits(gameID);

      //Refresh gold and mana
      var refreshGoldAndMana = require("./refreshGoldAndMana");
      var checkForOwner = require("./checkForOwner");
      var owner = checkForOwner(socket, gameID);
      refreshGoldAndMana(gameID, owner);

      //End temporary spells
      for (var i = 1; i <= 2; i++){
        if (i === owner){   //Projeví se u hráče, který ukončil kolo
          gamesList[gameID].player[i].greedMultiplier = 1;
        }

        if (i !== owner){   //Projeví se u hráče, který neukončil kolo
          gamesList[gameID].player[i].happinessMultiplier = 1;
        }
      }

      //Send socket to the player who is now playing
      for(var i in socketList){
        if (parseFloat(i) === otherPlayer){
          var sock = socketList[i];
          sock.emit("startTurn");
        }
      }
    }
    else {
      caughtCheating(socket);
    }
  });
}

refreshUnits = function(gameID){
  for (key in gamesList[gameID].hex){
    for (var i = 0; i <= 2; i++){
      var unitType;
      switch(parseInt(i)){
        case 0:
          unitType = "workers";
          break;
        case 1:
          unitType = "soldiers";
          break;
        case 2:
          unitType = "mages";
          break;
      }

      var unitWaitingType = unitType + "Waiting";

      if (gamesList[gameID].hex[key][unitWaitingType] !== 0){
        gamesList[gameID].hex[key][unitType] += gamesList[gameID].hex[key][unitWaitingType];
        gamesList[gameID].hex[key][unitWaitingType] = 0;
      }
    }
  }
}

//Export
module.exports = onEndTurn;
