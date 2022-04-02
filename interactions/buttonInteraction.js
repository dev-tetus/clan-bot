require('dotenv').config()
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const axios = require('../axios/axios')

module.exports = async (client, interaction) => {
    const channelBienvenu = await client.channels.cache.find(ch => ch.name == '1-bienvenue')
    const messagesBienvenu = await channelBienvenu.messages.fetch()
    const welcomeMessage = messagesBienvenu.first()

    const clanWarAnnoncesChannel = await client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· GDC') //Channel annonces gdc
    const pinnedMessages = await clanWarAnnoncesChannel.messages.fetchPinned()

    const clanWarLeagueAnnoncesChannel = await client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· LDC') //Channel annonces ldc
    const pinnedMessagesAnnoncesLeagueChannel = await clanWarLeagueAnnoncesChannel.messages.fetchPinned()
    var pollMessage = null

    for (var msg of pinnedMessages) {
        if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
            pollMessage = msg[1]
        }
    }
    for (var msg of pinnedMessagesAnnoncesLeagueChannel) {
        if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
            pollMessage = msg[1]
        }
    }
    switch (interaction.message.id) {
        case welcomeMessage.id:
            try {
                const channelAnnoncesInvites = await client.channels.cache.find(ch => ch.name == 'qui-est-arrivé')
                const channelDiscussionsInvites = await client.channels.cache.find(ch => ch.name == 'discussion-invités')
                const channelPostulerInvites = await client.channels.cache.find(ch => ch.name == 'postuler')
                const user = interaction.member
                let roles = interaction.member.roles.cache

                if (interaction.customId === '0') {

                    if (user._roles > 0 && user.roles.cache.some(role => role.name === 'Invité')) {

                        interaction.reply({
                            content: `Salut ${user}!👋 Nous avons bien conscience que t'es ici en tant que ${roles.find(r => r.name == 'Invité')}, nous t'invitons à aller dans ${channelDiscussionsInvites} pour discuter avec nous et dans ${channelPostulerInvites} pour t'annoncer si jamais tu souhaiterais rentrer dans le clan!`, ephemeral: true
                        })
                    }
                    else if ((!roles.some(role => role.name === 'Invité')) && (user._roles.length > 1)) {
                        if (roles.some(r => r.name == 'Dev')) {//Only for only Dev role case 
                            if (user._roles.length == 2) {
                                if (!roles.some(r => r.name == 'ServerBooster')) {
                                    return await interaction.editReply({ content: `Salut ${user}!!👋 Je n'ai pas trop de travail pour le moment... tout se passe bien :D`, ephemeral: true })

                                }
                                else {
                                    let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                                    await user.roles.add(role);
                                    await interaction.editReply({ content: `Ça y est ${interaction.member}, tu as désormais le rôle ${role}`, ephemeral: true })
                                    channelAnnoncesInvites.send({
                                        content: `${interaction.member} vient d'arriver et est désormais un ${role}`
                                    })
                                    return
                                }
                            }
                            else if (user._roles.length > 2) {
                                return await interaction.editReply({ content: `Salut ${user}!!👋 Je n'ai pas trop de travail pour le moment... tout se passe bien :D`, ephemeral: true })

                            }
                            else {
                                let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                                await user.roles.add(role);
                                await interaction.editReply({ content: `Ça y est ${interaction.member}, tu as désormais le rôle ${role}`, ephemeral: true })
                                channelAnnoncesInvites.send({
                                    content: `${interaction.member} vient d'arriver et est désormais un ${role}`
                                })
                                return
                            }

                        }

                        return await interaction.editReply({ content: `Salut ${user}!!👋 C'est rigolo d'avoir mis non hein! 😅 J'espère que tout se passe bien pour toi, n'oublie pas de mettre tes 👷‍♂️ à travailler et d'améliorer quelque chose dans ton laboratoire! 💯`, ephemeral: true })
                    }
                    else {

                        let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                        await user.roles.add(role);
                        await interaction.editReply({ content: `Ça y est ${interaction.member}, tu as désormais le rôle ${role}`, ephemeral: true })
                        channelAnnoncesInvites.send({
                            content: `${interaction.member} vient d'arriver et est désormais un ${role}`
                        })
                    }

                }
                else {

                    let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                    const isInvite = user.roles.cache.some(r => r.name === 'Invité')
                    const player_tags = await axios.get(`/clans/${process.env.CLAN_TAG}/members`)


                    if ((user._roles.length >= 1 && !isInvite)) {


                        // return await interaction.editReply({ content: `T'es déjà dans le clan ${interaction.member}...`, ephemeral: true })

                        if (user._roles.length > 1 && roles.some(r => r.name === 'Dev')) {
                            return await interaction.editReply({ content: `Salut ${user}!!👋 Je n'ai pas trop de travail pour le moment... tout se passe bien :D`, ephemeral: true })
                        }
                        else if (user._roles.length == 1 && roles.some(r => r.name === 'Server Booster')) {
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
                            })
                            const row = new MessageActionRow()
                                .addComponents(
                                    new MessageSelectMenu()
                                        .setCustomId('player-selection')
                                        .setPlaceholder('Sélectionnez votre nom')
                                        .addOptions(options),
                                );
                            dm.send({ components: [row] })
                            return await interaction.editReply({ content: `Parfait ${user}, un DM vient de t'être envoyé pour continuer avec l'étape de vérification!` })

                        }
                        return await interaction.editReply({ content: `Bien sûr que t'es dans la ${interaction.guild}, ${interaction.member}, t'es en tant que ${interaction.member.roles}`, ephemeral: true })


                    }
                    else {
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
                        })
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('player-selection')
                                    .setPlaceholder('Sélectionnez votre nom')
                                    .addOptions(options),
                            );
                        dm.send({ components: [row] })
                        return await interaction.editReply({ content: `Parfait ${user}, un DM vient de t'être envoyé pour continuer avec l'étape de vérification!` })

                    }
                }
            } catch (e) {
                if (e.name == 'DiscordAPIError') {
                    console.log(error);
                }
                return interaction.reply({ content: `Désolé ${interaction.member}, je n'ai pas pu éxecuter ta demande`, ephemeral: true })

            }
            break;
        case pollMessage.id:
            try {
                const votesChannel = await client.channels.cache.find(ch => ch.name == 'votes')
                const messages = await votesChannel.messages.fetch();
                if (interaction.customId === 'war-0') {
                    for (var msg of messages) {
                        if (msg[1].embeds[0].title.startsWith('Joueurs prochaine')) {
                            const menu1 = msg[1].components[0].components[0]
                            const menu2 = msg[1].components[1].components[0]

                            if (menu2.options.length == 1 && menu2.options[0].value == '-1') { //Only 1 option and it's value -1
                                menu2.spliceOptions(0, 1)
                                menu2.addOptions({
                                    'label': interaction.member.displayName,
                                    'value': interaction.member.displayName,
                                    'description': 'Ne veut pas être en guerre'
                                })
                                for (let memberIndex in menu1.options) {
                                    if (menu1.options[memberIndex].value == interaction.member.displayName) {
                                        menu1.spliceOptions(memberIndex, 1)
                                        if (menu1.options.length == 0) {
                                            menu1.addOptions({
                                                'label': 'Pas de votes',
                                                'value': '-1',
                                            })
                                        }
                                    }
                                }
                                await msg[1].edit({ 'components': msg[1].components })
                                return interaction.editReply({ content: `✅ Ton vote a bien été pris en compte ${interaction.member} ✅`, ephemeral: true })
                            }
                            else {                                                          //At least 1 member
                                for (let member of menu2.options) {
                                    if (member.value == interaction.member.displayName) {
                                        return await interaction.editReply({ content: `❌ Tu as déjà voté cette option ${interaction.member} ❌`, ephemeral: true })
                                    }
                                }
                                for (let memberIndex in menu1.options) {
                                    if (menu1.options[memberIndex].value == interaction.member.displayName) {
                                        menu1.spliceOptions(memberIndex, 1)
                                        if (menu1.options[memberIndex].value == interaction.member.displayName) {
                                            menu1.spliceOptions(memberIndex, 1)
                                            if (menu1.options.length == 0) {
                                                menu1.addOptions({
                                                    'label': 'Pas de votes',
                                                    'value': '-1',
                                                })
                                            }
                                        }
                                    }
                                }
                                menu2.addOptions({
                                    'label': interaction.member.displayName,
                                    'value': interaction.member.displayName,
                                    'description': 'Ne veut pas être en guerre'
                                })
                                await msg[1].edit({ 'components': msg[1].components })
                                return await interaction.editReply({ content: `✅ Ton vote a bien été pris en compte ${interaction.member} ✅`, ephemeral: true })
                            }

                        }

                    }
                    console.log('No war');
                }
                else {
                    for (var msg of messages) {
                        if (msg[1].embeds[0].title.startsWith('Joueurs prochaine')) {
                            const menu1 = msg[1].components[0].components[0]
                            const menu2 = msg[1].components[1].components[0]

                            if (menu1.options.length == 1 && menu1.options[0].value == '-1') { //Only 1 option and it's value -1
                                menu1.spliceOptions(0, 1)
                                menu1.addOptions({
                                    'label': interaction.member.displayName,
                                    'value': interaction.member.displayName,
                                    'description': 'Veut être en guerre'
                                })
                                for (let memberIndex in menu2.options) {
                                    if (menu2.options[memberIndex].value == interaction.member.displayName) {
                                        menu2.spliceOptions(memberIndex, 1)
                                        if (menu2.options.length == 0) {
                                            menu2.addOptions({
                                                'label': 'Pas de votes',
                                                'value': '-1',
                                            })
                                        }
                                    }
                                }
                                await msg[1].edit({ 'components': msg[1].components })
                                return await interaction.editReply({ content: `✅ Ton vote a bien été pris en compte ${interaction.member}✅`, ephemeral: true })
                            }
                            else {                                                          //At least 1 member
                                for (let member of menu1.options) {
                                    if (member.value == interaction.member.displayName) {
                                        return await interaction.editReply({ content: `❌ Tu as déjà voté cette option ${interaction.member} ❌`, ephemeral: true })
                                    }
                                }
                                for (let memberIndex in menu2.options) {
                                    if (menu2.options[memberIndex].value == interaction.member.displayName) {
                                        menu2.spliceOptions(memberIndex, 1)
                                        if (menu2.options.length == 0) {
                                            menu2.addOptions({
                                                'label': 'Pas de votes',
                                                'value': '-1',
                                            })
                                        }
                                    }
                                }
                                menu1.addOptions({
                                    'label': interaction.member.displayName,
                                    'value': interaction.member.displayName,
                                    'description': 'Veut être en guerre'
                                })
                                await msg[1].edit({ 'components': msg[1].components })
                                return await interaction.editReply({ content: `✅ Ton vote a bien été pris en compte ${interaction.member}✅`, ephemeral: true })
                            }

                        }

                    }
                    console.log('Yes war');
                }
            } catch (error) {
                console.log(error);
                return await interaction.editReply({ content: `Désolé ${interaction.member}, je n'ai pas pu éxecuter ta demande`, ephemeral: true })
            }

            break;

    }
}