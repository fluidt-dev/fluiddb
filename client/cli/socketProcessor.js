const io = require("socket.io-client");

function SocketProcessor(processor, connected, disconnected){
  this.socket;
  this.server = "wss://localhost:6375";
  this.connected = connected || function(){};
  this.disconnected = disconnected || function(){};
  this.processor = processor || console.log;

  this.connect = () => {
    if(!this.server){
      this.server = "wss://localhost:6375"
    }
    console.log(`Connecting to server ${this.server}.`)
    this.socket = io(this.server, {
      rejectUnauthorized: false
    });
    this.socket.open();

    this.socket.on('connect', (data) => {
      this.connected(data);      
    });

    this.socket.on('disconnect', (reason) => {
      this.disconnected(reason);
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
    
    this.socket.on('connect_error', function(){
      console.log(`Failed connecting to ${this.server}.`);
    });

    this.socket.on('error', function(err){
      console.log(`error ${err}`);
    });

    this.socket.on('http message', (data) => {
      this.processor("HTTP Message", data);
    });   
  }



  this.setServer = (server) => {
    this.server = server;
  }

  this.setProcessor = (processor) => {
    this.processor = processor;
  }

  this.setConnected = (connected) => {
    this.connected = connected;
  }

  this.setDisconnected = (disconnected) => {
    this.disconnected = disconnected;
  }

}

module.exports = SocketProcessor