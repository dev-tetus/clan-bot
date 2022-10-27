const { MessageEmbed } = require('discord.js');

module.exports = (data, warType) =>{
    var counter = 0
    var embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`🔥 Joueurs Recrutés prochaine ${warType}🔥`)
        .setThumbnail("attachment://Logo.png")

        for(var player of data){
            embed.addField(`\u200B`, `**${player}**`, inline=true)
            counter++
            if(counter%2 == 0){
                embed.addField(`\u200B`, `\u200B`, inline=true)
                counter=0
            }
        }


    const msg = {
        "embeds": [embed]
    }
    return msg
}