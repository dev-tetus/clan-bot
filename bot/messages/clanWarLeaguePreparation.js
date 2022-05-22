const { MessageEmbed } = require('discord.js');

module.exports = (data) => {

    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`[PHASE PRÉPARATION] **    ** ⚔ LDC ⚔`)
        .setDescription(`La Ligue de Clans va bientôt commencer, pensez bien vos attaques et n'hésitez pas à demander quoi que ce soit!`)
        .setTimestamp()

    const poll = {
        "embeds": [embed]
    }
    return poll
}