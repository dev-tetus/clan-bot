const axios = require('../../axios/axios');

module.exports = {
    name: "points",
    description: "Affiche le nombre de trophées du clan",
    type: 'CHAT_INPUT',
    options: [{
        required: false,
        name: 'joueur',
        type: 6,
        description: 'Affiche le nombre de trophées du joueur'
    }],

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });

        const clanMembersResponse = await axios.get(`/clans/${process.env.CLAN_TAG}`)

        if (args.length > 0) {
            const user = await interaction.guild.members.fetch(args[0])
            for (var member of clanMembersResponse.data.memberList) {
                if (member.name === user.displayName) {
                    return await interaction.followUp({ content: `🏆 ${member.name} a actuellement **${member.trophies}**! 🏆` })
                }
            }
            return await interaction.followUp({ content: `⁉ Désole, mais le joueur ${user} n'est pas dans le clan!` })
        }
        else {
            return await interaction.followUp({ content: `🏆 Le clan a actuellment un total de **${clanMembersResponse.data.clanPoints}** trophées 🏆` })
        }
    }
}