require('dotenv').config()
const { MessageActionRow, MessageSelectMenu, CommandInteractionOptionResolver } = require('discord.js');
const axios = require('../axios/axios')


module.exports = async (client, interaction) => {

    if (interaction.channel.type === 'DM' && (interaction.customId === 'player-selection'|| interaction.customId === 'player-selection-2')) {
        const channelAnnoncesInvites = await client.channels.cache.find(ch => ch.name == 'qui-est-arrivé')

        await interaction.editReply({
            content: `Okay ${interaction.user}! Presque finis!\nS'il te plaît, rentre le code géneré par le jeux pour la verification du compte Clash of Clans! Prends ton temps, au bout de 2 minutes t'auras à nouveau de proposé le menu de sélection de joueur si jamais tu n'as pas eu le temps ;)\nMerci! ;)`,
            files: ['./assets/token.gif']
        })
        let channel = interaction.user.dmChannel;

        const filter = (m) => {
            return m.content.length == 8
        }
        var response = null
        var user_tag = interaction.values[0].replace('#', '%23')
        var menu = null

        const collector = channel.createMessageCollector({ filter: filter, max: 1, idle: 1000 * 120 });

        collector.on('end', async (collected, reason) => {

            try {
                response = await axios.post(`/players/${user_tag}/verifytoken`, {
                    token: collected.at(0).content,
                })
            } catch (error) {
                console.log(error);
            }

            if (collected.size > 0 && collected.at(0).type != 'REPLY') {
                if (response != null && response.data.status == 'invalid') {
                    await interaction.followUp(`Désolé ${interaction.user}, mais nous n'avons pas pu vérifier l'authenticité du compte\nLe code n'est pas valide ou n'est pas associé au compte sélectionné (${interaction.values[0]})\nVeuillez essayer à nouveau...`)
                }
                else {
                    if (user_tag) {
                        const player_role = await axios.get(`/players/${user_tag}`)
                        const player_nickname = player_role.data.name
                        var newRole = null

                        const guild = client.guilds.cache.get(process.env.GUILD_ID)
                        const inviteRole = guild.roles.cache.find(r => r.name == 'Invité')
                        var server_member = await guild.members.fetch(interaction.user)
                        await server_member.setNickname(player_nickname)

                        switch (player_role.data.role) {
                            case 'leader':
                                const leaderRole = guild.roles.cache.find(r => r.name == 'Chef')
                                await server_member.roles.add(leaderRole)
                                newRole = leaderRole
                                break;
                            case 'coLeader':
                                const coLeaderRole = guild.roles.cache.find(r => r.name == 'Chef Adjoint')
                                await server_member.roles.add(coLeaderRole)
                                newRole = coLeaderRole
                                break;
                            case 'admin':
                                const veteranRole = guild.roles.cache.find(r => r.name == 'Ainé')
                                await server_member.roles.add(veteranRole)
                                newRole = veteranRole
                                break;
                            case 'member':
                                const memberRole = guild.roles.cache.find(r => r.name == 'Membre')
                                await server_member.roles.add(memberRole)
                                newRole = memberRole
                                break;
                        }
                        await interaction.followUp(`Félicitations ${interaction.user}! Tu as désormais le rôle '${newRole.name}'`)
                        if (server_member.roles.cache.some(r => r.name === inviteRole.name)) {
                            await server_member.roles.remove(inviteRole);
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
                }
            } else {
                interaction.followUp({ content: `Désole ${interaction.user}, veuillez recommencer les étapes depuis le début en t'assurant d'avoir le Jeton à 8 caractères de Clash of Clans` })

                await new Promise(r => setTimeout(r, 2000)); // == sleep(2)

                let found = false
                for (var message of channel.messages.cache) {
                    if (message[1].author.bot) {
                        if ((message[1].type !== 'REPLY') && (message[1].components[0].components[0].customId == 'player-selection' && !found)) {
                            menu = message[1].components
                            found = true
                            await message[1].delete()
                        }
                        else if (message[1].type !== 'REPLY') {
                            await message[1].delete()
                        }

                    }
                }

                channel.send({ components: menu })
                    .then((msg) => { console.log(msg); })
                    .catch((e) => { console.log(e); })
                return

            }

        })
    }
    else if(interaction.customId === 'player-selection' || interaction.customId === 'player-selection-2' ){
        await interaction.followUp({
            content: `Okay ${interaction.user}! Presque finis!\nS'il te plaît, rentre le code géneré par le jeux pour la verification du compte Clash of Clans! Prends ton temps, au bout de 2 minutes t'auras à nouveau de proposé le menu de sélection de joueur si jamais tu n'as pas eu le temps ;)\nMerci! ;)`,
            files: ['./assets/token.gif'],
            ephemeral: true
        })

        const filter = (m) => {
            return m.content.length == 8
        }
        var response = null
        var user_tag = interaction.values[0].replace('#', '%23')
        var menu = null
        let channel = interaction.channel

        const collector = channel.createMessageCollector({ filter: filter, max: 1, idle: 1000 * 120 });

        collector.on('end', async (collected, reason) => {

            try {
                response = await axios.post(`/players/${user_tag}/verifytoken`, {
                    token: collected.at(0).content,
                })
            } catch (error) {
                console.log(error);
            }

            if (collected.size > 0 && collected.at(0).type != 'REPLY') {
                if (response != null && response.data.status == 'invalid') {
                    await interaction.followUp({content:`Désolé ${interaction.user}, mais nous n'avons pas pu vérifier l'authenticité du compte\nLe code n'est pas valide ou n'est pas associé au compte sélectionné (${interaction.values[0]})\nVeuillez essayer à nouveau...`, ephemeral:true})
                }
                else {
                    if (user_tag) {
                        const player_role = await axios.get(`/players/${user_tag}`)
                        const player_nickname = player_role.data.name
                        var newRole = null

                        const guild = client.guilds.cache.get(process.env.GUILD_ID)
                        const inviteRole = guild.roles.cache.find(r => r.name == 'Invité')
                        var server_member = await guild.members.fetch(interaction.user)
                        

                        for(var role of interaction.member._roles) {
                            try {
                                console.log(role);
                                
                                await server_member.roles.remove(role)
                            } catch (error) {
                                console.log(error);
                            }
                            
                        }
                        
                        await server_member.setNickname(player_nickname)

                        switch (player_role.data.role) {
                            case 'leader':
                                const leaderRole = guild.roles.cache.find(r => r.name == 'Chef')
                                await server_member.roles.add(leaderRole)
                                newRole = leaderRole
                                break;
                            case 'coLeader':
                                const coLeaderRole = guild.roles.cache.find(r => r.name == 'Chef Adjoint')
                                await server_member.roles.add(coLeaderRole)
                                newRole = coLeaderRole
                                break;
                            case 'admin':
                                const veteranRole = guild.roles.cache.find(r => r.name == 'Ainé')
                                await server_member.roles.add(veteranRole)
                                newRole = veteranRole
                                break;
                            case 'member':
                                const memberRole = guild.roles.cache.find(r => r.name == 'Membre')
                                await server_member.roles.add(memberRole)
                                newRole = memberRole
                                break;
                        }
                        await interaction.followUp({content:`Félicitations ${interaction.user}! Tu as désormais le rôle '${newRole.name}'`,ephemeral: true})
                        await new Promise(r => setTimeout(r, 2000)); // == sleep(2)

                        for (var message of channel.messages.cache) {
                            if(message[1].author.username === interaction.user.username){
                                await message[1].delete()
                            }
                        }
                        return
                        
                    }
               }
            } else {
                interaction.followUp({ content: `Désole ${interaction.user}, veuillez recommencer les étapes depuis le début en t'assurant d'avoir le Jeton à 8 caractères de Clash of Clans`, ephemeral: true})
            }

        })


    }
}
