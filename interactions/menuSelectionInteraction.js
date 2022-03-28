require('dotenv').config()
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const axios = require('../axios/axios')


module.exports = async (client, interaction) => {

    if (interaction.channel.type === 'DM' && interaction.customId === 'player-selection') {

        const channelAnnoncesInvites = await client.channels.fetch('957806378599219250')

        interaction.reply(`Okay ${interaction.user}! Presque finis!\nS'il te plaît, rentre le code géneré par le jeux pour la verification du compte Clash of Clans!`)
        let channel = interaction.user.dmChannel;

        const filter = (m) => {
            return m.content.length == 8
        }
        const collector = channel.createMessageCollector({ filter: filter, idle: 60000 });
        collector.on('collect', async (code) => {
            const user_tag = interaction.values[0].replace('#', '%23')
            const response = await axios.post(`/players/${user_tag}/verifytoken`, {
                token: code.content,
            })

            if (response.data.status == 'invalid') {
                interaction.followUp(`Désolé ${interaction.user}, mais nous n'avons pas pu vérifier l'authenticité du compte\nLe code n'est pas valide ou n'est pas associé au compte sélectionné (${interaction.values[0]})\nVeuillez essayer à nouveau...`)
            }
            else {
                const player_role = await axios.get(`/players/${user_tag}`)

                var newRole = null

                const guild = client.guilds.cache.get(process.env.GUILD_ID)
                const inviteRole = guild.roles.cache.find(r => r.name == 'Invité')
                const server_member = await guild.members.fetch(interaction.user)

                switch (player_role.data.role) {
                    case 'leader':
                        const leaderRole = guild.roles.cache.find(r => r.name == 'Chef')
                        server_member.roles.add(leaderRole)
                        newRole = leaderRole
                        break;
                    case 'coLeader':
                        const coLeaderRole = guild.roles.cache.find(r => r.name == 'Chef Adjoint')
                        server_member.roles.add(coLeaderRole)
                        newRole = coLeaderRole
                        break;
                    case 'veteran':
                        const veteranRole = guild.roles.cache.find(r => r.name == 'Ainé')
                        server_member.roles.add(veteranRole)
                        newRole = veteranRole
                        break;
                    case 'member':
                        const memberRole = guild.roles.cache.find(r => r.name == 'Membre')
                        server_member.roles.add(memberRole)
                        newRole = memberRole
                        break;
                }
                interaction.followUp(`Félicitations ${interaction.user}! Tu as désormais le rôle '${newRole.name}'`)
                if (server_member.roles.cache.some(r => r.name === inviteRole.name)) {
                    channelAnnoncesInvites.send({
                        content: `${interaction.user} est maintenant ${newRole}!`
                    })
                }
                else {
                    channelAnnoncesInvites.send({
                        content: `${interaction.user} vient d'arriver en étant ${newRole}!`
                    })

                }

            }
        })
        1


    }
}