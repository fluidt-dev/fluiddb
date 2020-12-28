const axios      = require('axios')
const logger     = require('@fluidt/logger')
const io         = require('socket.io')

function SocketManager(server, schema = 'http', port = 3000, host = 'localhost'){
    this.server = server
    this.schema = schema
    this.port = port
    this.host = host
    this.io = io(server, {
        path: '/socket.io',
        serveClient: false,
        // below are engine.IO options
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    this.onConnection = (socket) => {
        logger.debug(`[+] socket ${socket.id} connected`);
        socket.on('http message', async (req) => {
            let hostpath = this.schema + "://" + this.host + ":" + this.port

            //logger.debug("HTTP Request", req);
            let config;
            if(req.data){
                config = {
                    method: req.method,
                    url: hostpath + req.url,
                    data: req.data
                }
            } else {
                config = {
                    method: req.method,
                    url: hostpath + req.url
                }
            }
            
            if(req.auth){
                config.auth = req.auth
            }

            let res = {};
            try {
                let response = await axios(config);
                res = {method: req.method, url: req.url, status: response.status, statusText: response.statusText};
                if(response.data){
                    res.data = response.data
                }
            } catch(err) {
                logger.error(`Websocket Error Making request to '${req.url}.'`)
                if(err.response){
                    res = {method: req.method, url: req.url, status: err.response.status, statusText: err.response.statusText };
                } else {
                    res = {method: req.method, url: req.url, status: 500, statusText: 'Error Making request to ' + req.url };
                }
            }
            socket.emit('http message', res);
        })
        socket.on('disconnect', () => {
            logger.debug(`[-] socket ${socket.id} disconnected`);
        })
    }

    this.io.on('connection', this.onConnection);
}
module.exports = SocketManager