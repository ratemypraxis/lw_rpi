const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
//module for sending digital signal through the pins
const Gpio = require('onoff').Gpio;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//tell server what pin the led is on
const ledPin = 18;
const led = new Gpio(ledPin, 'out');

//serve webpage 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//a user has connected
io.on('connection', (socket) => {
  console.log('A user connected');

  //a user has rung
  socket.on('ring', () => {
    console.log('someone rung');
    
    //turn on the LED by sending a HIGH event
    led.writeSync(1);
    //stop sending HIGH after a secong
    setTimeout(() => {
      led.writeSync(0);
    }, 1000);
  });

  //a user has disconnected
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//run server
const port = 8080;
server.listen(port, () => {
  console.log(`Server is running on port 8080`);
});
