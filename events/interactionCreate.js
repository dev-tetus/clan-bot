require('dotenv').config()
const { MessageCollector } = require('discord.js')

const axios = require('../axios/axios')
const client = require("../index");

const buttonInteraction = require('../interactions/buttonInteraction.js')
const menuSelectionInteraction = require('../interactions/menuSelectionInteraction.js')
const slashCommandInteraction = require('../interactions/slashCommandInteraction.js')

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        slashCommandInteraction(client, interaction)
    }
    else if (interaction.isButton()) {
        buttonInteraction(client, interaction)
    }
    else if (interaction.isSelectMenu()) {
        menuSelectionInteraction(client, interaction)
    }

    // Context Menu Handling
    else if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});

