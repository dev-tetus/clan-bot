const {axiosBase} = require('../../axios/axios')
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {

    name: "actualiser",
    description: "Met à jour le profile du joueur sur Discord",
    type: 'CHAT_INPUT',

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        const player_tags = await axiosBase.get(`/clans/${process.env.CLAN_TAG}/members`)

        var options1 = []
        var options2 = []
        let count = 0;
        player_tags.data.items.forEach(player => {
            let { tag, name, role } = player
            if (count < 25) {
                count++
                let option = {
                    label: name,
                    value: tag
                }
                options1.push(option)
            }
            else {
                let option = {
                    label: name,
                    value: tag
                }
                options2.push(option)
            }

        })
        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('player-selection')
                    .setPlaceholder('Sélectionnez votre nom')
                    .addOptions(options1),
            );
        await interaction.followUp({ content: "Choisis ton profile", components: [row], ephemeral: true})
            
        if(count >= 25){
            let row2 = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('player-selection-2')
                        .setPlaceholder('Sélectionnez votre nom')
                        .addOptions(options2),
                );
            await interaction.followUp({components: [row2], ephemeral: true})
        }   
       
        // return await interaction.followUp({components: [row], ephemeral: true})

    }

}