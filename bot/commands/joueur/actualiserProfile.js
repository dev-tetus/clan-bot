const {axiosBase} = require('../../axios/axios')
const {sendDmWithPlayers} = require('../../utils/player/dmVerification')

module.exports = {

    name: "actualiser",
    description: "Met à jour le profile du joueur sur Discord",
    type: 'CHAT_INPUT',

    run: async (client, interaction, args) => {
        const player_tags = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/members`)
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        return sendDmWithPlayers(interaction.user,player_tags,interaction)
    }

}