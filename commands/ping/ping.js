const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "ping",
    description: "returns websocket ping",
    type: 'CHAT_INPUT',
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ephemeral:true}).catch(() => {});
        await interaction.followUp({content:`${client.ws.ping}ms!`})
        await interaction.deleteReply()
    },  
};