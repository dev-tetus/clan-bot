const {MessageEmbed} = require('discord.js');

module.exports = () =>{

    const embed = new MessageEmbed()
	.setColor('#c7c7c7')
	.setTitle(`**               ** ⚔ Votation Prochaine GDC ⚔`)
	.setDescription(`Comme vous le savez, la guerre s'est terminé, et nous voulons savoir qui serait dispo pour la prochaine`)
    .addField(`** \n**Serais-tu disponible?`,"** **",false)
    .setTimestamp()

    const poll = {
        "embeds":[embed],
        "components": [
        {
            "type": 1,
            "components": [
            {
                "style": 1,
                "label": `Oui`,
                "custom_id": `war-1`,
                "disabled": false,
                "emoji": {
                "id": null,
                "name": `👍`
                },
                "type": 2
            },
            {
                "style": 1,
                "label": `Non`,
                "custom_id": `war-0`,
                "disabled": false,
                "emoji": {
                "id": null,
                "name": `👎`
                },
                "type": 2
            }]
        }],
    }
    return poll
}