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
socketList = {};
gamesList = {};   //vÿnecháno var, aby byla proměnná globální

//Constant game variables
columns = 5;
mainColumnSize = 6;

//Interaction with sockets
io.sockets.on("connection", function(socket){
  //Initialize
  socketInit(socket);

  matchPlayers(socket);

  //Game
  var onNewBuilding = require("./server/onNewBuilding");
  onNewBuilding(socket);

  var onTrainUnits = require("./server/onTrainUnits");
  onTrainUnits(socket);

  var onSendUnits = require("./server/onSendUnits");       //Není hotovo! Ještě tam musím udělat pár změn.
  onSendUnits(socket);

  var onEndTurn = require("./server/onEndTurn");
  onEndTurn(socket);

  //Other
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
      var create = require("./server/createGameVariables");
      create(id, columns, mainColumnSize);

      for(var i in socketList){
        if (socketList[i].matched === false){

          socketList[i].gameID = id;
          socketList[i].matched = true;

          if (gamesList[id].player1 === undefined){
            gamesList[id].player1 = socketList[i].id;
            gamesList[id].owner1 = socketList[i].id;
            socketList[i].playing = true;
          }
          else {
            gamesList[id].player2 = socketList[i].id;
            gamesList[id].owner2 = socketList[i].id;
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

caughtCheating = function(socket){
  console.log("Cheater!");
  var url;
  switch(Math.round(Math.random())){
    case 0:
      url = "https://www.youtube.com/watch?v=DLzxrzFCyOs";    //Never gonna give you up
      break;
    case 1:
      url = "https://www.youtube.com/watch?v=djV11Xbc914";    //Take On Me
      break;
  }
  socket.emit("caughtCheating", url);
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
