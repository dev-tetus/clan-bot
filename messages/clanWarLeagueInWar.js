const { MessageEmbed } = require('discord.js');

module.exports = (data) => {
    const startTime = new Date(parseInt(data.endTime.substr(0, 4)),
        parseInt(data.endTime.substr(4, 2)) - 1,
        parseInt(data.endTime.substr(6, 2)),
        parseInt(data.endTime.substr(9, 2)) + 2,
        parseInt(data.endTime.substr(11, 2)),
        parseInt(data.endTime.substr(13, 2))
    )
    const today = new Date();
    const days = parseInt((startTime - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt(Math.abs(startTime - today) / (1000 * 60 * 60) % 24);
    const minutes = parseInt(Math.abs(startTime.getTime() - today.getTime()) / (1000 * 60) % 60);
    const seconds = parseInt(Math.abs(startTime.getTime() - today.getTime()) / (1000) % 60);

    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`[PHASE GUERRE]**   ** ⚔ LDC ⚔ \n\n SN3T ⭐ ${data.stars} - ${data.enemyStars} ⭐ ${data.opponent} **             **`)
        .setDescription(`\n⌛**${days > 0 ? days + ' jour(s) ' : ''}${hours > 0 ? hours + ' heure(s) et ' : ''} ${minutes > 0 || (minutes == 0 && hours > 0) ? minutes + ' minute(s)' : ''}**\n\n⚔ **${data.attacks}/${data.totalAttacks}** attaques\n\n⚔ **${data.enemyAttacks}/${data.totalAttacks}** attaques ennemies`)

    const poll = {
        "embeds": [embed]
    }
    return poll
}