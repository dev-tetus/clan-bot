const axios = require('../axios/axios')
const clanWarLeagueInWarEmbed = require('../messages/clanWarLeagueInWar')

module.exports = async (clanWarLeagueAnnoncesChannel) =>{
    const leagueResponse = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    const rounds = leagueResponse.data.rounds

    rounds.forEach(async (round, i) =>{
        
         round.warTags.forEach(async warLeagueTag => {
            
             var leagueWarResponse = await axios.get(`/clanwarleagues/wars/${warLeagueTag.replace('#','%23')}`)
             if(leagueWarResponse.data.state === 'preparation'){
                 if(leagueWarResponse.data.clan.name === 'SN3T'){
                    const data ={
                        'day': i +1,
                        'opponent':leagueWarResponse.data.opponent.name,
                        'attacks': leagueWarResponse.data.clan.attacks,
                        'enemyAttacks': leagueWarResponse.data.opponent.attacks,
                        'totalAttacks': leagueWarResponse.data.teamSize,
                        'stars': leagueWarResponse.data.clan.stars,
                        'enemyStars': leagueWarResponse.data.opponent.stars,
                        'endTime': leagueWarResponse.data.startTime
                    }
                    const message = clanWarLeagueInWarEmbed(data,false)
                    await clanWarLeagueAnnoncesChannel.send(message)
                    await clanWarLeagueAnnoncesChannel.lastMessage.pin()
                    await clanWarLeagueAnnoncesChannel.lastMessage.delete()
                    return
                }
                else if(leagueWarResponse.data.opponent.name === 'SN3T'){
                    const data ={
                        'day': i +1,
                        'opponent':leagueWarResponse.data.clan.name,
                        'attacks': leagueWarResponse.data.opponent.attacks,
                        'enemyAttacks': leagueWarResponse.data.clan.attacks,
                        'totalAttacks': leagueWarResponse.data.teamSize,
                        'stars': leagueWarResponse.data.opponent.stars,
                        'enemyStars': leagueWarResponse.data.clan.stars,
                        'endTime': leagueWarResponse.data.endTime
                    }
                    const message = clanWarLeagueInWarEmbed(data)
                    await clanWarLeagueAnnoncesChannel.send(message)
                    const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
                    await channelPoll.pin()
                    await clanWarLeagueAnnoncesChannel.lastMessage.delete()
                    return
                }
            }
        })

    })
    

}