


async function updateInfo(member, discordMember, guild) {
    
    const leaderRole = guild.roles.cache.find(r => r.name == 'Chef')
    const coLeaderRole = guild.roles.cache.find(r => r.name == 'Chef Adjoint')
    const veteranRole = guild.roles.cache.find(r => r.name == 'Ainé')
    const memberRole = guild.roles.cache.find(r => r.name == 'Membre')
    const inviteRole = guild.roles.cache.find(r => r.name == 'Invité')

    switch (member.role) {
        case 'leader':
            assignRole(leaderRole, discordMember, "Chef", guild)
            updateNickname(discordMember, member)
            return returnRoles(leaderRole,discordMember,guild)
        case 'coLeader':
            assignRole(coLeaderRole, discordMember, "Chef Adjoint", guild)
            updateNickname(discordMember, member)
            return returnRoles(coLeaderRole,discordMember,guild)
        case 'admin':
            assignRole(veteranRole, discordMember, "Ainé", guild)
            updateNickname(discordMember, member)
            return returnRoles(veteranRole,discordMember,guild) 
        case 'member':
            assignRole(memberRole, discordMember, "Membre", guild)
            updateNickname(discordMember, member)
            return returnRoles(memberRole,discordMember,guild) 
        case null:
            assignRole(inviteRole, discordMember,null, guild)
            return returnRoles(inviteRole,discordMember,guild)
    }
}

async function returnRoles(newRole, discordMember,guild){
    var role = {}
    for (let role of discordMember._roles) {
        role = await guild.roles.resolve(role);
        if(role.name != newRole && role.name != 'Server Booster' && role.name != 'Membre Fondateur' && role.name != 'Dev'){
            return {newRole, role}
        }
    }
    role.name = null
    return {newRole, role}
}

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
    await discordMember.roles.add(newRole)
    return
}

async function updateNickname(discordMember, member) {
    if (discordMember.guild.ownerId != discordMember.user.id && discordMember.nickname != member.name) {
        await discordMember.setNickname(member.name)
    }
}


module.exports = {
    updateInfo
}