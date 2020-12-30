# Create Data By Key

## RESTFUL API
---  
Create stored data by storage key

**URL** : `/data/{{key}}`

**Method** : `POST`

**Basic Auth required** : YES

**Permissions required** : None

**Content Type** : application/json

**Accept** : application/json

**Data examples**

Sample Data Model.

```json
{
    "message": "New Data Key",
    "created": "10/2/2020 08:25:12"
}
```

Empty data can be POST to precreate storage key.

```json
{}
```

<br />

### Success Responses
---
**Condition** : Data provided is valid and User is Authenticated.

**Code** : `201 CREATED`

**Content example** : Response will reflect back the newly created key store. 

```json
{
    "message": "New Data Key",
    "created": "10/2/2020 08:25:12"
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
  
**Condition** : If provided data key exists in storage.

**Code** : `406 NOT ACCEPTABLE`

**Content example** :

```json
{
  "error": "test already exists."
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
| method        | Yes      | POST                                         |
| data          | Yes      | JSON representation of the data to be stored |


**Data Model**
```json
{
    "auth" : { 
        "username" : "admin", 
        "password" : "a1b2c3d4" 
    },
    "url" : "/data/test", 
    "method" : "POST", 
    "data" : {
        "message" : "New Data Key",
        "created" : "10/2/2020 08:25:12"
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
socket.emit('http message',{"auth":{"username":"admin","password":"a1b2c3d4"},"url":"/data/test","method":"POST","data":{"message":"New Data Key","created":"10/2/2020 08:25:12"}})
```