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

        if (role.name != currentRoleName && role.name != 'Server Booster') {
            await discordMember.roles.remove(role)
            await discordMember.roles.add(newRole)
            return console.log(`New role assigned to ${discordMember.nickname} as ${newRole}`);
        }
        else return console.log('Already with role');
    }
}
async function updateNickname(discordMember, member) {
    if (discordMember.guild.ownerId != discordMember.user.id) {
        await discordMember.setNickname(member.name)
    }
}


async function updateInfo(member, discordMember, guild) {
    const leaderRole = guild.roles.cache.find(r => r.name == 'Chef')
    const coLeaderRole = guild.roles.cache.find(r => r.name == 'Chef Adjoint')
    const veteranRole = guild.roles.cache.find(r => r.name == 'Ainé')
    const memberRole = guild.roles.cache.find(r => r.name == 'Membre')
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
    }
}
async function updateMember() {
    const guild = client.guilds.cache.first()
    const clanMembers = await axios.get(`/clans/${process.env.CLAN_TAG}/members`)

    for (var member of clanMembers.data.items) {
        let discordMember = await guild.members.search({ query: member.name })
        if (discordMember.size == 0) {
            console.log(`Member ${member.name} not found in discord`);
        }
        else {
            await updateInfo(member, discordMember.first(), guild)
        }
    }
}
module.exports = async () => {
    schedule.scheduleJob(rule, updateMember)

}