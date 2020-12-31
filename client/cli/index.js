const logger = require("@fluidt/logger");
const readline = require("readline");
const SocketProcessor = require("./socketProcessor");

const rl = readline.createInterface(process.stdin, process.stdout);
const sp = new SocketProcessor();

let username = 'admin',
    password = 'a1b2c3d4'

let prefix = "fluiddb> ";
const print = (msg) => {
  console.log("");
  console.log(msg);
};

const goodbye = () => {
  console.log("");
  console.log("Goodbye! Have a great day!");
  try {
    sp.socket.close();
  } catch (e) {
    //Something
  }
  process.exit(0);
};

const data = {
  get: (key) => {
    sp.socket.emit("http message", {
      auth: { 'username': 'admin', 'password': 'a1b2c3d4' },
      url: `/data/${key}`,
      method: "GET",
    });
  },
  create: (key, data) => {
    sp.socket.emit("http message", {
      auth: { 'username': 'admin', 'password': 'a1b2c3d4' },
      url: `/data/${key}`,
      method: "POST",
      data: data,
    });
  },
  update: (key, data) => {
    sp.socket.emit("http message", {
      auth: { 'username': 'admin', 'password': 'a1b2c3d4' },
      url: `/data/${key}`,
      method: "PATCH",
      data: data,
    });
  },
  replace: (key, data) => {
    sp.socket.emit("http message", {
      auth: { 'username': 'admin', 'password': 'a1b2c3d4' },
      url: `/data/${key}`,
      method: "PUT",
      data: data,
    });
  },
  delete: (key) => {
    sp.socket.emit("http message", {
      auth: { 'username': 'admin', 'password': 'a1b2c3d4' },
      url: `/data/${key}`,
      method: "DELETE",
    });
  },
  list: () => {
    sp.socket.emit("http message", {
      auth: { 'username': username, 'password': password },
      url: `/data`,
      method: "GET",
    });
  }
};

const getAction = (action) => {
  let rsp;
  switch (action) {
    case "POST":
      rsp = "Creating";
      break;
    case "PUT":
      rsp = "Replacing";
      break;
    case "PATCH":
      rsp = "Updating";
      break;
    case "DELETE":
      rsp = "Deleting";
      break;
    case "GET":
      rsp = "Retrieving";
      break;
    default:
  }
  return rsp;
};

const rspStatus = (status, statusText) => {
  let rsp;
  switch(status){
    case 200:
      rsp = "was successful"
      break;
    case 201:
      rsp = "was successful"
      break;
    case 406:
      rsp = "could not be created, duplicate detected."
      break;
    default:
      rsp = statusText
  }
  return rsp;
}

const processLine = (line) => {
  {
    let cmd,
      processCmd,
      key,
      cmdParse = line.trim().split(".");
    if (cmdParse.length > 0) {
      cmd = cmdParse[0];
    }
    if (cmdParse.length > 1) {
      key = cmdParse[1];
    }
    processCmd = cmd.split(" ");
    if (processCmd.length > 0) {
      cmd = processCmd[0];
    }
    switch (cmd) {
      case "connect":
        if (processCmd.length > 1) {
          sp.setServer(processCmd[1]);
        }

        if (processCmd.length > 2) {
          username = processCmd[2];
        }

        if (processCmd.length > 3) {
          password = processCmd[3];
        }
        sp.connect();

        break;
      case "data":
        if (!sp.socket || (sp.socket && sp.socket.disconnected)) {
          print(
            "You must first connect to a fluiddb server before you can access any data."
          );
          rl.prompt();
          return;
        }
        try {
          eval(line.trim());
        } catch (e) {
          console.log("+unknown command `" + line.trim() + "`");
          console.log("");
        }
        break;
      case "clear":
        console.clear();
        break;
      case "help":
        console.log("")
        console.log("fluiddb cli controls the Fluiddb cluster manager.")
        console.log("")
        console.log("Find more information at: https://github.com/fluidt-dev/fluiddb");
        console.log("");
        console.log("Commands:");
        const commands = [
          {
            command: "connect",
            description: "connects to fluiddb server",
            usage: "connect <server url> <user> <password>",
            example: prefix + "connect wss://localhost:6375 admin a1b2c3d4",
          },
          {
            command: "clear",
            description: "clears the screen",
            usage: "clear",
            example: prefix + "clear",
          },
          {
            command: "help",
            description: "displays this help",
            usage: "help",
            example: prefix + "help",
          },
          {
            command: "quit",
            description: "quits fluiddb client",
            usage: "quit",
            example: prefix + "quit",
          },
          {
            command: "Data Management:",
            description: "",
            usage: "data",
            example: prefix + "data",
            type: "heading"
          },
          {
            command: "data.list",
            description: "list storage keys",
            usage: "data.list()",
            example: prefix + "data.list()"
          },
          {
            command: "data.get",
            description: "get data model by key",
            usage: "data.get('key')",
            example: prefix + "data.get('key')"
          },
          {
            command: "data.create",
            description: "create data model by key",
            usage: "data.create('key',{'msg':'my data'})",
            example: prefix + "data.create('key',{'msg':'my data'})"
          },
          {
            command: "data.update",
            description: "update data model by key",
            usage: "data.update('key',{'msg':'my update'})",
            example: prefix + "data.update('key',{'msg':'my update'})"
          },
          {
            command: "data.replace",
            description: "replace data model by key",
            usage: "data.replace('key',{'msg':'my replacement'})",
            example: prefix + "data.replace('key',{'msg':'my replacement'})"
          },
          {
            command: "data.delete",
            description: "delete data model by key",
            usage: "data.delete('key')",
            example: prefix + "data.delete('key')"
          },                                    
        ];
        commands.forEach((command) => {
          if(command.type === "heading"){
            console.log("")
            console.log(`${command.command}        ${command.description}`);
            console.log("---")
          } else {
            console.log(` ${command.command}        ${command.description}`);
            console.log(`    usage: ${command.usage}`);
            console.log(`    example: ${command.example}`);  
          }
          console.log("")
        });
        //console.table(commands);
        break;
      case "exit":
        goodbye();
        break;
      case "quit":
        goodbye();
        break;
      default:
        if (line.trim()) {
          console.log("unknown command `" + line.trim() + "`");
          console.log("");
        }
        break;
    }
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
  }
};

sp.setConnected(() => {
  prefix = `[connected ${sp.server}] fluiddb> `;
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
});

sp.setDisconnected(() => {
  prefix = `[disconnected ${sp.server}] fluiddb> `;
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
});

sp.setProcessor((event, data) => {
  if (data && data.url == "/data") {
    console.log("");
    console.table(data.data);
  } else if (data && data.data) {
    console.log("");
    console.log(data.data);
  } else if (data && data.status >= 400) {
    console.log("");
    console.log('Error', getAction(data.method), 'data storage -', rspStatus(data.status, data.statusText));
  } else {
    console.log("");
    console.log(data);
  }
  rl.prompt();
});

console.log(
  "Welcome to the fluiddb client. prese CTRL+C or type `quit` to exit."
);
console.log("Type `help` for help.");
console.log('')

rl.on("line", processLine).on("close", function () {
  goodbye();
});

rl.setPrompt(prefix, prefix.length);
rl.prompt();
