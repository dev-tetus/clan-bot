const { MessageEmbed, Message } = require('discord.js');

module.exports = async (client) =>{
    
    
    
    const embed = new MessageEmbed()
	.setColor('#c7c7c7')
	.setTitle(`**               ** BIENVENUE DANS LE SERVEUR DU CLAN SN3T`)
	.setDescription(`Salut et bienvenue dans notre famille, avant de commencer nous souhaitons savoir un peu plus sur toi afin de pouvoir te donner les rôles appropriés dans le serveur.`)
    .addField(`** \n**Es-tu déjà membre du clan SN3T?`,"** **",false)
    
    const msg = {
        "embeds":[embed],
        "components": [
        {
            "type": 1,
            "components": [
            {
                "style": 1,
                "label": `Oui`,
                "custom_id": `1`,
                "disabled": false,
                "emoji": {
                "id": null,
                "name": `👍`
                },
                "type": 2
            },
            {
                "style": 1,
                "label": `Non`,
                "custom_id": `0`,
                "disabled": false,
                "emoji": {
                "id": null,
                "name": `👎`
                },
                "type": 2
            }
            ]
        }
        ],

    }



    const channel = await client.channels.fetch('957073975891091486')
    const messages = await channel.messages.fetch()

    if (messages.size === 0){
        channel.send(msg);
    }
    else{

        for (const message of messages){
            await message[1].delete();
        }
        channel.send(msg);
        
    }

    


}








// await lib.discord.channels['@0.3.0'].messages.create({
//   "channel_id": `${context.params.event.channel_id}`,
//   "content": "",
//   "tts": false,
//   "components": [
//     {
//       "type": 1,
//       "components": [
//         {
//           "style": 1,
//           "label": `Oui`,
//           "custom_id": `1`,
//           "disabled": false,
//           "emoji": {
//             "id": null,
//             "name": `👍`
//           },
//           "type": 2
//         },
//         {
//           "style": 1,
//           "label": `Non`,
//           "custom_id": `0`,
//           "disabled": false,
//           "emoji": {
//             "id": null,
//             "name": `👎`
//           },
//           "type": 2
//         }
//       ]
//     }
//   ],
//   "embeds": [
//     {
//       "type": "rich",
//       "title": `**Negrita** BIENVENUE DANS LE SERVEUR DU CLAN SN3T`,
//       "description": `Salut et bienvenue dans notre famille, avant de commencer nous souhaitons savoir un peu plus sur toi afin de pouvoir te donner les rôles appropriés dans le serveur.`,
//       "color": 0xc7c7c7,
//       "fields": [
//         {
//           "name": `Es-tu déjà membre du clan SN3T?`,
//           "value": "\u200B",
//           "inline": true
//         }
//       ]
//     }
//   ]
// });