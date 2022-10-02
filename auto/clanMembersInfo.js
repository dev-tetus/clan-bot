const client = require('../index')
const axios = require('../axios/axios');
const schedule = require('node-schedule')

const rule = new schedule.RecurrenceRule()
rule.hour = '00'
rule.minute = '00'
rule.tz = 'Europe/Madrid'


async function assignRole(newRole, discordMember, currentRoleName, guild) {
    for (var role of discordMember._roles) {
        role = guild.roles.resolve(role);

        if (role.name != currentRoleName && role.name != 'Server Booster' && role.name != 'Membre Fondateur' && role.name != 'Dev') {
            await discordMember.roles.remove(role)
            await discordMember.roles.add(newRole)
            return console.log(`New role assigned to ${discordMember.nickname} as ${newRole}`);
        }
        else return console.log(`Already with role ${role.name}`);
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
    const inviteRole = guild.roles.cache.find(r=> r.name == "Invité")
    if(member === null) return assignRole(inviteRole, discordMember, null, guild)
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
        default: 
    }
}
async function updateMember() {
    const guild = await client.guilds.fetch(process.env.GUILD_ID)
    const clanMembers = await axios.get(`/clans/${process.env.CLAN_TAG}/members`)
    const discordMembers =  await guild.members.fetch()
    console.log(discordMembers);
    for(var discordMember of discordMembers){
        
        console.log(discordMember[1].nickname);
        let clanMember = await clanMembers.data.items.find(player => player.name == discordMember[1].nickname)
        console.log(clanMember);
        if (clanMember == undefined && !discordMember[1].user.bot) {
            console.log(`Member ${discordMember[1].nickname} not found in clan`);
            await updateInfo(null, discordMember[1], guild)
        }
        else if(clanMember){
            await updateInfo(clanMember, discordMember[1], guild)
        }
    }

}
async function scheduleRoleChange() {
    schedule.scheduleJob(rule, updateMember)
}
module.exports = {
    updateMember,
    scheduleRoleChange
    
}