require('dotenv').config()
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const axios = require('../axios/axios')


module.exports = async (client, interaction) => {

    if (interaction.channel.type === 'DM' && interaction.customId === 'player-selection') {

        const channelAnnoncesInvites = await client.channels.fetch('957806378599219250')

        await interaction.editReply(`Okay ${interaction.user}! Presque finis!\nS'il te plaît, rentre le code géneré par le jeux pour la verification du compte Clash of Clans!`)
        let channel = interaction.user.dmChannel;

        const filter = (m) => {
            return m.content.length == 8 
        }
        var response = null
        var user_tag = interaction.values[0].replace('#', '%23')
        var menu = null
        
        const collector = channel.createMessageCollector({ filter: filter, max:1,idle: 15000});
        // await collector.on('collect', async (code) => {
            
        // })
        collector.on('end', async (collected,reason) =>{
            
            try {
                response = await axios.post(`/players/${user_tag}/verifytoken`, {
                    token: collected.at(0).content,
                })
            } catch (error) {
                console.log(error);
            }
            console.log('here');
            console.log(response);
            if (collected.size > 0 && collected.at(0).type != 'REPLY') {
                if (response != null && response.data.status == 'invalid') {
                    await interaction.followUp(`Désolé ${interaction.user}, mais nous n'avons pas pu vérifier l'authenticité du compte\nLe code n'est pas valide ou n'est pas associé au compte sélectionné (${interaction.values[0]})\nVeuillez essayer à nouveau...`)
                }
                else {
                    if(user_tag) {
                        const player_role = await axios.get(`/players/${user_tag}`)
                        var newRole = null
            
                        const guild = client.guilds.cache.get(process.env.GUILD_ID)
                        const inviteRole = guild.roles.cache.find(r => r.name == 'Invité')
                        const server_member = await guild.members.fetch(interaction.user)
            
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
                            case 'veteran':
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
                            // channelAnnoncesInvites.send({
                                
                            //     content: `${interaction.user} est maintenant ${newRole}!`
                            // })
                        }
                        else {
                            // channelAnnoncesInvites.send({
                            //     content: `${interaction.user} vient d'arriver en étant ${newRole}!`
                            // })
                        }
                    }    
                }
            } else {
                
            }
            
        })
        

        //     let found = false
        //     if (collected.size == 0){
        //         await interaction.followUp({content: 'Pas de code valide reçu après 2 minutes, veuillez bien recommencer la manip', ephemeral: true})
        //         for(var message of channel.messages.cache){
        //             if(message[1].author.bot){
        //                 if((message[1].type !== 'REPLY' )&&(message[1].components[0].components[0].customId == 'player-selection' && !found)){
        //                     menu = message[1].components
        //                     found = true
        //                     await message[1].delete()
        //                 }
        //                 else if(message[1].type !== 'REPLY'){
        //                     await message[1].delete()
        //                 }
                        
        //             }
        //         }
        //         console.log('here');
        //         console.log(menu);
        //         channel.send({components:menu})
        //             .then((msg) => {console.log(msg);})
        //             .catch((e) =>{console.log(e);})
        //         return

        //     }
        // })
    }
}
