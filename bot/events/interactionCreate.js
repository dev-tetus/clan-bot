require('dotenv').config()
const { MessageCollector } = require('discord.js')

const axios = require('../axios/axios')
const client = require("../index");

const buttonInteraction = require('../interactions/buttonInteraction.js')
const menuSelectionInteraction = require('../interactions/menuSelectionInteraction.js')
const slashCommandInteraction = require('../interactions/slashCommandInteraction.js')

client.on("interactionCreate", async (interaction) => {
    try {
        
        // Slash Command Handling
        if (interaction.isCommand()) {
            // await interaction.deferReply({ephemeral: true})
            slashCommandInteraction(client, interaction)
        }
        else if (interaction.isButton()) {
            await interaction.deferReply({ephemeral: true})
            await buttonInteraction(client, interaction)
        }
        else if (interaction.isSelectMenu()) {
            await interaction.deferReply({ephemeral: true})

            await menuSelectionInteraction(client, interaction)
        }

        // Context Menu Handling
        else if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    } catch (error) {
        console.log(error);
        interaction.editReply({content:`Désolé, une erreur est parvenue, veuillez attendre un instant et réessayer, merci!`, ephemeral: true})
        .catch(e => console.log(e))
    }
    
});

