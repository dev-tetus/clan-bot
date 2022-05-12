const client = require("../index");
const bienvenue = require('../auto/bienvenue.js');
const { sendPollLogic } = require('../auto/clanWarPoll.js');

client.on("ready", async () => {
    bienvenue(client)
    sendPollLogic()
    console.log('Bot ready!');
});
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);

});