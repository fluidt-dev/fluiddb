const io = require("socket.io-client");
const fs = require("fs");
// client-side
const socket = io("wss://localhost:6375",{
  // option 1
  //ca: fs.readFileSync('server.crt'),

  // option 2. WARNING: it leaves you vulnerable to MITM attacks!
  rejectUnauthorized: false
});

socket.open();

socket.on('http message', (data) => {
   console.log("HTTP Message", data);
})

setTimeout(() => {
  console.log("Testing POST"); 
  socket.emit('http message', {'auth': { 'username': 'admin', 'password': 'a1b2c3d4' }, 'url':"/data/test", 'method':"POST", 'data':{ "name": "object"} })
}, 1000);

setTimeout(() => { 
  console.log("Testing PUT");
  socket.emit('http message', {'auth': { 'username': 'admin', 'password': 'a1b2c3d4' },'url':"/data/test", 'method':"PUT", 'data':{ "name":"object-put", "msg":"replaced" } })
}, 2000);

setTimeout(() => { 
  console.log("Testing PATCH");
  socket.emit('http message', {'auth': { 'username': 'admin', 'password': 'a1b2c3d4' },'url':"/data/test", 'method':"PATCH", 'data':{ "msg":"updated" } })
}, 3000);

setTimeout(() => { 
  console.log("Testing GET");
  socket.emit('http message', {'auth': { 'username': 'admin', 'password': 'a1b2c3d4' },'url':"/data/test", 'method':"GET" })
}, 4000);

setTimeout(() => { 
  console.log("Testing GET keys");
  socket.emit('http message', {'auth': { 'username': 'admin', 'password': 'a1b2c3d4' },'url':"/data", 'method':"GET" })
}, 4000);

setTimeout(() => { 
  console.log("Testing DELETE");
  socket.emit('http message', {'auth': { 'username': 'admin', 'password': 'a1b2c3d4' },'url':"/data/test", 'method':"DELETE" })
}, 5000);

socket.emit('http message', {'url':"badpath", 'method':"GET" })
socket.emit('http message', {'url':"/", 'method':"FOO" })