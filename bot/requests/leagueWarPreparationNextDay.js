const {axiosBase} = require('../axios/axios')
const clanWarLeagueInWarEmbed = require('../messages/inWar/clanWarLeagueInWar')

module.exports = async (clanWarLeagueAnnoncesChannel) =>{
    const leagueResponse = await axios.get(`/clans/${process.env.CLAN_TAG}/currentwar/leaguegroup`)
    const rounds = leagueResponse.data.rounds

    rounds.forEach(async (round, i) =>{
        
         round.warTags.forEach(async warLeagueTag => {
            
            var leagueWarResponse = await axiosBase().get(`/clanwarleagues/wars/${warLeagueTag.replace('#','%23')}`)
            if(leagueWarResponse.data.state === 'preparation'){
                const data ={
                    'day': i +1,
                    'opponent':0,
                    'attacks': 0,
                    'enemyAttacks': 0,
                    'totalAttacks': 0,
                    'stars': 0,
                    'enemyStars': 0,
                    'endTime': 0,
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