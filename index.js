require("dotenv").config();
require("./src/utils/Types")();


const Bot = require("./src/struct/Bot");
const client = new Bot();

var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);


(async () => await client.start(process.env.TOKEN))();
