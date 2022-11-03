const schedule = require('node-schedule')
const client = require("../index");
const {axiosInternal} = require('../axios/axios')
const rule = new schedule.RecurrenceRule()
rule.hour = '18'
rule.minute = '45'
rule.tz = 'Europe/Madrid'


async function sendDiffusion(){
    const leadersChannel = client.channels.cache.find(ch => ch.name == 'what-doing') 
    axiosInternal().get('/api/clan/diffusion/send').then(async () => await leadersChannel.send({content:"*Les messages d'annonce ont été envoyés...*"}))
    console.log("################\nMessages envoyés...\n################");
}

module.exports = async (client) =>{
    schedule.scheduleJob(rule, sendDiffusion)
}