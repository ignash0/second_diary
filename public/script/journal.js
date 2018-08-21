var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(0, 0, 700, 400);
ctx.strokeStyle = '#09f';
ctx.beginPath();
ctx.moveTo(0, 50);
ctx.lineTo(700,50);
ctx.stroke();