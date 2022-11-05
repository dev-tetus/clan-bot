const {axiosBase} = require('../axios/axios')
const clanWarLeagueInWarEmbed = require('../messages/inWar/clanWarLeagueInWar')
function isClanInWar(data){
    if(data.opponent.name === 'SN3T' || data.clan.name === 'SN3T') return true
    else return false
}
module.exports = async (clanWarLeagueAnnoncesChannel) =>{
    const leagueResponse = await axiosBase().get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    const rounds = leagueResponse.data.rounds

    rounds.forEach(async (round, i) =>{
        
        round.warTags.forEach(async warLeagueTag => {
            
            var leagueWarResponse = await axiosBase().get(`/clanwarleagues/wars/${warLeagueTag.replace('#','%23')}`)
            if(leagueWarResponse.data.state === 'preparation' && isClanInWar(leagueWarResponse.data)){
                const home = leagueWarResponse.data.clan.name ==='SN3T' ? true : false
                const data ={
                    'day': i +1,
                    'opponent':home ? leagueWarResponse.data.opponent.name : leagueWarResponse.data.clan.name,
                    'attacks': 0,
                    'stars': 0,
                    'enemyStars': 0,
                    'endTime':leagueWarResponse.data.endTime
                }
                const message = clanWarLeagueInWarEmbed(data,false)
                await clanWarLeagueAnnoncesChannel.send(message)
                await clanWarLeagueAnnoncesChannel.lastMessage.pin()
                await clanWarLeagueAnnoncesChannel.lastMessage.delete()
                return
            }                
        })

    })
    

}