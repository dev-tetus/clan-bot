const client = require("../index");
const bienvenue = require('../Embeds/bienvenue.js');

client.on("ready", () =>{
    console.log(`${client.user.username} is up and ready to go!`)
    bienvenue(client)
});