const { MessageEmbed,MessageAttachment } = require('discord.js');

const file = new MessageAttachment('./assets/Logo.png');



module.exports = (data) => {

    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`🔥 DONATION 🔥`)
        .setDescription(`⚡ **${data.player}** VEUT **DONNER** DES TROUPES ⚡\n\n*-------------------------*`)
        .setThumbnail("attachment://Logo.png")
        
        console.log(data);
        if(data.troops.length > 0){
            data.troops.forEach((troop,i) =>{
                if(i < data.troops.length -1){
                    embed.addField(troop,'\u200B',false)
                }
                else{
                    embed.addField(troop,'*-----------*',false)
                }
            })
            // embed.addField('*-----------*','\u200B',false)
        }
        if(data.darktroops.length > 0){
            data.darktroops.forEach((troop,i) =>{
                if(i < data.darktroops.length -1){
                    embed.addField(troop,'\u200B',false)
                }
                else{
                    embed.addField(troop,'*-----------*',false)
                }
            })
        }
        if(data.potions.length > 0){
            data.potions.forEach((potion,i) =>{
                if(i < data.potions.length -1){
                    embed.addField(potion,'\u200B',false)
                }
                else{
                    embed.addField(potion,'*-----------*',false)
                }

            })
        }
        if(data.siegeMachines.length > 0){
            data.siegeMachines.forEach((machine,i) =>{
                if(i < data.siegeMachines.length -1){
                    embed.addField(machine,'\u200B',false)
                }
                else{
                    embed.addField(machine,'*-----------*',false)
                }

            })
        }

    const donationMessage = {
        "embeds": [embed],
        files:[file]
    }
    return donationMessage
}