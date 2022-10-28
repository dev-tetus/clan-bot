const {sendPoll} = require('../../auto/clanWarPoll')


module.exports = {
    name: "liste",
    description: "Obtient la liste de joueurs recrutés pour la guerre",
    type: 'CHAT_INPUT',
    
    run: async (client, interaction, args) => {
        var players= []
        await interaction.deferReply({ ephemeral: true }).catch(() => { })
        const leadersChannel = await client.channels.cache.find(ch => ch.name == 'what-doing')
        for (var role of interaction.member._roles) {
            role =  interaction.guild.roles.resolve(role);
            if (role.name == "Chef Adjoint" || role.name == "Chef"){

                const votesChannel = await client.channels.cache.find(ch => ch.name == 'votes')
                const votesChannelMessages = await votesChannel.messages.fetch()
                if(votesChannelMessages.size >= 1){
                    for (var msg of votesChannelMessages) {
                        if (msg[1].embeds[0].description === 'Liste joueurs recrutés') {
                            var fields = msg[1].components 
                            break
                        }
                    }
                    for (var field of fields){
                        if(field.components[0].placeholder == "Joueurs recrutés"){
                            for(var option of field.components[0].options){
                                players.push(option.label)
                            }
                            break
                        }
                    }
                    if(players.length > 0){
                        const msg = require('../../messages/clan/recrutedPlayerList')(players, 'GDC')
                        console.log();
                        await leadersChannel.send(msg)

                    }
                    else{
                        return await interaction.followUp({ content: `${interaction.member.nickname}, il n'y a pas de joueurs actuellement à être recrutés ou il y a déjà une guerre en cours...`})
                    }
                }

                return await interaction.followUp({ content: `Commande executée` })
            }
        }
        return await interaction.followUp({ content: `Désolé ${interaction.member.nickname}, mais tu n'as pas accès à cette commande`})
    }
}