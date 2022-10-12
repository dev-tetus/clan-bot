require('dotenv').config()
const axios = require('../axios/axios')
const schedule = require('node-schedule')

const client = require("../index");
const leagueWarDay = require('../requests/leagueWarDay')
const clanWarPollEmbed = require('../messages/clanWarPoll.js')
const clanWarMembersEmbed = require('../messages/clanWarMembers.js')
const DISCORD_EPOCH = 1420070400000

const rule = new schedule.RecurrenceRule()
rule.hour = [8, 12, 19]
rule.minute = '00'
rule.tz = 'Europe/Madrid'




function getNextAnnouncementDate() {
    jobTimeData = schedule.scheduledJobs[Object.keys(schedule.scheduledJobs)[0]].nextInvocation()._date.c
    invocationDate = jobTimeData.day + '-' + jobTimeData.month + '-' + jobTimeData.year + " " + jobTimeData.hour + ":" + jobTimeData.minute
    return console.log('Next announcement scheduled at: ' + invocationDate);

}

async function sendPoll() {
    const today = new Date().getDate()
    const clanWarAnnoncesChannel =  client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· GDC')
    const clanWarLeagueAnnoncesChannel =  client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· LDC')

    var responseLeague = null
    var response = null
    try {
        response = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar`)
    } catch (error) {
        response = { data: { state: 'notFound' } }
    }

    try {
        responseLeague = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    } catch (error) {
        responseLeague = { data: { reason: 'notFound' } }
    }

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
        await msg[1].delete()
    }

    //! Delete all messages from annonces channel to send back again fresh ones

    for (var msg of pinnedMessagesAnnoncesLeagueChannel) {
        await msg[1].delete()
    }

    //! If no war in progress and no league war 
    
    //! Beginning of month (start of league)
    if ((today >= 1 && today <= 5) && (responseLeague.data.state != "inWar" || responseLeague.data.state != "preparation")) {
        await clanWarLeagueAnnoncesChannel.send(clanWarPollEmbed('LDC'))
        const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
        await channelPoll.pin()
        try {
            await clanWarLeagueAnnoncesChannel.lastMessage.delete()

        } catch (error) {

        }

        //! Send poll stats message
        for (var msg of votesChannelMessages) {
            if (msg[1].embeds[0].description === 'Liste joueurs recrutés') {
                console.log('Already poll stats message for league war');
                getNextAnnouncementDate(schedule)
                return
            }
        }
        await votesChannel.send(clanWarMembersEmbed('LDC'))
    }
    //! Casual war
    else if ((response.data.state === 'warEnded' || response.data.state === 'notInWar') && (responseLeague.data.reason === 'notFound' || responseLeague.data.state === 'ended' || responseLeague.data.state === 'notInWar')){
        await clanWarAnnoncesChannel.send(clanWarPollEmbed('GDC'))
        const channelPoll = await clanWarAnnoncesChannel.lastMessage
        await channelPoll.pin()
        await clanWarAnnoncesChannel.lastMessage.delete()


        //! Send poll stats message
        for (var msg of votesChannelMessages) {
            if (msg[1].embeds[0].description === 'Liste joueurs recrutés') {
                console.log('Already poll stats message for war');
                getNextAnnouncementDate(schedule)
                return
            }

        }
        await votesChannel.send(clanWarMembersEmbed('GDC'))
    }


    //! Casual war preparation phase
    if (response.data.state === 'preparation') {
        console.log('In preparation');
        const message = require('../messages/clanWarPreparation')(response.data)
        await clanWarAnnoncesChannel.send(message)
        const channelPollMessage = await clanWarAnnoncesChannel.lastMessage
        await channelPollMessage.pin()
        await clanWarAnnoncesChannel.lastMessage.delete()
    }
     //! Casual war war phase
    if (response.data.state === 'inWar') {
    console.log('Casual war started...');
    const message = require('../messages/clanWarInWar')(response)
    await clanWarAnnoncesChannel.send(message)
    const clanWarAnnoncesMessage = await clanWarAnnoncesChannel.lastMessage
    await clanWarAnnoncesMessage.pin()
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
    if (responseLeague.data.state === 'inWar') {
        await require('../requests/leagueWarDay')(clanWarLeagueAnnoncesChannel)
        //? Sleep
        await new Promise(r => setTimeout(r, 500));

        await require('../requests/leagueWarPreparationNextDay')(clanWarLeagueAnnoncesChannel, false)
    }
}

function scheduleJobAtTime(rule) {
    schedule.scheduleJob(rule, sendPoll)
    return getNextAnnouncementDate(schedule)
}
async function sendPollLogic() {


    function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
        const milliseconds = BigInt(snowflake) >> 22n
        return new Date(Number(milliseconds) + epoch)
    }

    schedule.scheduleJob(rule, sendPoll)
    getNextAnnouncementDate()
}
module.exports = {
    sendPollLogic,
    sendPoll,
    scheduleJobAtTime
}