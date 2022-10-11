const { MessageEmbed } = require('discord.js');

module.exports = (response) => {
    const data ={
        'starsPerAttack':(response.data.clan.stars/response.data.clan.attacks).toFixed(2),
        'starsPerAttackEnemy':(response.data.opponent.stars/response.data.opponent.attacks).toFixed(2),
        "destruction":response.data.clan.destructionPercentage.toFixed(2),
        "destructionEnemy":response.data.opponent.destructionPercentage.toFixed(2),
        'opponent':response.data.opponent.name,
        'attacks': response.data.clan.attacks,
        'enemyAttacks': response.data.opponent.attacks,
        'totalAttacks': response.data.teamSize,
        'stars': response.data.clan.stars,
        'enemyStars': response.data.opponent.stars,
        'endTime': response.data.endTime
    }
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
        embed.setDescription(`***La guerre de clans est en cours...***\n\n⌛**${days > 0 ? days + ' jour(s) ' : ''}${hours > 0 ? hours + ' heure(s) et ' : ''} ${minutes > 0 || (minutes == 0 && hours > 0) ? minutes + ' minute(s)' : ''}\n\n**\n\n`)
        .setTitle(`[PHASE GUERRE] ** ** ⚔ GDC ⚔ ** ** SN3T ⭐ ${data.stars} - ${data.enemyStars} ⭐ ${data.opponent}`)
        .setFields([
            {
                "name": "🏳️ __SN3T__",
                "value": '\u200B',
                "inline": true
            },
            {
                "name": `🏴 __${data.opponent}__`,
                "value": '\u200B',
                "inline": true
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            },
            {
                "name": `⭐ ${data.starsPerAttack}  étoiles par attaque`,
                "value": '\u200B',
                "inline": true
            },
            {
                "name": `⭐ ${data.starsPerAttackEnemy} étoiles par attaque`,
                "value": '\u200B',
                "inline": true
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            },
            {
                "name": `💥 ${data.destruction} % déstruction`,
                "value": '\u200B',
                "inline": true
            },
            {
                "name": `💥 ${data.destructionEnemy} % déstruction`,
                "value": '\u200B',
                "inline": true
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            },
            {
                "name": `⚔ **${data.attacks}/${data.totalAttacks}**`,
                "value": '\u200B',
                "inline": true
            },
            {
                "name": `⚔ **${data.enemyAttacks}/${data.totalAttacks}**`,
                "value": '\u200B',
                "inline": true
            },
            {
                name: '\u200B',
                value: '\u200B',
                inline: true
            }
        ])
    
    const poll = {
        "embeds": [embed]
    }
    return poll
}