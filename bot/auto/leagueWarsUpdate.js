const schedule = require('node-schedule')
const {axiosInternal} = require('../axios/axios')
const rule = new schedule.RecurrenceRule()
rule.hour = '23'
rule.minute = '30'
rule.tz = 'Europe/Madrid'

async function updateLeagueWars(){
    const today = new Date().getDate()
    if(today >= 1 && today <= 9){
        await axiosInternal().get('/api/clan/league/wars/update')
        console.log('League wars updated...');

    }
}

module.exports = async () =>{
    
    schedule.scheduleJob(rule, updateLeagueWars)

} 