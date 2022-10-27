const client = require('../index')
const {axiosBase} = require('../axios/axios');
const schedule = require('node-schedule')

const rule = new schedule.RecurrenceRule()
rule.hour = '00'
rule.minute = '00'
rule.tz = 'Europe/Madrid'


async function assignRole(newRole, discordMember, currentRoleName, guild) {
    // console.log(discordMember)
    for (var role of discordMember._roles) {
        role = guild.roles.resolve(role);

        if(currentRoleName === null){
            await discordMember.roles.remove(role)
            await discordMember.roles.add(newRole)
            return console.log(`New role assigned to ${discordMember.nickname === null ? discordMember.user.username : discordMember.nickname} as ${newRole.name}`);
        }

        else if (role.name != currentRoleName && role.name != 'Server Booster' && role.name != 'Membre Fondateur' && role.name != 'Dev') {
            await discordMember.roles.remove(role)
            await discordMember.roles.add(newRole)
            return console.log(`New role assigned to ${discordMember.nickname === null ? discordMember.user.username : discordMember.nickname} as ${newRole.name}`);
        }
        else return console.log(`${discordMember.nickname === null ? discordMember.user.username : discordMember.nickname} already with role ${role.name}`);
    }
}
async function updateNickname(discordMember, member) {
    if (discordMember.guild.ownerId != discordMember.user.id && discordMember.nickname != member.name) {
        await discordMember.setNickname(member.name)
    }
}


async function updateInfo(member, discordMember, guild) {
    const leaderRole = guild.roles.cache.find(r => r.name == 'Chef')
    const coLeaderRole = guild.roles.cache.find(r => r.name == 'Chef Adjoint')
    const veteranRole = guild.roles.cache.find(r => r.name == 'Ainé')
    const memberRole = guild.roles.cache.find(r => r.name == 'Membre')
    const inviteRole = guild.roles.cache.find(r => r.name == 'Invité')

    switch (member.role) {
        case 'leader':
            assignRole(leaderRole, discordMember, "Chef", guild)
            return updateNickname(discordMember, member)
        case 'coLeader':
            assignRole(coLeaderRole, discordMember, "Chef Adjoint", guild)
            return updateNickname(discordMember, member)
        case 'admin':
            assignRole(veteranRole, discordMember, "Ainé", guild)
            return updateNickname(discordMember, member)
        case 'member':
            assignRole(memberRole, discordMember, "Membre", guild)
            return updateNickname(discordMember, member)
        case null:
            assignRole(inviteRole, discordMember,null, guild=guild)
    }
}
async function updateMember() {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const clanMembers = await axiosBase.get(`/clans/${process.env.CLAN_TAG}/members`)

    for (var dmember of await guild.members.fetch()){
        console.log(dmember[1]);
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