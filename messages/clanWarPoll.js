const { MessageEmbed } = require('discord.js');

module.exports = (event) => {


    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`[PHASE VOTE]** ** ⚔ Votation Prochaine ${event} ⚔`)
        .addField(`** \n**Serais-tu disponible?`, "** **", false)
        .setTimestamp(new Date())

    switch (event) {

        case 'GDC':
            embed.setDescription(`Comme vous le savez, la guerre s'est terminé, et nous voulons savoir qui serait dispo pour la prochaine`)

            break;
        case 'LDC':
            embed.setDescription(`Nous sommes en début de mois et l'inscription à la LDC a commencé, veuillez bien voter si vous souhaitez être recruté`)

        default:
            break;
    }

    const poll = {
        "embeds": [embed],
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