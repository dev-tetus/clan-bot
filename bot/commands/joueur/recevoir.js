const { MessageActionRow, MessageButton } = require('discord.js');



const elixirTroops = [
    { name: 'barbarian', fr: 'Barbares' },
    { name: 'archer', fr: 'Archers' },
    { name: 'giant', fr: 'Géants' },
    { name: 'gobelin', fr: 'Gobelins' },
    { name: 'wallbreaker', fr: 'Casse-briques' },
    { name: 'balloon', fr: 'Ballons' },
    { name: 'wizard', fr: 'Sorciers' },
    { name: 'healer', fr: 'Guérisseuses' },
    { name: 'pekka', fr: 'P.E.K.K.A.' },
    { name: 'babyDragon', fr: 'Bébés dragons' },
    { name: 'electrodragon', fr: 'Électrodragons' },
    { name: 'yeti', fr: 'Yetis' },
]

const darkTroops = [
    { name: 'minion', fr: 'Gargouilles' },
    { name: 'hog', fr: 'Cochons' },
    { name: 'valkyrie', fr: 'Valkyries' },
    { name: 'golem', fr: 'Golems' },
    { name: 'witch', fr: 'Sorcières' },
    { name: 'lavaHound', fr: 'Molosses de lave' },
    { name: 'bowler', fr: 'Boulistes' },
    { name: 'iceGolem', fr: 'Golems de glace' },
    { name: 'headhunter', fr: 'Chasseuses de têtes' },
]
const spells = [
    { name: 'jumpSpell', fr: 'Sorts de saut' },
    { name: 'lightningSpell', fr: 'Sorts de foudre' },
    { name: 'freezeSpell', fr: 'Sorts de gèle' },
    { name: 'rageSpell', fr: 'Sorts de rage' },
    { name: 'earthquakeSpell', fr: 'Sorts sismiques' },
    { name: 'healingSpell', fr: 'Sorts de guérison' },
    { name: 'hasteSpell', fr: 'Sorts de précipitation' },
    { name: 'cloneSpell', fr: 'Sorts de clonage' },
    { name: 'poisonSpell', fr: 'Sorts de poison' },
    { name: 'batSpell', fr: 'Sorts de bats' },
    { name: 'invisibilitySpell', fr: 'Sorts d\'invisibilité' },
    { name: 'skeletonSpell', fr: 'Sorts de squelettes' },
]

const machines = [
    { name: 'flameFlinger', fr: 'Catapulte d\'esprit' },
    { name: 'siegeBarracks', fr: 'Caserne de siège' },
    { name: 'stoneSlammer', fr: 'Broyeur de pierres​' },
    { name: 'logLauncher', fr: 'Lance-bûches' },
    { name: 'wallWrecker', fr: 'Démolisseur' },
    { name: 'battleBlimp', fr: 'Dirigeable de combat' },
]

async function createPrivateChannel(client, interaction) {
    if (interaction.guild.channels.cache.find(channel => channel.name === `🔥 demande-${interaction.member.nickname}`)) {
        return interaction.followUp({ content: 'you already have a ticket, please close your existing ticket first before opening a new one!', ephemeral: true });
    }

    return interaction.channel.parent.createChannel(`🔥 demande-${interaction.member.nickname}`, {
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
            },
            {
                id: interaction.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
        ],
        type: 'text',
    }).then(async channel => {
        await interaction.followUp({ content: `Votre channel temporaire a bien été crée, click ici 👉 ${channel} pour y accéder diréctement`, ephemeral: true });
        channel.send(`Salut ${interaction.member}, veuillez bien répondre en réagissant au messages envoyés par le bot pour compléter ta demande!`);
        return channel
    });
}

