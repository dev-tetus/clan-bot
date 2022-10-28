
const {playerSignUp} = require('../utils/player/playerSignUp')


module.exports = async (client, interaction) => {

    var response = null
    var user_tag = interaction.values[0].replace('#', '%23')
    const channelAnnoncesInvites = await client.channels.cache.find(ch => ch.name == 'qui-est-arrivé')
    const channelChatGeneral = await client.channels.cache.find(ch => ch.name == 'chat')
    const channel = interaction.user.dmChannel;
    const filter = (m) => { return m.content.length == 8}

    await interaction.editReply({
        content: `Okay ${interaction.user}! Presque finis!\nS'il te plaît, rentre le code géneré par le jeux pour la verification du compte Clash of Clans! Prends ton temps, au bout de 2 minutes t'auras à nouveau de proposé le menu de sélection de joueur si jamais tu n'as pas eu le temps ;)\nMerci! ;)`,
        files: ['./assets/token.gif']
    })

    if (interaction.customId === 'player-selection') {
        const collector = channel.createMessageCollector({ filter: filter, max: 1, idle: 1000 * 120 });

        collector.on('end', async (collected, reason) => {
            playerSignUp(client,user_tag,collected, interaction,channelAnnoncesInvites,channelChatGeneral)
            await new Promise(r => setTimeout(r, 2000));

            for (var message of channel.messages.cache) {
                if (message[1].author.bot) {
                    if ((message[1].type !== 'REPLY')) {
                        await message[1].delete()
                    }

                }
            }
        })
    }
    
}
