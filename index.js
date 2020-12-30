/*
 * Copyright (c) 2020, Dan Abarbanel <abarbaneld at fluidt dot dev>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the name of Fluiddb nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without
 *     specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const express    = require('express')
const http       = require('http')
const spdy       = require('spdy')
const basicAuth  = require('express-basic-auth')
const bodyParser = require('body-parser')
const logger     = require('@fluidt/logger')
const config     = require('config')
const fs         = require('fs')

const app     = express()
const routes  = require('./routes/route-loader')
const ws      = require('./sockets/ws')
const pkg     = require('./package.json')

/** 
 * Configuration:
 *    - Variables
 *    - Setup 
 */
const port           = config.get('server.port') || 3000;
const serverCert     = config.has('server.certs.cert') ? config.get('server.certs.cert') : './certs/server.crt';
const serverKey      = config.has('server.certs.key') ? config.get('server.certs.key') : './certs/server.key';
const passphrase     = config.has('server.certs.passphrase') ? config.get('server.certs.passphrase') : '';
const ignoreTLSError = config.has('server.ignoreTLSError') ? config.get('server.ignoreTLSError') : false;

let users        = {};
let serverConfig = {};
let useHttps     = false;
let environment = process.env.NODE_ENV || 'development';

if(environment === 'development' || ignoreTLSError) {
  //disable certificate validation
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

app.use(express.static("assets"));
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.set('X-Powered-By', 'Fluiddb');
  next();
});

app.get('/', (req, res) => {
  res.json({
    "name": pkg.name,
    "currentDateTime": new Date(),
    "description": pkg.description,
    "version": pkg.version,
    "license": pkg.license
  })
})

/** 
 * Security Setup 
 */
if(config.has('adminUser') && config.get('adminUser') && config.has('adminPassword') && config.get('adminPassword')){
  logger.info('Data API is secure.')
  users[config.get('adminUser')] = config.get('adminPassword')
}
if (Object.entries(users).length > 0) {
  app.use( basicAuth({ users: users }) )
}

app.use(routes)

/** End Security Setup */

function startUpMessage(){
  let schema = useHttps ? 'https' : 'http'
  logger.info(`-----[ Starting server in ${environment} mode. ]---------------------------`)
  logger.info(`  ___________.__        .__    .___________ __________   `)
  logger.info(`  \\_   _____/|  |  __ __|__| __| _/\\______ \\\\______   \\  `)
  logger.info(`   |    __)  |  | |  |  \\  |/ __ |  |    |  \\|    |  _/  `)
  logger.info(`   |     \\   |  |_|  |  /  / /_/ |  |    \`   \\    |   \\ `)
  logger.info(`   \\___  /   |____/____/|__\\____ | /_______  /______  /  `)
  logger.info(`       \\/                       \\/         \\/       \\/   `)    
  logger.info(`${pkg.name} v${pkg.version} is listening at ${schema}://localhost:${port}`)
  logger.info(`-----------------------------------------------------------------------`)
}

/**
 * Server Config.
 */
try {
  if (fs.existsSync(serverCert) && fs.existsSync(serverKey)) {
    useHttps = true;
    serverConfig.cert = fs.readFileSync(serverCert);
    serverConfig.key = fs.readFileSync(serverKey);
    if(passphrase){
      serverConfig.passphrase = passphrase;
    }
  }
} catch(err) {
  console.error(err)
}
let server;
if(useHttps){
  server = spdy.createServer(serverConfig, app)
  .listen(port, () => {
    startUpMessage();
  });
} else {
  server = http.createServer(app)
  .listen(port, () => {
    startUpMessage();
  });
}
/**
 * Websocket Configuration
 */
let t = ws(server, useHttps?'https':'http', port);
