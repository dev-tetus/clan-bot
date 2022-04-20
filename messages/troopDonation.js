const { MessageEmbed } = require('discord.js');

module.exports = (data) => {

    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`DONATION`)
        .setDescription(`⚡ ${data.player} veut donner des troupes.`)
        .setTimestamp()

    const donationMessage = {
        "embeds": [embed]
    }
    return donationMessage
}