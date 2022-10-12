const axios = require('../../axios/axios');
const {sendPoll} = require('../../auto/clanWarPoll')

module.exports = {
    name: "guerre",
    description: "Envoie un message d'information dans le channel correspondant",
    type: 'CHAT_INPUT',
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { })
        for (var role of interaction.member._roles) {
            role =  interaction.guild.roles.resolve(role);
            if (role.name == "Chef Adjoint" || role.name == "Chef"){
                sendPoll()
                return await interaction.followUp({ content: `Commande exectuée` })
            }
        }
        return await interaction.followUp({ content: `Désolé ${interaction.member.nickname}, mais tu n'as pas accès à cette commande`})
    }
}