module.exports = {


    name: "recevoir",
    description: "Envoie une annonce pour tout le monde avec les troupes demandées",
    type: 'CHAT_INPUT',

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        const ticketChannel = await createPrivateChannel(client, interaction)
        const chatChannel = await client.channels.cache.find(channel => channel.name === 'chat')


        //! To implement with emojis
        //Ask whether is CWL or Clan games or nornal war
        // const rowButtons = new MessageActionRow()
        //     .addComponents([
        //         new MessageButton()
        //             .setCustomId('1')
        //             .setLabel('Matchmaking')
        //             .setStyle('PRIMARY'),
        //         new MessageButton()
        //             .setCustomId('2')
        //             .setLabel('GDC')
        //             .setStyle('PRIMARY'),
        //         new MessageButton()
        //             .setCustomId('3')
        //             .setLabel('JDC')
        //             .setStyle('PRIMARY'),
        //         new MessageButton()
        //             .setCustomId('4')
        //             .setLabel('LDC')
        //             .setStyle('PRIMARY'),
        //     ]
        //     );
        // await ticketChannel.send({
        //     content: "Choisis le type d'événement pour ta demande",
        //     components: [rowButtons]
        // })


        const troopSelection = await ticketChannel.send({ content: `S'il te plaît, choisis le type d'emplacement à demander (Elixir, Elixir Noir, Sorts et/ou Engins de Siège)` })

        const filter = (reaction, user) => {
            return user.id === interaction.user.id
        };
        let collector = troopSelection.createReactionCollector({ filter, max: 5, time: 60000, idle: 10000, dispose: true });
        collector.on('remove', (reaction, user) => {
            console.log('removed');
        });

        collector.on('collect', (reaction, user) => {

            if (reaction._emoji.name === 'Checkmark') {
                console.log('ended selection');
                collector.stop()
            }
        });

        var troops = []
        var darktroops = []
        var potions = []
        var siegeMachines = []
        var selectionCounterTrigger = 0

        collector.on('end', async collectedOuter => {

            await troopSelection.delete()

            if ((collector.total === 0) || (collector.total === 1 && collectedOuter.first()._emoji.name === 'Checkmark')) {
                await interaction.followUp({ content: `Désolé ${interaction.user} mais aucun type n'a été sélectionné...`, ephemeral: true});
                await ticketChannel.delete()

                return
            }

            for (var reaction of collectedOuter) {

                switch (reaction[1]._emoji.name) {

                    case 'elixir':
                        //! Case if it has been removed
                        if (reaction[1].count === 1) {
                            break;
                        }

                        const elixirSelection = await ticketChannel.send({ content: `S'il te plaît, choisis les troupes à demander`, ephemeral: true })
                        let collectorElixir = elixirSelection.createReactionCollector({ filter, max: 20, time: 120000, idle: 60000, dispose: true });
                        await collectorElixir.on('collect', (reaction, user) => {

                            if (reaction._emoji.name === 'Checkmark') {
                                collectorElixir.stop()
                            }
                        });

                        await collectorElixir.on('end', async collected => {
                            if ((collectorElixir.total === 0) || (collectorElixir.total === 1 && collected.first()._emoji.name === 'Checkmark')) {
                                await interaction.followUp({ content: `Désolé ${interaction.user} mais aucun type n'a été sélectionné...`, ephemeral: true});
                                await elixirSelection.delete()
                                await ticketChannel.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for (var elixirTroop of collected) {
                                if (elixirTroop[1]._emoji.name != 'Checkmark') {
                                    let troop = elixirTroops.find(t => t.name === elixirTroop[1]._emoji.name)
                                    troops.push(troop)

                                }
                            }
                            troops.forEach(t => console.log(t))

                            await elixirSelection.delete()
                            try {
                                if ((selectionCounterTrigger === collector.total - 1 && (collected.find(t => t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()

                                }

                            } catch (error) {
                                if (selectionCounterTrigger === collector.total) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }
                            }

                        })
                        try {
                            await elixirSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)
                            for (var troop of elixirTroops) {
                                await elixirSelection.react(`${client.emojis.cache.find(emoji => emoji.name == troop.name)}`)
                            }

                        } catch (error) {
                            break;
                        }


                        break;

                    case 'darkElixir':
                        if (reaction[1].count === 1) {
                            break;
                        }
                        const darkElixirSelection = await ticketChannel.send({ content: `S'il te plaît, choisis les troupes à demander`, ephemeral: true })

                        let collectorDarkElixir = darkElixirSelection.createReactionCollector({ filter, max: 20, time: 120000, idle: 60000, dispose: true });

                        await collectorDarkElixir.on('collect', (reaction, user) => {

                            if (reaction._emoji.name === 'Checkmark') {
                                collectorDarkElixir.stop()
                            }
                        });

                        await collectorDarkElixir.on('end', async collected => {
                            if ((collectorDarkElixir.total === 0) || (collectorDarkElixir.total === 1 && collected.first()._emoji.name === 'Checkmark')) {
                                await interaction.followUp({ content: `Désolé ${interaction.user} mais aucun type n'a été sélectionné...` ,ephemeral: true});
                                await darkElixirSelection.delete()
                                await ticketChannel.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for (var elixirTroop of collected) {
                                if (elixirTroop[1]._emoji.name != 'Checkmark') {
                                    let troop = darkTroops.find(t => t.name === elixirTroop[1]._emoji.name)
                                    console.log(troop);
                                    darktroops.push(troop)
                                }
                            }

                            await darkElixirSelection.delete()
                            try {
                                if ((selectionCounterTrigger === collector.total - 1 && (collected.find(t => t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }

                            } catch (error) {
                                if (selectionCounterTrigger === collector.total) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }
                            }
                        })
                        try {
                            await darkElixirSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)
                            for (let troop of darkTroops) {
                                await darkElixirSelection.react(`${await client.emojis.cache.find(emoji => emoji.name == troop.name)}`)
                            }

                        } catch (error) {
                            break;
                        }

                        break;

                    case 'potion':
                        if (reaction[1].count === 1) {
                            break;
                        }
                        const potionSelection = await ticketChannel.send({ content: `S'il te plaît, choisis les sorts à demander`, ephemeral: true })
                        let collectorPotion = potionSelection.createReactionCollector({ filter, max: 20, time: 120000, idle: 60000, dispose: true });

                        await collectorPotion.on('collect', (reaction, user) => {
                            if (reaction._emoji.name === 'Checkmark') {
                                console.log('ended selection');
                                collectorPotion.stop()
                            }
                        });

                        await collectorPotion.on('end', async collected => {
                            if ((collectorPotion.total === 0) || (collectorPotion.total === 1 && collected.first()._emoji.name === 'Checkmark')) {
                                await interaction.followUp({ content: `Désolé ${interaction.user} mais aucun type n'a été sélectionné...`,ephemeral: true});
                                await potionSelection.delete()
                                await ticketChannel.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for (var spell of collected) {
                                if (spell[1]._emoji.name != 'Checkmark') {
                                    let troop = spells.find(t => t.name === spell[1]._emoji.name)
                                    potions.push(troop)
                                }
                            }
                            await potionSelection.delete()
                            try {
                                if ((selectionCounterTrigger === collector.total - 1 && (collected.find(t => t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    console.log(messageToSend);
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }

                            } catch (error) {
                                if (selectionCounterTrigger === collector.total) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }
                            }

                        })
                        try {
                            await potionSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)
                            for (var spell of spells) {
                                await potionSelection.react(`${client.emojis.cache.find(emoji => emoji.name == spell.name)}`)
                            }

                        } catch (error) {
                            break
                        }

                        break;

                    case 'workshop':
                        if (reaction[1].count === 1) {
                            break;
                        }
                        const workshopSelection = await ticketChannel.send({ content: `S'il te plaît, choisis les engins de siège à demander`, ephemeral: true })
                        let collectorWorkshop = workshopSelection.createReactionCollector({ filter, max: 20, time: 120000, idle: 60000, dispose: true });

                        await collectorWorkshop.on('collect', (reaction, user) => {
                            if (reaction._emoji.name === 'Checkmark') {
                                console.log('ended selection');
                                collectorWorkshop.stop()
                            }
                        });

                        await collectorWorkshop.on('end', async collected => {
                            if ((collectorWorkshop.total === 0) || (collectorWorkshop.total === 1 && collected.first()._emoji.name === 'Checkmark')) {
                                await interaction.followUp({ content: `Désolé ${interaction.user} mais aucun type n'a été sélectionné...`,ephemeral: true});
                                await workshopSelection.delete()
                                await ticketChannel.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for (var machine of collected) {
                                if (machine[1]._emoji.name != 'Checkmark') {
                                    let troop = machines.find(t => t.name === machine[1]._emoji.name)
                                    siegeMachines.push(troop)
                                }
                            }
                            await workshopSelection.delete()
                            try {
                                if ((selectionCounterTrigger === collector.total - 1 && (collected.find(t => t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    console.log(messageToSend);
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }

                            } catch (error) {
                                if (selectionCounterTrigger === collector.total) {

                                    messageToSend = require('../../messages/troopPetition')({ interaction, player: interaction.member.nickname, troops, darktroops, potions, siegeMachines })
                                    await chatChannel.send(messageToSend)
                                    await ticketChannel.delete()
                                }
                            }

                        })
                        try {
                            await workshopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)
                            for (var machine of machines) {
                                await workshopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == machine.name)}`)
                            }

                        } catch (error) {
                            break
                        }

                        break;

                    default:
                        break;
                }
            }

        });
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'elixir')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'darkElixir')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'potion')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'workshop')}`)

    },
};