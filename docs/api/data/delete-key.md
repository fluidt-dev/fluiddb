# Delete Data By Key

## RESTFUL API
---  
Delete data stored by storage key

**URL** : `/data/{{key}}`

**Method** : `DELETE`

**Basic Auth required** : YES

**Permissions required** : None

**Content Type** : application/json

**Accept** : application/json
  
<br />

### Success Responses
---
**Condition** : Data provided is valid and User is Authenticated.

**Code** : `204 NO CONTENT`

**Content example** : Response will be empty

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
| method        | Yes      | DELETE                                       |


**Data Model**
```json
{
    "auth" : { 
        "username" : "admin", 
        "password" : "a1b2c3d4" 
    },
    "url" : "/data/test", 
    "method" : "DELETE"
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
socket.emit('http message',{"auth":{"username":"admin","password":"a1b2c3d4"},"url":"/data/test","method":"DELETE"})
```