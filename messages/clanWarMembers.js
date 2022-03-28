const {MessageEmbed} = require('discord.js');

module.exports = () =>{

    const embed = new MessageEmbed()
	.setColor('#c7c7c7')
	.setTitle(`Joueurs prochaine GDC`)
	.setDescription(`Liste joueurs recrutés`)
    .setTimestamp()

    const poll = {
        "embeds":[embed],
        "components": [
        {
            "type": 1,
            "components": [{
            "custom_id": `oui`,
            "placeholder": `Joueurs recrutés`,
            "options": 
            {
                "label": `Pas de joueurs ayant voté`,
                "value": `-1`,
                "default": false
            },
            "min_values": 1,
            "max_values": 1,
            "type": 3
            }]
        },
        {
            "type": 1,
            "components": [{
            "custom_id": `non`,
            "placeholder": `Joueurs non recrutés`,
            "options": 
            {
                "label": `Pas de joueurs ayant voté`,
                "value": `-1`,
                "default": false
            },
            "min_values": 1,
            "max_values": 1,
            "type": 3
            }]
        }],
        
    }
    return poll
}



