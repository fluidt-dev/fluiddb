# FluidDB
## What is FluidDB?
FluidDB is a simple in memory key/value pair storage server which utilizies a RESTFUL API. 

## Running FluidDB
Using development configuration.
```
npm start
```
  
Setting Admin username and password in development configuration.
```
ADMIN_USER=admin ADMIN_PASSWORD=password npm start
```

Running in Production mode.
```
NODE_ENV=production npm start
```

## Configuration

### Environment Variables
| Variable          | Description                                                    | Default Value      |
|-------------------|----------------------------------------------------------------|--------------------|
| PORT              | Server port to listen on.                                      | 6375               |
| TLS_CERT          | Path to Certificate file.                                      | ./certs/server.crt |
| TLS_KEY           | Path to Certficate key file.                                   | ./certs/server.key |
| TLS_CA            | Path to intermediate certficate                                |                    |
| TLS_PASSPHRASE    | Passphrase used when generating Certificate.                   |                    |
| IGNORE_TLS_ERRORS | Allows server to communicate while ignoring certificate errors | false              |
| ADMIN_USER        | Admin user used to access data endpoints                       | admin              |
| ADMIN_PASSWORD    | Admin password used to access data endpoints                   | a1b2c3d4           |


## Running with TLS
### Generate Certificate and Key
Run the following command.
```
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 365
```
- Place the server.key and server.crt under the certs directory.
- set TLS_PASSPHRASE environment variable if you entered a passphrase

## Docker Container

### Build Docker Container
From Current Directory.
```
docker build -t fluiddb:latest .
```

### Run Docker Locally Built Container
```
docker run -t --rm -p 6375:6375 fluiddb
```

### Run Docker from Docker Hub
```
docker run -t --rm -p 6375:6375 fluidtdev/fluiddb:1.0.0-alpha
```

## Code Contributions
Note: By contributing code to the Fluiddb project in any form, including sending a pull request via Github, a code fragment or patch via private email or public discussion groups, you agree to release your code under the terms of the BSD license that you can find in the [LICENSE](./docs/LICENSE) file included in the Fluiddb source distribution.

Please see the [CONTRIBUTING](./docs/CONTRIBUTING.md) file in this source distribution for more information, including details on our process for security bugs/vulnerabilities.