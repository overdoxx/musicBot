require("dotenv").config();
require("./src/utils/Types")();


const Bot = require("./src/struct/Bot");
const client = new Bot();

// AntiCrash
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: " + err);
});
  
process.on("unhandledRejection", (reason, promise) => {
    console.log("[GRAVE] Rejeição possivelmente não tratada em: Promise ", promise, " motivo: ", reason.message);
});
(async () => await client.start(process.env.TOKEN))();
