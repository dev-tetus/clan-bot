const { MessageActionRow, MessageSelectMenu } = require('discord.js');
async function sendDmWithPlayers(user,player_tags,interaction){
    dm = await user.createDM()
    const messages = await dm.messages.fetch()
    if (messages.size > 0) {
        for (const message of messages) {
            if (message[1].author.bot === true) await message[1].delete();
        }
    }
    var options1 = []
    var options2 = []
    let count = 0;
    player_tags.data.items.forEach(player => {
        let { tag, name } = player
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
                .addOptions(options1)
            
        );

        console.log('here');
    
    await dm.send({ components: [row] })

    if (count >= 25){
        row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('player-selection')
                .setPlaceholder('Sélectionnez votre nom')
                .addOptions(options2)
            
        );

        await dm.send({ components: [row] })
    }
    return await interaction.followUp({ content: `Parfait ${user}, un DM vient de t'être envoyé pour continuer avec l'étape de vérification!` })
}

module.exports = {
    sendDmWithPlayers
}