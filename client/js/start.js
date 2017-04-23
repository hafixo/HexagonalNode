//pár základních proměnných
var ctx = document.getElementById("ctx").getContext("2d");
WIDTH = 700;
HEIGHT = 700;

//než se spojí se serverem, tak tohle vyplní pozadí
ctx.fillStyle = "gray";
ctx.fillRect(0,0,WIDTH,HEIGHT);
