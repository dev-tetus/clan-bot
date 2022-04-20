const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('../../axios/axios');

const elixirTroops=[
    {name:'barbarian',fr:'Barbares'},
    {name:'archer',fr:'Archers'},
    {name:'giant',fr:'Géants'},
    {name:'gobelin',fr:'Gobelins'},
    {name:'wallbreaker',fr:'Casse-briques'},
    {name:'balloon',fr:'Ballons'},
    {name:'wizard',fr:'Sorciers'},
    {name:'healer',fr:'Guérisseuses'},
    {name:'pekka',fr:'P.E.K.K.A.'},
    {name:'babyDragon',fr:'Bébés dragons'},
    {name:'electrodragon',fr:'Électrodragons'},
    {name:'yeti',fr:'Yetis'},
]

const darkTroops = [
    {name:'minion',fr:'Gargouilles'},
    {name:'hog',fr:'Cochons'},
    {name:'valkyrie',fr:'Valkyries'},
    {name:'golem',fr:'Golems'},
    {name:'witch',fr:'Sorcières'},
    {name:'lavaHound',fr:'Molosses de lave'},
    {name:'bowler',fr:'Boulistes'},
    {name:'iceGolem',fr:'Golems de glace'},
    {name:'headhunter',fr:'Chasseuses de têtes'},
]
const spells = [
    {name:'jumpSpell',fr:'Sorts de saut'},
    {name:'lightningSpell',fr:'Sorts de foudre'},
    {name:'freezeSpell',fr:'Sorts de gèle'},
    {name:'rageSpell',fr:'Sorts de rage'},
    {name:'earthquakeSpell',fr:'Sorts sismiques'},
    {name:'healingSpell',fr:'Sorts de guérison'},
    {name:'hasteSpell',fr:'Sorts de précipitation'},
    {name:'cloneSpell',fr:'Sorts de clonage'},
    {name:'poisonSpell',fr:'Sorts de poison'},
    {name:'batSpell',fr:'Sorts de bats'},
    {name:'invisibilitySpell',fr:'Sorts d\'invisibilité'},
    {name:'skeletonSpell',fr:'Sorts de squelettes'},
]

