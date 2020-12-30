# Replace Data By Key

## RESTFUL API
---  
Replace data stored by storage key

**URL** : `/data/{{key}}`

**Method** : `PUT`

**Basic Auth required** : YES

**Permissions required** : None

**Content Type** : application/json

**Accept** : application/json

**Data examples**

Sample Data Model.

```json
{
    "message": "Replacement",
    "created": "10/1/2020 09:15:12"
}
```

Empty data can be PUT to erase the data but leave the key.

```json
{}
```

<br />

### Success Responses
---
**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information. 

```json
{
    "message": "Replacement",
    "created": "10/1/2020 09:15:12"
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
| method        | Yes      | PUT                                          |
| data          | Yes      | JSON representation of the data to be stored |


**Data Model**
```json
{
    "auth" : { 
        "username" : "admin", 
        "password" : "a1b2c3d4" 
    },
    "url" : "/data/test", 
    "method" : "PUT", 
    "data" : { 
        "message": "Replacement",
        "created": "10/1/2020 09:15:12"
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
socket.emit('http message',{"auth":{"username":"admin","password":"a1b2c3d4"},"url":"/data/test","method":"PUT","data":{"message":"Replacement","created":"10/1/2020 09:15:12"}})
```