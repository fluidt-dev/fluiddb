# Show Storage Keys
  
Get the details of all data keys in memory storage.  
  
  
## RESTFUL API
---
**URL** : `/data`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

<br />
  
  
### Success Response
---
**Code** : `200 OK`

**Content examples**

For a storage configuration of key1, key2, users, messages

```json
[
    "key1",
    "key2",
    "users",
    "messages"
]
```

## WebSocket API
---

**Event** : http message

**Data Model Properties**
| Property      | Required | Description                                  |
|---------------|----------|----------------------------------------------|
| auth.username | Yes      | Admin user name                              |
| auth.password | Yes      | Admin password                               |
| url           | Yes      | /data                                        |
| method        | Yes      | GET                                          |


**Data Model**
```json
{
    "auth" : { 
        "username" : "admin", 
        "password" : "a1b2c3d4" 
    },
    "url" : "/data", 
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
socket.emit('http message',{"auth":{"username":"admin","password":"a1b2c3d4"},"url":"/data","method":"GET"})
```

## Notes
* If there are no storage keys, and empty array will return.
