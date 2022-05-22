const client = require("../index");
const bienvenue = require('../auto/bienvenue.js');
const { sendPollLogic } = require('../auto/clanWarPoll.js');
const clanMembersInfo = require('../auto/clanMembersInfo.js');

client.on("ready", async () => {
    await bienvenue(client)
    await sendPollLogic()
    await clanMembersInfo()
    console.log('Bot ready!');
});
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);

});