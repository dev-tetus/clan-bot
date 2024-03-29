module.exports = async (client, interaction) => {
    const commandChannel = await client.channels.cache.find(ch=>ch.name=='commandes')
    
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
        return interaction.followUp({ content: "An error has occured " });

    const args = [];
    
    if((interaction.channelId != commandChannel.id) /*&& !interaction.member.roles.cache.some(r => r.name == 'Dev')*/){
        return await interaction.reply({ content:"*Les commandes pour le bot ce n'est pas ici*", ephemeral:true})
    }

    for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
                if (x.value) args.push(x.value);
            });
        } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction, args);
}