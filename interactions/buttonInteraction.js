require('dotenv').config()
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const axios = require('../axios/axios')

module.exports = async (client, interaction) => {
    const welcomeChannel = await client.channels.fetch('957073975891091486')
    const messages = await welcomeChannel.messages.fetch()
    const welcomeMessage = messages.first()
    switch (interaction.message.id) {
        case welcomeMessage.id:

            const channelAnnoncesInvites = await client.channels.fetch('957806378599219250')
            const user = interaction.member
            let roles = interaction.member.roles.cache


            if (interaction.customId === '0') {
                if (user._roles.size > 0 && user.roles.cache.some(role => role.name === 'Invité')) {
                    interaction.reply({
                        content: `Salut ${user}!👋 Nous avons bien conscience que t'es ici en tant que ${roles.find(r => r.name == 'Invité')}, nous t'invitons à aller dans {channel} pour discuter avec nous et dans {channel} pour postuler.`, ephemeral: true
                    })
                }
                else if (user._roles > 0) {
                    interaction.reply({ content: `Salut ${user}!!👋 C'est rigolo d'avoir mis non hein! 😅 J'espère que tout se passe bien pour toi, n'oublie pas de mettre tes 👷‍♂️ à travailler et d'améliorer quelque chose dans ton laboratoire! 💯`, ephemeral: true })
                }
                else {

                    let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                    await user.roles.add(role);
                    interaction.reply({ content: `Ça y est ${interaction.member}, tu as désormais le rôle ${role}`, ephemeral: true })
                    channelAnnoncesInvites.send({
                        content: `${interaction.member} vient d'arriver et est désormais un ${role}`
                    })
                }

            }
            else {
                let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                const isInvite = user.roles.cache.has(role.id)
                console.log(isInvite);
                console.log(user._roles);
                console.log(user._roles && true);
                if (user._roles.length > 0 && !isInvite) {
                    interaction.reply({ content: `T'es déjà dans le clan ${interaction.member}...`, ephemeral: true })
                }
                else {

                    if (isInvite) await user.roles.remove(role);
                    const player_tags = await axios.get(`/clans/${process.env.CLAN_TAG}/members`)
                    dm = await user.createDM(true)

                    const messages = await dm.messages.fetch()
                    if (messages.size > 0) {

                        for (const message of messages) {
                            if (message[1].author.bot === true) {
                                await message[1].delete();
                            }
                        }
                    }

                    var options = []
                    player_tags.data.items.forEach(player => {
                        let { tag, name, role } = player
                        let option = {
                            label: name,
                            value: tag
                        }
                        options.push(option)
                        console.log(name);
                    })
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('player-selection')
                                .setPlaceholder('Sélectionnez votre nom')
                                .addOptions(options),
                        );
                    dm.send({ components: [row] })

                }
            }

    }
}