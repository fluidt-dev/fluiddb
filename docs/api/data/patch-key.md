# Replace Data By Key

## RESTFUL API
---  
Update data stored by storage key

**URL** : `/data/{{key}}`

**Method** : `PATCH`

**Basic Auth required** : YES

**Permissions required** : None

**Content Type** : application/json

**Accept** : application/json

**Data examples**

Sample Data Model.

```json
{
    "message": "Update this",
    "created": "10/3/2020 20:18:22"
}
```

Specifiying a data model property will update only that property, if property does not exist, it will be created.

```json
{
    "message": "Now Update This",
    "new":"field"
}
```

<br />

### Success Responses
---
**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information. 

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
**Condition** : If provided data is invalid, e.g. bad JSON Object

**Code** : `400 BAD REQUEST`

**Content example** :

```json
sgdgsdjhgsjdskgd
```
  
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
| method        | Yes      | PATCH                                          |
| data          | Yes      | JSON representation of the data to be stored |


**Data Model**
```json
{
    "auth" : { 
        "username" : "admin", 
        "password" : "a1b2c3d4" 
    },
    "url" : "/data/test", 
    "method" : "PATCH", 
    "data" : {
        "message": "Now Update This",
        "new":"field"
    }
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
socket.emit('http message',{"auth":{"username":"admin","password":"a1b2c3d4"},"url":"/data/test","method":"PATCH","data":{"message":"Now Update This","new":"field"}})
```