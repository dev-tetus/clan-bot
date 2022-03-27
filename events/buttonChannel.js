require('dotenv').config()
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const axios = require('../axios/axios')

module.exports = async (client, interaction) =>{
    const welcomeChannel = await client.channels.fetch('957073975891091486')
    const messages = await welcomeChannel.messages.fetch()



    switch(interaction.message.id){
        case messages.first().id:
            const user = interaction.member
            console.log(user);
            if (interaction.customId === '0'){
                if(user._roles && user.roles.cache.some(role => role.name === 'Invité')){
                    interaction.reply({content:`T'es déjà dans le clan ${interaction.member}...`,ephemeral:true})
                }
                else{
                    let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                    await user.roles.add(role);
                    interaction.reply({content:`Ça y est ${interaction.member}, tu as désormais le rôle ${role}`,ephemeral:true})
                }
        }
            else{
                let role = interaction.guild.roles.cache.find(r => r.name === "Invité");
                const isInvite = user.roles.cache.has(role.id)
                console.log(isInvite);
                console.log(user._roles);
                console.log(user._roles && true);
                if(user._roles.length > 0 && !isInvite){
                    interaction.reply({content:`T'es déjà dans le clan ${interaction.member}...`,ephemeral:true})
                }
                else{
                    
                    if(isInvite) await user.roles.remove(role);
                    const player_tags = await axios.get(`/clans/${process.env.CLAN_TAG}/members`)
                    dm = await user.createDM(true)
                   
                    const messages = await dm.messages.fetch()
                    if (messages.size > 0) {
    
                        for (const message of messages){
                            if (message[1].author.bot === true){
                                await message[1].delete();
                            }
                        }
                    }
                    
                    var options = []
                    player_tags.data.items.forEach(player =>{
                        let {tag, name, role} = player
                        let option = {
                            label: name,
                            value: tag
                        }
                        options.push(option)
                        console.log(name); 
                    })
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('player-selection')
                                .setPlaceholder('Sélectionnez votre nom')
                                .addOptions(options),
                        );
                    dm.send({components:[row]})

                }
            }

    }
}