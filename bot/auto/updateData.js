const schedule = require('node-schedule')
const {axiosInternal} = require('../axios/axios')
const rule = new schedule.RecurrenceRule()
rule.hour = '00'
rule.minute = '15'
rule.tz = 'Europe/Madrid'

async function updateData(){
    axiosInternal().get('/flask/clan/members/update').then((r) => console.log(r))
    axiosInternal().get('/flask/players/update').then((r) => console.log(r))
}

module.exports = async () =>{
    // await updateData()
    schedule.scheduleJob(rule, updateData)

} 