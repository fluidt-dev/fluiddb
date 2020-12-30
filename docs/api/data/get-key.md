# View Data By Key

## RESTFUL API
---  
Get data stored by storage key

**URL** : `/data/{{key}}`

**Method** : `GET`

**Basic Auth required** : YES

**Permissions required** : None

**Content Type** : application/json

**Accept** : application/json
  
<br />

### Success Responses
---
**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect current state of the key. 

```json
{
    "message": "Now Update This",
    "created": "10/3/2020 20:18:22",
    "new":"field"
}
```
<br />

### Error Response
---  
**Condition** : If provided data key does not exist in storage.

**Code** : `404 NOT FOUND`

**Content example** :

```json
{
  "error": "test not found."
}
```

## WebSocket API
---

**Event** : http message

**Data Model Properties**
| Property      | Required | Description                                  |
|---------------|----------|----------------------------------------------|
| auth.username | Yes      | Admin user name                              |
| auth.password | Yes      | Admin password                               |
| url           | Yes      | /data/{{key}}                                |
| method        | Yes      | GET                                          |


**Data Model**
```json
{
    "auth" : { 
        "username" : "admin", 
        "password" : "a1b2c3d4" 
    },
    "url" : "/data/test", 
    "method" : "GET"
}
```

**Socket.io Example**

This example will send and receive http messages via socket.io.

```js
const io = require("socket.io-client");
const socket = io("wss://localhost:6375",{ rejectUnauthorized: false });
socket.open();

socket.on('http message', (data) => {
   console.log("HTTP Message", data);
})
socket.emit('http message',{"auth":{"username":"admin","password":"a1b2c3d4"},"url":"/data/test","method":"GET"})
```