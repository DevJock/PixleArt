var socket = io.connect({reconnection: false});
var connected = false;
var designs = [];

socket.on('designs', function (designData) {
    designData.forEach(design => {
        designs.push(new Design(design.ip, design.data));
    });
    console.log("Received Design Data"); 
});

socket.on('start', function(message){
    console.log(message.message)
    LOAD();
});

socket.on('currentDesign', function(matrixData){
    selectedRects = matrixData;
    console.log("Received Matrix Data")
});


function CONNECT() {
    if(connected) return;
    connected = true;
    socket.emit('connectToServer');
}

function CLEAR(){
	socket.emit('clear');
}

function DRAW(data){
    socket.emit('drawPage',data);
}

function WRITE(x,y,data){
	socket.emit('writeOne',x,y,data);
}

function SAVE(data){
    socket.emit('saveDesign',data)
}