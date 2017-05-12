var express = require("express");
var app = express();
var serv = require("http").Server(app);

var port = process.env.PORT || 8080;    //Heroku


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/client/index.html");
});

app.use("/client", express.static(__dirname + "/client"));

serv.listen(port);    //Heroku
console.log("Server started.");

var io = require("socket.io")(serv, {});

io.set('transports', ['websocket']);    //Nastaví komunikaci výhradně přes websockety, nikoliv přes http

var timein = 0;     //zabrání timeoutu

/*
Nedotýkám se ničeho, co je nad touto hranicí.
-----------------------------------------------------
Dotýkat se můžu pouze toho, co je pod touto hranicí.
*/


//Initial server variables
var socketList = {};
var gamesList = {};

//Interaction with sockets
io.sockets.on("connection", function(socket){
  socketInit(socket);

  matchPlayers(socket);

  onEndTurn(socket);

  onPlayerDisconnect(socket);

  recieveTimeoutSocket(socket);
});

//Definované funkce
socketInit = function(socket){
  //Vytvoření proměnných u socketu
  socket.id = Math.random();
  socket.matched = false;

  //Přidání socketu do objektu obsahujícího všechny sockety
  socketList[socket.id] = socket;

  //Pošle ID klientu, abych je podle něho mohl odlišovat a každému posílat jiná data
  socket.emit("id", socket.id);
  console.log("socket connection with id " + socket.id);
}

matchPlayers = function(socket){
  //Zjistí, jestli může hráče spojit s jiným hráčem
  var playersSearching = 0;   //kolik hráčů hledá soupeře
  for(var i in socketList){
    if (socketList[i].matched === false){
      playersSearching++;
    }
  }

  //Hru hledá 2 nebo více hráčů => spojení
  if (playersSearching >= 2){
    //Spojí 2 hráče, vytvoří variable pro hru v objektu gamesList
    while(Math.floor(playersSearching/2) !== 0){   //Přiřazuje k sobě hráče, dokud je nepřiřadí všechny
      var id = Math.random();
      gamesList[id] = {};
      createGameVariables(id);

      for(var i in socketList){
        if (socketList[i].matched === false){

          socketList[i].gameID = id;
          socketList[i].matched = true;

          if (gamesList[id].player1 === undefined){
            gamesList[id].player1 = socketList[i].id;
            socketList[i].playing = true;
          }
          else {
            gamesList[id].player2 = socketList[i].id;
            socketList[i].playing = false;
          }

          var sock = socketList[i];
          sock.emit("startGame", socketList[i].playing);    //Pošle také informaci, jestli daný hráč začíná nebo ne
        }
      }

      playersSearching -= 2;
      console.log("Matched!");
    }
  }

  //Pokud nenajde soupeře, tak pošle socket "searching"
  if (socket.matched === false){
    socket.emit("searching");
  }
}

createGameVariables = function(id){
  gamesList[id].player1 = undefined;
  gamesList[id].player2 = undefined;

  //Hexagon object - contains objects of each hexagon, named by a number (first index is 0)
  gamesList[id].hex = {};

  columns = 5;
  mainColumnSize = 6;

  createMap(id, columns, mainColumnSize);
}

createMap = function(gameID, columns, mainColumnSize){
  //Calculate hexCount
  var hexCount = mainColumnSize;
  var sideColumns = (columns - 1) / 2;
  for(var col = 1; col <= sideColumns; col++){
    hexCount += (mainColumnSize - col) * 2;
  }

  //Create the map
  var currentColFromMain = sideColumns;		//Jak daleko je momentální sloupec vzdálen od středu
  var currentDist = sideColumns;					//Jak daleko je momentální sloupec vzdálen od středu - pomocná proměnná
  var currentCol = 1;
  var currentColPos = 1;
  var currentColSize;

  //Create the hexagon objects, set their variables
  for(var id = 0; id < hexCount; id++){
    gamesList[gameID].hex[id] = {};

    currentColSize = mainColumnSize - currentColFromMain;

    //Variables
    /*
    hex[id].x = hexXpos + (Img.hex.width*(currentCol-1) * 0.75);	//Musí se vynásobit 0.75, aby do sebe hexagony přesně zapadaly - jinak by byly daleko od sebe
    hex[id].y = hexYpos + Img.hex.height*(currentColPos-1) - Img.hex.height*(sideColumns-currentColFromMain) / 2 - currentColPos;
    */
    gamesList[gameID].hex[id].column = currentCol;
    gamesList[gameID].hex[id].line = currentColPos + mainColumnSize - (mainColumnSize - Math.abs(currentDist)) / 2 - mainColumnSize / 2;
    gamesList[gameID].hex[id].building = -1;
    gamesList[gameID].hex[id].workers = 0;
    gamesList[gameID].hex[id].soldiers = 0;
    gamesList[gameID].hex[id].mages = 0;

    currentColPos++;
    if (currentColPos > currentColSize){
      currentColPos = 1;
      currentDist--;
      currentCol++;
      currentColFromMain = Math.abs(currentDist);
      currentColSize = mainColumnSize - currentColFromMain;
    }
  }
}

onEndTurn = function(socket){
  socket.on("endTurn", function(){
    if (socket.playing){    //anticheat
      var gameID = socketList[socket.id].gameID;
      var otherPlayer = findOtherPlayer(socket, gameID);

      //Switch who is playing
      socketList[socket.id].playing = false;
      socketList[otherPlayer].playing = true;

      //Send socket to the player who is now playing
      for(var i in socketList){
        if (parseFloat(i) === otherPlayer){
          var sock = socketList[i];
          sock.emit("startTurn");
        }
      }
    }
    else {
      onCaughtCheating(socket);
    }
  });
}

findOtherPlayer = function(socket, gameID){
  for(var i in gamesList[gameID]){
    if (socket.id === gamesList[gameID].player1){
      return gamesList[gameID].player2;
    }
    else {
      return gamesList[gameID].player1;
    }
  }
}

onCaughtCheating = function(socket){
  console.log("Cheater!");
}

onPlayerDisconnect = function(socket){
  socket.on("disconnect",function(){
    delete socketList[socket.id];
  });
}

recieveTimeoutSocket = function(socket){
  socket.on("timein", function(data){
    timein = data;
  });
}

//zabrání timeoutu
setInterval(function(){
  for(var i in socketList){
    var socket = socketList[i];
    var random = Math.random();
    socket.emit("timeout", random);
  }
}, 10000);
