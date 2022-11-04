const client = require("../index");
const bienvenue = require('../auto/bienvenue.js');
const { sendPollLogic } = require('../auto/clanWarPoll.js');
const scheduleRoleChange = require('../auto/clanMembersInfo.js');
const update = require('../auto/updateData.js');
const sendDiffusion = require('../auto/messageDiffusion.js');
const updateLeagueWars= require('../auto/leagueWarsUpdate.js');

client.on("ready", async () => {
    await bienvenue(client)
    await sendPollLogic()
    await scheduleRoleChange()
    await update()
    await sendDiffusion()
    await updateLeagueWars()
    console.log('Bot ready!');
});
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);

});