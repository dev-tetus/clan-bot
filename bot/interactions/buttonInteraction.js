require('dotenv').config()

const {axiosBase,axiosInternal} = require('../axios/axios')
const {sendDmWithPlayers} = require('../utils/player/dmVerification')
const updateInfo = require('../utils/player/playerInfo')

module.exports = async (client, interaction) => {
    const channelBienvenu = await client.channels.cache.find(ch => ch.name == '1-bienvenue')
    const messagesBienvenu = await channelBienvenu.messages.fetch()
    const welcomeMessage = messagesBienvenu.first()

    const clanWarAnnoncesChannel = await client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· GDC') //Channel annonces gdc
    const pinnedMessages = await clanWarAnnoncesChannel.messages.fetchPinned()

    const clanWarLeagueAnnoncesChannel = await client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· LDC') //Channel annonces ldc
    const pinnedMessagesAnnoncesLeagueChannel = await clanWarLeagueAnnoncesChannel.messages.fetchPinned()
    var pollMessage = null

    for (let msg of pinnedMessages) {
        if (msg[1].embeds[0].title.startsWith('[PHASE VOTE]')) {
            pollMessage = msg[1]
        }
    }
    for (let msg of pinnedMessagesAnnoncesLeagueChannel) {
        if (msg[1].embeds[0].title.startsWith('[PHASE VOTE]')) {
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

                //? As a guest
                if (interaction.customId === '0') {
                    if (user._roles > 0 && user.roles.cache.some(role => role.name === 'Invité')) {
                        interaction.editReply({
                            content: `Salut ${user}!👋 Nous avons bien conscience que t'es ici en tant que ${roles.find(r => r.name == 'Invité')}, nous t'invitons à aller dans ${channelDiscussionsInvites} pour discuter avec nous et dans ${channelPostulerInvites} pour t'annoncer si jamais tu souhaiterais rentrer dans le clan!`, ephemeral: true
                        })
                    }
                    else if (roles.some(role => role.name === 'Server Booster') && user._roles.length <= 1) {
                        console.log('here');
                        const role = updateInfo({role:null}, user, interaction.guild)
                        await interaction.editReply({ content: `Ça y est ${user}, tu as désormais le rôle ${role}`, ephemeral: true })
                        channelAnnoncesInvites.send({
                            content: `${interaction.member} vient d'arriver et est désormais un ${role}`
                        })

                    }
                    else {
                        await interaction.editReply({ content: `Salut ${user}, tu es déjà dans le clan...`, ephemeral: true })
                    }
                    

                }
                //? As a member
                else {
                    const isInvite = user.roles.cache.some(r => r.name === 'Invité')
                    const player_tags = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/members`)
                    if ((user._roles.length >= 1 && !isInvite)) {
                        
                        if (user._roles.length > 1 && roles.some(r => r.name === 'Dev')) {
                            return await interaction.editReply({ content: `Salut ${user}!!👋 Je n'ai pas trop de travail pour le moment... tout se passe bien :D`, ephemeral: true })
                        }
                        else if (user._roles.length == 1 && roles.some(r => r.name === 'Server Booster')) {
                            await sendDmWithPlayers(user,player_tags,interaction)
                        }
                        return await interaction.editReply({ content: `Bien sûr que t'es dans la ${interaction.guild}, ${interaction.member}, t'es en tant que ${interaction.member.roles}`, ephemeral: true })
                    }
                    else {
                        await sendDmWithPlayers(user,player_tags,interaction)

                    }
                }
            } 
            catch (e) {
                if (e.name == 'DiscordAPIError') {
                    console.log(e);
                }
                return interaction.editReply({ content: `Désolé ${interaction.member}, je n'ai pas pu éxecuter ta demande` })

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
                                await axiosInternal().post(`/flask/clan/player/${interaction.member.nickname === null ? interaction.member.user.username : interaction.member.nickname}/vote`)
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
                                await axiosInternal().post(`/flask/clan/player/${interaction.member.nickname === null ? interaction.member.user.username : interaction.member.nickname}/vote`)
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
                                await axiosInternal().post(`/flask/clan/player/${interaction.member.nickname === null ? interaction.member.user.username : interaction.member.nickname}/vote`)
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
                                await axiosInternal().post(`/flask/clan/player/${interaction.member.nickname === null ? interaction.member.user.username : interaction.member.nickname}/vote`)
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