const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('../../axios/axios');

module.exports = {
    name: "donations",
    description: "Donne les donations moyenne du clan",
    type: 'CHAT_INPUT',
    options: [{
        required:false,
        name: 'joueur',
        type: 6,
        description: 'Écrivez le nom Discord du membre que vous recherchez'
    }],
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ephemeral:true}).catch(() => {});
        console.log(args);

        const clanMembersResponse = await axios.get(`/clans/${process.env.CLAN_TAG}`)

        if (args.length > 0) {
            const user = await interaction.guild.members.fetch(args[0])
            for(var member of clanMembersResponse.data.memberList){
                if (member.name === user.displayName) {
                    return await interaction.followUp({content:`🔥 ${member.name} pour le moment a donné ${member.donations} troupes! A aussi reçu ${member.donationsReceived} troupes!`})
                }
            }
            return await interaction.followUp({content:`⁉ Désole, mais le joueur ${user} n'est pas dans le clan!`})
        } 
        else{
            var total = 0
            for(var member of clanMembersResponse.data.memberList){
                total += member.donations
            }
            const avg =  total/clanMembersResponse.data.members
            return await interaction.followUp({content:`🔥 Le clan une moyenne de ${avg.toFixed(0)} troupes données par joueur! 🔥`})
        }

    },  
};