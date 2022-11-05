require('dotenv').config()
const {axiosBase,axiosInternal} = require('../axios/axios')
const schedule = require('node-schedule')

const client = require("../index");
const clanWarPollEmbed = require('../messages/clan/clanWarPoll.js')
const clanWarMembersEmbed = require('../messages/clan/clanWarMembers.js')

const rule = new schedule.RecurrenceRule()
rule.hour = [8, 12, 19]
rule.minute = '00'
rule.tz = 'Europe/Madrid'

const inWarStatus = ["preparation","inWar"]
const notWarStatus = ["notFound","notInWar","ended"]


function getNextAnnouncementDate() {
    jobTimeData = schedule.scheduledJobs[Object.keys(schedule.scheduledJobs)[0]].nextInvocation()._date.c
    invocationDate = jobTimeData.day + '-' + jobTimeData.month + '-' + jobTimeData.year + " " + jobTimeData.hour + ":" + jobTimeData.minute
    return console.log('Next announcement scheduled at: ' + invocationDate);

}

function isNotInWar(response, responseLeague){
    if(inWarStatus.includes(response.data.state) || inWarStatus.includes(responseLeague.data.state)) return false
    else return true
}

async function sendPoll() {
    const today = new Date().getDate()
    const clanWarAnnoncesChannel =  client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· GDC')
    const clanWarLeagueAnnoncesChannel =  client.channels.cache.find(ch => ch.name == 'annonces' && ch.parent.name == '⚔· LDC')

    var responseLeague = null
    var response = null
    try {
        response = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/currentwar`)
    } catch (error) {
        response = { data: { state: 'notFound' } }
    }

    try {
        responseLeague = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    } catch (error) {
        responseLeague = { data: { reason: 'notFound' } }
    }

    const pinnedMessagesAnnoncesGuerre = await clanWarAnnoncesChannel.messages.fetchPinned()
    const votesChannel = await client.channels.cache.find(ch => ch.name == 'votes')
    const votesChannelMessages = await votesChannel.messages.fetch()

    //! Delete old list of recruted players
    // -- CHECK FOR WAR STATUS AND ITS WAR PHASES TIMESTAMPS AT CoC API
    for(var msg of votesChannelMessages.values()){
        //response.data.state != "notFound" || response.data.state != "notInWar" || response.data.state != "warEnded"
        const warDate =  !notWarStatus.includes(response.data.state) ? response.data.preparationStartTime : (() =>{ return !notWarStatus.includes(responseLeague.data.state) ? new Date(responseLeague.data.season + '-01').toISOString() : null})()
        console.log(new Date(responseLeague.data.season + '-01').toISOString());
        console.log(!isNotInWar(response,responseLeague));
        if(warDate != null){
            if(!isNotInWar(response,responseLeague) && parseUnixDate(msg.embeds[0].timestamp) > warDate){
           
                console.log("Message delete");
                await msg.delete()
                await axiosInternal().post("/clan/player/votes/reset")
                
            }
            else{
                console.log("Poll message for next war");
            }


        }
    }
    

    const pinnedMessagesAnnoncesLeagueChannel = await clanWarLeagueAnnoncesChannel.messages.fetchPinned()

    //! Delete all messages from annonces channel to send back again fresh ones

    for (let msg of pinnedMessagesAnnoncesGuerre) {
        await msg[1].delete()
    }

    //! Delete all messages from annonces channel to send back again fresh ones

    for (let msg of pinnedMessagesAnnoncesLeagueChannel) {
        await msg[1].delete()
    }
    async function sendPollStatsMessage(type){
        //! Send poll stats message
        for (var msg of votesChannelMessages.values()) {
            
            if (msg.embeds[0].description === 'Liste joueurs recrutés') {
                getNextAnnouncementDate()
                return
            }
        }
        await votesChannel.send(clanWarMembersEmbed(type))
    }

    //! If no war in progress and no league war 
    
    //! Beginning of month (start of league)
    if ((today > 28 || today <= 5) && (responseLeague.data.state != "inWar" && responseLeague.data.state != "preparation")) {
        await clanWarLeagueAnnoncesChannel.send(clanWarPollEmbed('LDC'))
        const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
        try {
            await channelPoll.pin()
            await clanWarLeagueAnnoncesChannel.lastMessage.delete()
            await sendPollStatsMessage("LDC")
            return

        } catch (error) {
            console.log(error);
        }

    }
    //! Casual war
    else if ((response.data.state === 'warEnded' || response.data.state === 'notInWar')){
        await clanWarAnnoncesChannel.send(clanWarPollEmbed('GDC'))
        const channelPoll = await clanWarAnnoncesChannel.lastMessage
        try {
            await channelPoll.pin()
            await clanWarAnnoncesChannel.lastMessage.delete()
            await sendPollStatsMessage("GDC")
            
        } catch (error) {
            console.log(error);
        }
    }


    //! Casual war preparation phase
    if (response.data.state === 'preparation') {
        console.log('In preparation');
        const message = require('../messages/inPrep/clanWarPreparation')(response.data)
        await clanWarAnnoncesChannel.send(message)
        await clanWarAnnoncesChannel.lastMessage.pin()
        await clanWarAnnoncesChannel.lastMessage.delete()
        await clanWarAnnoncesChannel.send(clanWarPollEmbed('GDC'))
        await clanWarAnnoncesChannel.lastMessage.pin()
        await clanWarAnnoncesChannel.lastMessage.delete()
        await sendPollStatsMessage("GDC")
    }
     //! Casual war war phase
    if (response.data.state === 'inWar') {
    console.log('Casual war started...');
    const message = require('../messages/inWar/clanWarInWar')(response)
    await clanWarAnnoncesChannel.send(message)
    await clanWarAnnoncesChannel.lastMessage.pin()
    await clanWarAnnoncesChannel.lastMessage.delete()
    await clanWarAnnoncesChannel.send(clanWarPollEmbed('GDC'))
    await clanWarAnnoncesChannel.lastMessage.pin()
    await clanWarAnnoncesChannel.lastMessage.delete()
    console.log("here");
    await sendPollStatsMessage("GDC")
    }
    //! League war preparation phase
    if (responseLeague.data.state === 'preparation') {
        const message = require('../messages/inPrep/clanWarLeaguePreparation')(responseLeague.data)
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
    return getNextAnnouncementDate()
}
function parseUnixDate(time) {
    date = new Date(value=time)
    console.log(date);
    return date.toISOString().replace(/[:-]/g,"")
}
async function sendPollLogic() {
    schedule.scheduleJob(rule, sendPoll)
    getNextAnnouncementDate()
}
module.exports = {
    sendPollLogic,
    sendPoll,
    scheduleJobAtTime
}