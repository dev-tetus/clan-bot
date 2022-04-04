require('dotenv').config()
const axios = require('../axios/axios')

const clanWarPollEmbed = require('../messages/clanWarPoll.js')
const clanWarMembersEmbed = require('../messages/clanWarMembers.js')
const DISCORD_EPOCH = 1420070400000


module.exports = async (client) => {
    const today = new Date().getDate()
    const clanWarAnnoncesChannel = await client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· GDC')
    const clanWarLeagueAnnoncesChannel = await client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· LDC')

    function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    async function sendPoll() {
        const response = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar`)
        const responseLeague = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)

        if (response.data.endTime) {
            const warEndTime = new Date(parseInt(response.data.endTime.substr(0, 4)),
                parseInt(response.data.endTime.substr(4, 2)) - 1,
                parseInt(response.data.endTime.substr(6, 2))
            )
        }
        const pinnedMessages = await clanWarAnnoncesChannel.messages.fetchPinned()
        const votesChannel = await client.channels.cache.find(ch => ch.name == 'votes')
        const messages = await votesChannel.messages.fetch();

        const pinnedMessagesAnnoncesLeagueChannel = await clanWarLeagueAnnoncesChannel.messages.fetchPinned()

        for (var msg of pinnedMessages) {
            if (response.data.state !== 'warEnded' || 'notInWar') {
                if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
                    await msg[1].delete()
                }
                else if (msg[1].embeds[0].title.startsWith('[PHASE PRÉPARATION')) {
                    await msg[1].delete()
                }
            }
            if ((msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) && !(today >= 1 && today <= 5)) {
                if (convertSnowflakeToDate(msg[1].id).toLocaleDateString() >= warEndTime.toLocaleDateString()) {
                    console.log('Already a poll...');
                    return
                }

            }
            else {
                await msg[1].delete()
            }
        }
        for (var msg of pinnedMessagesAnnoncesLeagueChannel) {
            if (responseLeague.data.state !== 'notInWar') {
                if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
                    await msg[1].delete()
                }
                else {
                    console.log('Already a CWL Poll...');
                    return
                }
            }

            else {
                await msg[1].delete()
            }
        }
        if ((response.data.state === 'warEnded' || response.data.state === 'notInWar') && (responseLeague.data.state === 'warEnded' || responseLeague.data.state === 'notInWar')) {
            if ((today >= 1 && today <= 5)) {
                await clanWarLeagueAnnoncesChannel.send(clanWarPollEmbed('LDC'))
                const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
                await channelPoll.pin()
                await clanWarLeagueAnnoncesChannel.lastMessage.delete()

                await votesChannel.send(clanWarMembersEmbed('LDC'))
            }
            else {
                await clanWarAnnoncesChannel.send(clanWarPollEmbed('GDC'))
                const channelPoll = await clanWarAnnoncesChannel.lastMessage
                await channelPoll.pin()
                await clanWarAnnoncesChannel.lastMessage.delete()
                await votesChannel.send(clanWarMembersEmbed('GDC'))

            }
        }
        else if (response.data.state === 'preparation') {
            console.log('In preparation');
            const message = require('../messages/clanWarPreparation')(response.data)
            await clanWarAnnoncesChannel.send(message)
            const channelPoll = await clanWarAnnoncesChannel.lastMessage
            await channelPoll.pin()
            await clanWarAnnoncesChannel.lastMessage.delete()
        }
        else if (responseLeague.data.state === 'preparation') {
            const message = require('../messages/clanWarLeaguePreparation')(responseLeague.data)
        }
    }
    sendPoll()
    setInterval(sendPoll, 1000 * 60 * 60)
}