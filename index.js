const express    = require('express')
const https      = require('https');
const basicAuth  = require('express-basic-auth')
const bodyParser = require('body-parser')
const logger     = require('@fluidt/logger')
const config     = require('config')
const fs         = require('fs')

const app     = express()
const models  = require('./routes/models')
const package = require('./package.json')

/** 
 * Configuration:
 *    - Variables
 *    - Setup 
 */
const port       = config.get('server.port') || 3000;
const serverCert = config.has('server.certs.cert') ? config.get('server.certs.cert') : './certs/server.crt';
const serverKey  = config.has('server.certs.key') ? config.get('server.certs.key') : './certs/server.key';
const passphrase = config.has('server.certs.passphrase') ? config.get('server.certs.passphrase') : '';
let users        = {};
let serverConfig = {};
let useHttps     = false;

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    "name": package.name,
    "currentDateTime": new Date(),
    "description": package.description,
    "version": package.version,
    "license": package.license
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
app.use('/model', models);
/** End Security Setup */

function startUpMessage(){
  let environment = process.env.NODE_ENV || 'development';
  let schema = useHttps ? 'https' : 'http'
  logger.info(`-----[ Starting server in ${environment} mode. ]---------------------------`)
  logger.info(`  ___________.__        .__    .___________ __________   `)
  logger.info(`  \\_   _____/|  |  __ __|__| __| _/\\______ \\\\______   \\  `)
  logger.info(`   |    __)  |  | |  |  \\  |/ __ |  |    |  \\|    |  _/  `)
  logger.info(`   |     \\   |  |_|  |  /  / /_/ |  |    \`   \\    |   \\ `)
  logger.info(`   \\___  /   |____/____/|__\\____ | /_______  /______  /  `)
  logger.info(`       \\/                       \\/         \\/       \\/   `)    
  logger.info(`${package.name} v${package.version} is listening at ${schema}://localhost:${port}`)
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

if(useHttps){
  https.createServer(serverConfig, app)
  .listen(port, () => {
    startUpMessage();
  });
} else {
  app.listen(port, () => {
    startUpMessage();
  });
}
