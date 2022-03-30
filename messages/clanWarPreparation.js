const { MessageEmbed } = require('discord.js');

module.exports = (data) => {
    const startTime = new Date(parseInt(data.startTime.substr(0, 4)),
        parseInt(data.startTime.substr(4, 2)) - 1,
        parseInt(data.startTime.substr(6, 2)),
        parseInt(data.startTime.substr(9, 2)) + 2,
        parseInt(data.startTime.substr(11, 2)),
        parseInt(data.startTime.substr(13, 2))
    )
    const today = new Date();
    const days = parseInt((startTime - today) / (1000 * 60 * 60 * 24));
    const hours = parseInt(Math.abs(startTime - today) / (1000 * 60 * 60) % 24);
    const minutes = parseInt(Math.abs(startTime.getTime() - today.getTime()) / (1000 * 60) % 60);
    const seconds = parseInt(Math.abs(startTime.getTime() - today.getTime()) / (1000) % 60);


    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`[PHASE PRÉPARATION] **    ** ⚔  GDC contre ${data.opponent.name}  ⚔`)
        .setDescription(`Il reste ${days > 0 ? days + ' jour(s) ' : ''}${hours > 0 ? hours + ' heure(s) et ' : ''} ${minutes > 0 || (minutes == 0 && hours > 0) ? minutes + ' minute(s)' : ''} pour que la phase de préparation se termine, pensez à demander les troupes les plus adaptées à vos villages lors des défenses!`)
        .setTimestamp()

    const poll = {
        "embeds": [embed]
    }
    return poll
}