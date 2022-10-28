const { MessageEmbed } = require('discord.js');

module.exports = (data, inWar=true) => {
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
        if (inWar){
            embed.setDescription(`***La Ligue de Clans est en cours...***\n\n⌛**${days > 0 ? days + ' jour(s) ' : ''}${hours > 0 ? hours + ' heure(s) et ' : ''} ${minutes > 0 || (minutes == 0 && hours > 0) ? minutes + ' minute(s)' : ''}\n\n**\n\n`)
            .setTitle(`[PHASE GUERRE] ** ** ⚔ LDC J-${data.day} ⚔ ** ** SN3T ⭐ ${data.stars} - ${data.enemyStars} ⭐ ${data.opponent}`)
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
    }
    else{
        embed.setDescription(`***La bataille contre ${data.opponent} va bientôt commencer...***\n\n⌛**${days > 0 ? days + ' jour(s) ' : ''}${hours > 0 ? hours + ' heure(s) et ' : ''} ${minutes > 0 || (minutes == 0 && hours > 0) ? minutes + ' minute(s)' : ''}\n\n**\n\n`)
        .setTitle(`[PHASE PRÉPARATION] ** ** ⚔ LDC J-${data.day} ⚔ ** ** SN3T ⭐ ${data.stars} - ${data.enemyStars} ⭐ ${data.opponent}`)
        .setFields([
            {
                name: `⚠️ __Vérifiez__ que vous avez des troupes pour défendre dans vos CDC pour le jour ${data.day}`,
                value: '\u200B',
                inline: false
            },
            {
                name: `✅ Demandez vos troupes si jamais nous avons oublié.`,
                value: '\u200B',
                inline: false
            },
            {
                name: `⚡ De préference du bas vers le haut`,
                value: '\u200B',
                inline: false
            },
            {
                name: `❓ Pour changement de VS consultez-le avec les C.A. et le joueur correspondant`,
                value: '\u200B',
                inline: false
            }
        ])

    }
    const poll = {
        "embeds": [embed]
    }
    return poll
}