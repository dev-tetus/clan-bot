const client = require('../index')
const {axiosBase} = require('../axios/axios');
const schedule = require('node-schedule')
const {updateInfo} = require('../utils/player/playerInfo')

const rule = new schedule.RecurrenceRule()
rule.hour = '00'
rule.minute = '00'
rule.tz = 'Europe/Madrid'


async function updateMember() {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const clanMembers = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/members`)

    for (var dmember of await guild.members.fetch()){
        let clanMember =clanMembers.data.items.find(cMember => cMember.name === dmember[1].nickname || cMember.name === dmember[1].user.username)
        if(dmember[1].user.bot == false){
            if(clanMember === undefined){
                console.log(`Member ${dmember[1].nickname === null ? dmember[1].user.username : dmember[1].nickname} not found in clan`);
                updateInfo({role:null}, dmember[1], guild)
            }
            else {
                await updateInfo(clanMember, dmember[1], guild)
            }
        }
 
    }

}
module.exports = async () => {
    schedule.scheduleJob(rule, updateMember)
    // updateMember()
}