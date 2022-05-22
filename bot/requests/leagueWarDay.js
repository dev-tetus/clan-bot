const axios = require('../axios/axios')
const clanWarLeagueInWarEmbed = require('../messages/clanWarLeagueInWar')

module.exports = async (clanWarLeagueAnnoncesChannel) =>{
    const leagueResponse = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    const rounds = leagueResponse.data.rounds

    const isActual = false
    var warTags = []
    rounds.forEach(async (round,i) =>{
         round.warTags.forEach(async warLeagueTag => {
            var leagueWarResponse = await axios.get(`/clanwarleagues/wars/${warLeagueTag.replace('#','%23')}`)
            if(leagueWarResponse.data.state === 'inWar'){
                if(leagueWarResponse.data.clan.name === 'SN3T'){
                    const data ={
                        'starsPerAttack':(leagueWarResponse.data.clan.stars/leagueWarResponse.data.clan.attacks).toFixed(2),
                        'starsPerAttackEnemy':(leagueWarResponse.data.opponent.stars/leagueWarResponse.data.opponent.attacks).toFixed(2),
                        "destruction":leagueWarResponse.data.clan.destructionPercentage.toFixed(2),
                        "destructionEnemy":leagueWarResponse.data.opponent.destructionPercentage.toFixed(2),
                        'day': i+1,
                        'opponent':leagueWarResponse.data.opponent.name,
                        'attacks': leagueWarResponse.data.clan.attacks,
                        'enemyAttacks': leagueWarResponse.data.opponent.attacks,
                        'totalAttacks': leagueWarResponse.data.teamSize,
                        'stars': leagueWarResponse.data.clan.stars,
                        'enemyStars': leagueWarResponse.data.opponent.stars,
                        'endTime': leagueWarResponse.data.endTime
                    }
                    const message = clanWarLeagueInWarEmbed(data)
                    await clanWarLeagueAnnoncesChannel.send(message)
                    const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
                    await channelPoll.pin()
                    await clanWarLeagueAnnoncesChannel.lastMessage.delete()
                    return
                }
                else if(leagueWarResponse.data.opponent.name === 'SN3T'){
                    const data ={
                        'starsPerAttack':(leagueWarResponse.data.opponent.stars/leagueWarResponse.data.opponent.attacks).toFixed(2),
                        'starsPerAttackEnemy':(leagueWarResponse.data.clan.stars/leagueWarResponse.data.clan.attacks).toFixed(2),
                        "destruction":leagueWarResponse.data.opponent.destructionPercentage.toFixed(2),
                        "destructionEnemy":leagueWarResponse.data.clan.destructionPercentage.toFixed(2),
                        'day': i+1,
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