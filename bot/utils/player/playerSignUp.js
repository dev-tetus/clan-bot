const {updateInfo} = require('./playerInfo')
const {axiosBase, axiosInternal} = require('../../axios/axios')

async function playerSignUp(client,user_tag,collected, interaction, channelAnnoncesInvites,channelChatGeneral ){
    const response = await axiosBase().post(`/players/${user_tag}/verifytoken`, {
        token: collected.at(0).content,
    })

    if (collected.size > 0 && collected.at(0).type != 'REPLY') {
        if (response != null && response.data.status == 'invalid') {
            await interaction.followUp(`Désolé ${interaction.user}, mais nous n'avons pas pu vérifier l'authenticité du compte\nLe code n'est pas valide ou n'est pas associé au compte sélectionné (${interaction.values[0]})\nVeuillez essayer à nouveau...`)
        }
        else {
            if (user_tag) {
                const player = await axiosBase().get(`/players/${user_tag}`)

                const guild = client.guilds.cache.get(process.env.GUILD_ID)
                var server_member = await guild.members.fetch(interaction.user)
                const roles = await updateInfo(player.data, server_member, guild)
                console.log(roles);
                await interaction.followUp(`Félicitations ${interaction.user}! Tu as désormais le rôle '${roles.newRole.name}'`)

                if(roles.role.name == 'Invité' || roles.role.name == null){ //If it's new player
                    //Add To Database new player
                    await channelAnnoncesInvites.send({content: `${interaction.user} vient d'arriver en étant ${roles.newRole}!`})
                    await channelChatGeneral.send({ content:`Bienvenue ${interaction.user}!!`} )
                    await axiosInternal().post("/api/clan/player/add",{tag:user_tag, username:server_member.nickname !== null ? server_member.nickname : server_member.user.name})
                }
                return
            }
        }
    } 
    else {
        interaction.followUp({ content: `Désole ${interaction.user}, veuillez recommencer les étapes depuis le début en t'assurant d'avoir le Jeton à 8 caractères de Clash of Clans` })
        channel.send({ components: menu })
                .then((msg) => { console.log(msg); })
                .catch((e) => { console.log(e); })
    }
}

module.exports={playerSignUp}