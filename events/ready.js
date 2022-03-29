const client = require("../index");
const bienvenue = require('../auto/bienvenue.js');
const clanWarPoll = require('../auto/clanWarPoll.js');

client.on("ready", async () =>{
    bienvenue(client)
    clanWarPoll(client)
    console.log('Bot ready!');
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error.requestData);

});