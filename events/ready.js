const client = require("../index");
const bienvenue = require('../auto/bienvenue.js');
const clanWarPoll = require('../auto/clanWarPoll.js');





client.on("ready", async () =>{
    bienvenue(client)
    clanWarPoll(client)
});