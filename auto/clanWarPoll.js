require('dotenv').config()
const axios = require('../axios/axios')

const leagueWarDay = require('../requests/leagueWarDay')
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
        const pinnedMessagesAnnoncesGuerre = await clanWarAnnoncesChannel.messages.fetchPinned()
        const votesChannel = await client.channels.cache.find(ch => ch.name == 'votes')

        const votesChannelMessages = await votesChannel.messages.fetch()

        const pinnedMessagesAnnoncesLeagueChannel = await clanWarLeagueAnnoncesChannel.messages.fetchPinned()
        

        //! Delete all messages from annonces channel to send back again fresh ones

        for (var msg of pinnedMessagesAnnoncesGuerre) {
            if (response.data.state !== 'warEnded' && response.data.state !== 'notInWar') {
                if (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]')) {
                    await msg[1].delete()
                    await votesChannel.lastMessage.delete()
                }
                else if (msg[1].embeds[0].title.startsWith('[PHASE PRÉPARATION')) {
                    await msg[1].delete()
                }
            }
            //? No war in progress
            if ((msg[1].embeds[0].title.startsWith('[PHASE VOTATION]') && responseLeague.data.status === 'notInWar') || (msg[1].embeds[0].title.startsWith('[PHASE VOTATION]') && responseLeague.data.status === 'ended')) {
                if(response.data.status != 'ended'){
                    if (convertSnowflakeToDate(msg[1].id).toLocaleDateString() >= warEndTime.toLocaleDateString()) {
                        console.log('Already a poll...');
                        return
                    }
                }
               
            }
            //? War in progress
            else {
                await msg[1].delete()
            }
        }

        //! Delete all messages from annonces channel to send back again fresh ones

        for (var msg of pinnedMessagesAnnoncesLeagueChannel) {
                await msg[1].delete()
        }
        
        //! If no war in progress and no league war 
        if ((response.data.state === 'warEnded' || response.data.state === 'notInWar') && (responseLeague.data.state === 'ended' || responseLeague.data.state === 'notInWar')) {
            
            //! Beginning of month (start of league)
            if ((today >= 1 && today <= 5)) {
                await clanWarLeagueAnnoncesChannel.send(clanWarPollEmbed('LDC'))
                const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
                await channelPoll.pin()
                await clanWarLeagueAnnoncesChannel.lastMessage.delete()

                //! Send poll stats message
                for(var msg of votesChannelMessages){
                    if(msg[1].embeds[1].description === 'Liste joueurs recrutés'){
                        console.log('Already poll stats message');
                        return
                    }
                    else{
                        await votesChannel.send(clanWarMembersEmbed('LDC'))
                    }
                }
            }
            //! Casual war
            else {
                await clanWarAnnoncesChannel.send(clanWarPollEmbed('GDC'))
                const channelPoll = await clanWarAnnoncesChannel.lastMessage
                await channelPoll.pin()
                await clanWarAnnoncesChannel.lastMessage.delete()
                

                //! Send poll stats message
                for(var msg of votesChannelMessages){
                    if(msg[1].embeds[0].description === 'Liste joueurs recrutés'){
                        console.log('Already poll stats message');
                        return
                    }
                    else{
                        await votesChannel.send(clanWarMembersEmbed('GDC'))
                    }
                }
                
            }
        }
        //! Casual war preparation phase
        if (response.data.state === 'preparation') {
            console.log('In preparation');
            const message = require('../messages/clanWarPreparation')(response.data)
            await clanWarAnnoncesChannel.send(message)
            const channelPoll = await clanWarAnnoncesChannel.lastMessage
            await channelPoll.pin()
            await clanWarAnnoncesChannel.lastMessage.delete()
        }
        //! League war preparation phase
        if (responseLeague.data.state === 'preparation') {
            const message = require('../messages/clanWarLeaguePreparation')(responseLeague.data)
            await clanWarLeagueAnnoncesChannel.send(message)
            const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
            await channelPoll.pin()
            await clanWarLeagueAnnoncesChannel.lastMessage.delete()

        }
        //! League war in progress
        if(responseLeague.data.state === 'inWar'){
            await require('../requests/leagueWarDay')(clanWarLeagueAnnoncesChannel)
            //? Sleep
            await new Promise(r => setTimeout(r, 500));

            await require('../requests/leagueWarPreparationNextDay')(clanWarLeagueAnnoncesChannel)
        }
    }
    sendPoll()
    setInterval(sendPoll, 1000 * 60 * 60)
}