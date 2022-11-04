const {axiosBase} = require('../axios/axios')
const clanWarLeagueInWarEmbed = require('../messages/inWar/clanWarLeagueInWar')


async function assignData(home,leagueWarResponse,i){
    const data ={
        'starsPerAttack': home ? (leagueWarResponse.data.clan.stars/leagueWarResponse.data.clan.attacks).toFixed(2) : (leagueWarResponse.data.opponent.stars/leagueWarResponse.data.opponent.attacks).toFixed(2),
        'starsPerAttackEnemy':home ? (leagueWarResponse.data.opponent.stars/leagueWarResponse.data.opponent.attacks).toFixed(2):(leagueWarResponse.data.clan.stars/leagueWarResponse.data.clan.attacks).toFixed(2),
        "destruction":home ? leagueWarResponse.data.clan.destructionPercentage.toFixed(2):leagueWarResponse.data.opponent.destructionPercentage.toFixed(2),
        "destructionEnemy":home ? leagueWarResponse.data.opponent.destructionPercentage.toFixed(2):leagueWarResponse.data.clan.destructionPercentage.toFixed(2),
        'day': i+1,
        'opponent':home ? leagueWarResponse.data.opponent.name:leagueWarResponse.data.clan.name,
        'attacks':home ?  leagueWarResponse.data.clan.attacks:leagueWarResponse.data.opponent.attacks,
        'enemyAttacks':home ?  leagueWarResponse.data.opponent.attacks:leagueWarResponse.data.clan.attacks,
        'totalAttacks':leagueWarResponse.data.teamSize,
        'stars':home ?  leagueWarResponse.data.clan.stars:leagueWarResponse.data.opponent.stars,
        'enemyStars':home ?  leagueWarResponse.data.opponent.stars:leagueWarResponse.data.clan.stars,
        'endTime': leagueWarResponse.data.endTime
    }
    const message = clanWarLeagueInWarEmbed(data)
    await clanWarLeagueAnnoncesChannel.send(message)
    const channelPoll = await clanWarLeagueAnnoncesChannel.lastMessage
    await channelPoll.pin()
    await clanWarLeagueAnnoncesChannel.lastMessage.delete()
    return
}
module.exports = async (clanWarLeagueAnnoncesChannel) =>{
    const leagueResponse = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    const rounds = leagueResponse.data.rounds

    rounds.forEach(async (round,i) =>{
         round.warTags.forEach(async warLeagueTag => {
            var leagueWarResponse = await axiosBase().get(`/clanwarleagues/wars/${warLeagueTag.replace('#','%23')}`)
            if(leagueWarResponse.data.state === 'inWar'){
                if(leagueWarResponse.data.clan.name === 'SN3T'){
                    return assignData(true,leagueWarResponse,i)
                }
                else if(leagueWarResponse.data.opponent.name === 'SN3T'){
                    return assignData(false, leagueWarResponse,i)
                }
            }
        })

    })




}