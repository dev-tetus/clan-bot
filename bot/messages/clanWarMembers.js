const { MessageEmbed } = require('discord.js');

module.exports = (event) => {

    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setDescription(`Liste joueurs recrutés`)
        .setTimestamp()

    switch (event) {
        case 'GDC':
            embed.setTitle(`Joueurs prochaine GDC`)
            break;
        case 'LDC':
            embed.setTitle(`Joueurs prochaine LDC`)

        default:
            break;
    }

    const msg = {
        "embeds": [embed],
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
    return msg
}



