const axios = require('../../axios/axios')
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {

    name: "actualiser",
    description: "Met à jour le profile du joueur sur Discord",
    type: 'CHAT_INPUT',

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        const player_tags = await axios.get(`/clans/${process.env.CLAN_TAG}/members`)

        var options = []

        player_tags.data.items.forEach(player => {
            let { tag, name, role } = player
            let option = {
                label: name,
                value: tag
            }
            options.push(option)
        })

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('player-selection')
                    .setPlaceholder('Sélectionnez votre nom')
                    .addOptions(options),
            );

        return await interaction.followUp({ content: "Choisis ton profile", components: [row], ephemeral: true})
    }

}