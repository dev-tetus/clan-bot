require('dotenv').config()
const axios = require('../axios/axios')

const clanWarPollEmbed = require('../messages/clanWarPoll.js')()
const clanWarMembersEmbed = require('../messages/clanWarMembers.js')()
const DISCORD_EPOCH = 1420070400000

module.exports = async (client) => {
    const clanWarAnnoncesChannel = await client.channels.cache.find(ch=>ch.name == 'annonces' && ch.parent.name == '⚔· GDC')
    function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    async function sendPoll() {
        const response = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar`)
        const warEndTime = new Date(parseInt(response.data.endTime.substr(0, 4)),
            parseInt(response.data.endTime.substr(4, 2)) - 1,
            parseInt(response.data.endTime.substr(6, 2))
        )
        const pinnedMessages = await clanWarAnnoncesChannel.messages.fetchPinned()
        const votesChannel = await client.channels.cache.find(ch=>ch.name == 'votes')
        const messages = await votesChannel.messages.fetch();


        for (var msg of pinnedMessages) {
            if (response.data.state !== 'warEnded') {
                if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
                    await msg[1].delete()
                }
                else if (msg[1].embeds[0].title.startsWith('[PHASE PRÉPARATION')) {
                    await msg[1].delete()
                }
            }
            if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
                if (convertSnowflakeToDate(msg[1].id).toLocaleDateString() >= warEndTime.toLocaleDateString()) {
                    console.log('Already a poll...');
                    return
                }
                else {
                    console.log('War end');
                }
            }
        }
        if (response.data.state === 'warEnded') {
            await clanWarAnnoncesChannel.send(clanWarPollEmbed)
            const channelPoll = await clanWarAnnoncesChannel.lastMessage
            await channelPoll.pin()
            await clanWarAnnoncesChannel.lastMessage.delete()
            await votesChannel.send(clanWarMembersEmbed)
        }
        else if (response.data.state === 'preparation') {
            console.log('In preparation');
            const message = require('../messages/clanWarPreparation')(response.data)
            await clanWarAnnoncesChannel.send(message)
            const channelPoll = await clanWarAnnoncesChannel.lastMessage
            await channelPoll.pin()
            await clanWarAnnoncesChannel.lastMessage.delete()
        }
    }
    sendPoll()
    setInterval(sendPoll, 1000 * 60 * 60)
}