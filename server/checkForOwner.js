var checkForOwner = function(socket, gameID){
  //Returns 1 or 2 (this isn't based on a hexagon, but on the player)
  var owner;
  if (socket.id === gamesList[gameID].owner1){
    owner = 1;
  }
  else {
    owner = 2;
  }
  return owner;
}

//Export
module.exports = checkForOwner;
