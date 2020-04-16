const express = require("express");
const app = express();

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const serialPort = new SerialPort("COM3", { baudRate: 115200 });
const parser = new Readline();

var server = require("http").Server(app);
var io = require("socket.io")(server);

const design = require("./js/Design");

let matrixData = new Array(16);

var clientIp = "";

app.use(express.static(__dirname + "/public"));

let PORT = process.env.PORT || 8000;
server.listen(PORT);
console.log("Initialized Server on port: " + PORT);
io.set("origins", "*:*");

io.on("connection", function(socket) {
  clientIp = socket.request.connection.remoteAddress;
  console.log(
    "Connection request from " +
      clientIp +
      ":" +
      socket.request.connection.remotePort
  );

  socket.on("connectToServer", function(obj) {
    socket.emit("currentDesign", matrixData)
    socket.emit("designs", design.LoadDesignsFromFile());
    socket.emit("start", { message: "Welcome " + clientIp });
    console.log("Connected Successfully");
  });

  socket.on("clear", function() {
    serialPort.write("clear\n");
  });

  function drawPageLoop() {
    for(let i=0;i<16;i++){
      for(let j=0;j<16;j++){
        serialPort.write(i + "," + j + matrixData[i][j] + "\n");
        console.log("a"+i + "," + j + matrixData[i][j])
      }
    }
  }

  socket.on("drawPage", function(data) {
    matrixData = data;
    drawPageLoop();
  });

  socket.on("saveDesign", function(data) {
    design.SaveDesign(clientIp, data);
  });

  socket.on("writeOne", function(x,y,data) {
    serialPort.write(x.toString(16)+y.toString(16)+data + "\n");
    matrixData[y][x] = data
  });
});

serialPort.pipe(parser);
serialPort.on("open", () => {
  console.log("Serial Port Open");
  for (let i = 0; i < 16; i++) {
    matrixData[i] = new Array(16);
    for (let j = 0; j < 16; j++) {
      matrixData[i][j] = "000000";
      serialPort.write(i.toString(16)+j.toString(16)+matrixData[i][j] + "\n");
    }
  }
});

parser.on("data", data => {
  console.log(data);
});