module.exports = {

    
    name: "donner",
    description: "Envoie une annonce pour tout le monde avec les troupes a donner",
    type: 'CHAT_INPUT',
    
    run: async (client, interaction, args) => {
        await interaction.deferReply({ephemeral:false}).catch(() => {});

        const clanMembersResponse = await axios.get(`/clans/${process.env.CLAN_TAG}`)
        
        const troopSelection = await interaction.followUp({content:`S'il te plaît, choisis le type d'emplacement à donner (Elixir, elixir noir ou/et des sorts)`})
        var i= 0

        

        
        const filter = (reaction, user) => {
            return user.id === interaction.user.id
        };
        let collector = troopSelection.createReactionCollector({filter,max:4,time: 60000, idle:10000, dispose:true});
        collector.on('remove', (reaction, user) => {
            console.log('removed');
        });

        collector.on('collect', (reaction, user) => {

            if(reaction._emoji.name === 'Checkmark'){
                console.log('ended selection');
                collector.stop()
            }
        });

        var troops = []
        var darktroops = []
        var potions = []
        var selectionCounterTrigger = 0

        collector.on('end', async collectedOuter => {
            console.log(collectedOuter);

            await troopSelection.delete()

            if((collector.total === 0) || (collector.total === 1 && collectedOuter.first()._emoji.name === 'Checkmark')){
                console.log('oui');
                await interaction.followUp({content:`Désolé ${interaction.user} mais aucun type n'a été sélectionné...`});
                return
            }

            for(var reaction of collectedOuter){

                switch(reaction[1]._emoji.name) {

                    case 'elixir':
                        console.log('elixir selection');
                        const elixirSelection = await interaction.followUp({content:`S'il te plaît, choisis les troupes à donner`})
                        let collectorElixir = elixirSelection.createReactionCollector({filter,max:3,time: 60000, idle:10000,dispose:true});
                        await collectorElixir.on('collect', (reaction, user) => {

                            if(reaction._emoji.name === 'Checkmark'){
                                console.log('ended selection');
                                collectorElixir.stop()
                            }
                        });

                        await collectorElixir.on('end', async collected =>{
                            if((collectorElixir.total === 0) || (collectorElixir.total === 1 && collected.first()._emoji.name === 'Checkmark')){
                                await interaction.followUp({content:`Désolé ${interaction.user} mais aucun type n'a été sélectionné...`});
                                await elixirSelection.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for(var elixirTroop of collected){
                                if(elixirTroop[1]._emoji.name!= 'Checkmark'){
                                    let troop = elixirTroops.find(t => t.name === elixirTroop[1]._emoji.name)
                                    console.log(troop);
                                    troops.push(troop.fr)
                                }
                            }
                            
                            try {
                                if ((selectionCounterTrigger === collector.total -1 && (collected.find(t=> t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {
                                    console.log('send message');
                                    console.log(troops);
                                    console.log(darktroops);
                                    console.log(potions);

                                }
                                
                            } catch (error) {
                                if(selectionCounterTrigger === collector.total){
                                    console.log('send message');
                                    console.log(troops);
                                    console.log(darktroops);
                                    console.log(potions);
                                }
                            }

                        })
                        for(var troop of elixirTroops){
                            await elixirSelection.react(`${client.emojis.cache.find(emoji => emoji.name == troop.name)}`)
                        }
                        await elixirSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)

                        break;

                    case 'darkElixir':
                        console.log('darkElixir selection');
                        const darkElixirSelection = await interaction.followUp({content:`S'il te plaît, choisis les troupes à donner`})

                        let collectorDarkElixir = darkElixirSelection.createReactionCollector({filter,max:3,time: 60000, idle:10000,dispose:true});

                        await collectorDarkElixir.on('collect', (reaction, user) => {

                            if(reaction._emoji.name === 'Checkmark'){
                                console.log('ended selection');
                                collectorDarkElixir.stop()
                            }
                        });

                        await collectorDarkElixir.on('end', async collected =>{
                            if((collectorDarkElixir.total === 0) || (collectorDarkElixir.total === 1 && collected.first()._emoji.name === 'Checkmark')){
                                await interaction.followUp({content:`Désolé ${interaction.user} mais aucun type n'a été sélectionné...`});
                                await darkElixirSelection.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for(var elixirTroop of collected){
                                if(elixirTroop[1]._emoji.name != 'Checkmark'){
                                    let troop = darkTroops.find(t => t.name === elixirTroop[1]._emoji.name)
                                    console.log(troop);
                                    darktroops.push(troop.fr)
                                }
                            }
                            try {
                                if ((selectionCounterTrigger === collector.total -1 && (collected.find(t=> t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {
                                    console.log('send message');
                                    console.log(troops);
                                    console.log(darktroops);
                                    console.log(potions);
                                }
                                
                            } catch (error) {
                                if(selectionCounterTrigger === collector.total){
                                    console.log('send message');
                                    console.log(troops);
                                    console.log(darktroops);
                                    console.log(potions);
                                }
                            }
                        })
                        for(var troop of darkTroops){
                            await darkElixirSelection.react(`${await client.emojis.cache.find(emoji => emoji.name == troop.name)}`)
                        }
                        await darkElixirSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)

                        break;
                        
                    case 'potion':
                        const potionSelection = await interaction.followUp({content:`S'il te plaît, choisis les sorts à donner`})
                        let collectorPotion = potionSelection.createReactionCollector({filter,max:3,time: 60000, idle:10000,dispose:true});

                        await collectorPotion.on('collect', (reaction, user) => {
                            if(reaction._emoji.name === 'Checkmark'){
                                console.log('ended selection');
                                collectorPotion.stop()
                            }
                        });

                        await collectorPotion.on('end', async collected =>{
                            if((collectorPotion.total === 0) || (collectorPotion.total === 1 && collected.first()._emoji.name === 'Checkmark')){
                                await interaction.followUp({content:`Désolé ${interaction.user} mais aucun type n'a été sélectionné...`});
                                await potionSelection.delete()
                                return
                            }
                            selectionCounterTrigger++
                            for(var spell of collected){
                                if(spell[1]._emoji.name != 'Checkmark'){
                                    let troop = spells.find(t => t.name === spell[1]._emoji.name)
                                    potions.push(troop.fr)
                                }
                            }
                            try {
                                if ((selectionCounterTrigger === collector.total -1 && (collected.find(t=> t._emoji.name == 'Checkmark')._emoji.name == 'Checkmark'))) {
                                    console.log('send message');
                                    console.log(troops);
                                    console.log(darktroops);
                                    console.log(potions);
                                }
                                
                            } catch (error) {
                                if(selectionCounterTrigger === collector.total){
                                    console.log('send message');
                                    console.log(troops);
                                    console.log(darktroops);
                                    console.log(potions);
                                }
                            }

                        })
                        for(var spell of spells){
                            await potionSelection.react(`${client.emojis.cache.find(emoji => emoji.name == spell.name)}`)
                        }
                        await potionSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)

                        break;
                    default:
                        break;
                }
            }

        });
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'elixir')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'darkElixir')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'potion')}`)
        await troopSelection.react(`${client.emojis.cache.find(emoji => emoji.name == 'Checkmark')}`)
        
        console.log(troops);
        console.log(darktroops);
        console.log(potions);

    },  
};