const { MessageEmbed, MessageAttachment } = require('discord.js');

const file = new MessageAttachment('./assets/Logo.png');



module.exports = (data) => {
    var emoji = null
    // console.log(data.interaction.guild.emojis.cache.find(emoji => emoji.name === 'barbarian'));
    const embed = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`🔥 DEMANDE 🔥`)
        .setDescription(`⚡ **${data.player}** A **BESOIN** DES TROUPES ⚡\n\n*-------------------------*`)
        .setThumbnail("attachment://Logo.png")

    if (data.troops.length > 0) {
        data.troops.forEach((troop, i) => {
            if (i < data.troops.length - 1) {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === troop.name)
                embed.addField(troop.fr, `<:${emoji.name}:${emoji.id}>`, false)
            }
            else {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === troop.name)
                embed.addField(troop.fr, `<:${emoji.name}:${emoji.id}>\n--------------------`, false)
            }
        })
        // embed.addField('*-----------*','\u200B',false)
    }
    if (data.darktroops.length > 0) {
        data.darktroops.forEach((troop, i) => {
            if (i < data.darktroops.length - 1) {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === troop.name)
                embed.addField(troop.fr, `<:${emoji.name}:${emoji.id}>`, false)
            }
            else {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === troop.name)
                embed.addField(troop.fr, `<:${emoji.name}:${emoji.id}>\n--------------------`, false)
            }
        })
    }
    if (data.potions.length > 0) {
        data.potions.forEach((potion, i) => {
            if (i < data.potions.length - 1) {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === potion.name)
                embed.addField(potion.fr, `<:${emoji.name}:${emoji.id}>`, false)
            }
            else {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === potion.name)
                embed.addField(potion.fr, `<:${emoji.name}:${emoji.id}>\n--------------------`, false)
            }

        })
    }
    if (data.siegeMachines.length > 0) {
        data.siegeMachines.forEach((machine, i) => {
            if (i < data.siegeMachines.length - 1) {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === machine.name)
                embed.addField(machine.fr, `<:${emoji.name}:${emoji.id}>`, false)
            }
            else {
                emoji = data.interaction.guild.emojis.cache.find(emoji => emoji.name === machine.name)
                embed.addField(machine.fr, `<:${emoji.name}:${emoji.id}>\n--------------------`, false)
            }

        })
    }
    // console.log(embed);

    const donationMessage = {
        "embeds": [embed],
        files: [file]
    }
    return donationMessage
}