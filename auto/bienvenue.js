const { MessageAttachment, MessageEmbed, Message } = require('discord.js');

module.exports = async (client) => {
    const server = await client.guilds.fetch(process.env.GUILD_ID)
    const channelCommandes = await server.channels.cache.find(r => r.name == 'commandes')
    const channelChat = await server.channels.cache.find(r => r.name == 'chat')
    const roleChefAdjoint = await server.roles.cache.find(r => r.name == 'Chef Adjoint')

    const embedBienvenu = new MessageEmbed()
        .setColor('#c7c7c7')
        .setTitle(`**               ** BIENVENUE DANS LE SERVEUR DU CLAN SN3T`)
        .setDescription(`Salut et bienvenue dans notre famille, avant de commencer nous souhaitons savoir un peu plus sur toi afin de pouvoir te donner les rôles appropriés dans le serveur.`)
        .addField(`** \n**Es-tu déjà membre du clan SN3T?`, "** **", false)

    const msgBienvenu = {
        "embeds": [embedBienvenu],
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

    const msgDescription = {
        "embeds": [new MessageEmbed({
            "title": "**                                          **   [DESCRIPTION SERVEUR]",
            "color": 9765892,
            "description": "Bienvenu dans le serveur, ici tu pourras consulter la structure du serveur ainsi que les intéractions possibles pour ton rôle.\n**\n**",
            "timestamp": "",
            "author": {
                "name": ""
            },
            "image": {},
            "thumbnail": {},
            "footer": {},
            "fields": [
                {
                    "name": "🌐  __Général__",
                    "value": `** **\nDans le serveur, l'utilisation des commandes de ${client.user} se fera dans le channel ${channelCommandes}, l'utilisation des commandes dans n'importe quel autre channel ne donnera pas de résultats.\n\nConsultez le channel ${await server.channels.cache.find(r => r.name == 'guide')} dans #Bot pour avoir plus d'informations sur l'utilisation des commandes de ${client.user}\n**\n**`
                },
                {
                    "name": "☕  __Pour les invités__",
                    "value": `**\n**__Tous les channels__ sont visibles mais pas tous sont accéssibles a l'intéraction ou même aux historiques de ceux-là.\n\nLa catégorie **${await server.channels.cache.find(ch => ch.name == '🧑🤝🧑· Invités')}** est dédié à vous, crée pour que vous puissez discuter non seulement avec nous mais entre ${server.roles.cache.find(r => r.name == 'Invité')}.\n\nDans cette catégorie vous retrouverez le channel ${await server.channels.cache.find(ch => ch.name == 'discussion-invités')} pour engager une conversation et ${await server.channels.cache.find(ch => ch.name == 'postuler')} pour vous annoncer si jamais vous désirez nous rejoindre.\n**\n**`
                },
                {
                    "name": "⚔️  __Pour les membres du clan__",
                    "value": `**\n**Tous les channels sont accésibles pour vous à l'intéraction, comme vous pouvez constater, il existe une catégorie par évènement.\n\nIl existe aussi un channel ${await server.channels.cache.find(ch => ch.name == 'annonces')} par catégorie dans lequel nous posterons des infos importantes à lire dans le contexte de l'évènement.\n\n${client.user} utilisera aussi ces channels pour envoyer des messages automatiques avec des infos sur l'évènement`
                }
            ]
        },
            {
                "color": 0,
                "timestamp": "",
                "author": {},
                "image": {},
                "thumbnail": {},
                "footer": {},
                "fields": []
            })]
    }

    const msgGuideCommandes = {
        "embeds": [new MessageEmbed({
            "title": "**                                  **👨‍💻 DESCRIPTION COMMANDES 👩‍💻",
            "color": 9765892,
            "description": `Afin de faciliter la gestion du clan et du serveur nous avons développé notre petit ${client.user}, il est très jeune donc très fragile, soyez sympa avec.\n\n${client.user} nous permettra d'automatiser des tâches en fonction de la situation du clan comme envoyer des rappels de temps restant de GDC, de pourcentage de destruction...\n\nIl organisera des votes en fonction de la situation du clan afin de savoir qui est prêt à s'engager à participer dans l'évènement à venir\n\n⚠️ __RAPPEL! Ces commandes seront utilisables que dans le channel ${channelCommandes}__\n\n\n\n\n`,
            "timestamp": "",
            "author": {
                "name": ""
            },
            "image": {},
            "thumbnail": {},
            "footer": {},
            "fields": [
                {
                    "name": "__*CMD*__",
                    "value": '\u200B',
                    "inline": true
                },
                {
                    "name": "__*Description*__",
                    "value": '\u200B',
                    "inline": true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    "name": "/dons",
                    "value": '\u200B',
                    "inline": true
                },
                {
                    "name": "Affiche la moyenne de dons par joeurs pendant la période actuelle ",
                    "value": '\u200B',
                    "inline": true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    "name": "/dons <@joueur>",
                    "value": '\u200B',
                    "inline": true
                },
                {
                    "name": "Affiche la moyenne de dons du joueur demandé pendant la période actuelle ",
                    "value": '\u200B',
                    "inline": true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '/recevoir',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: `Envoie un message après avoir répondu les différentes questions de __${client.user.username}__ à propos de ta demande`,
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '/donner',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: `Envoie un message après avoir répondu les différentes questions de __${client.user.username}__ à propos de ton offre.`,
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '/actualiser',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: `Met à jour le profil Discord du joueur`,
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '/points',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: 'Affiche le nombre de trophées actuels du clan',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '/points <@joueur>',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: 'Affiche le nombre de trophées actuels du joueur',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                }
                
            ]
        }),new MessageEmbed({
            "title": "**                                  **👨‍💻 DESCRIPTION COMMANDES 👩‍💻",
            "color": 9765892,
            "description": `⚠️ __RAPPEL! Ces commandes seront utilisables que dans le channel ${channelCommandes}__`,
            "timestamp": "",
            "author": {
                "name": ""
            },
            "image": {},
            "thumbnail": {},
            "footer": {},
            "fields": [
                
                {
                    name:  '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: `:no_entry: Pour les membres avec le role ${roleChefAdjoint} :no_entry: `,
                    inline: true
                },
                {
                    name:  '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name:  '/guerre',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: "Envoie un message d'information dans le channel correspondant",
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                
            ]
        })]

    }

    const file = new MessageAttachment('./assets/Logo.png');
    const msgInvitationClan = [new MessageEmbed({
        "title": "**                                       **✨ INVITATION CLAN ✨",
        "color": 9765892,
        "description": `Afin de nous rejoindre, nous vous laissons le lien d'invitation du clan, si vous avez des questions n'hésitez pas a nous les poser dans ${channelChat}!`,
        "image": {},
        "thumbnail": {
            "url": "attachment://Logo.png",
        },
        "fields": [
            {
                "name": `\u200B`,
                "value": `*Nous nous réservons le droit de refuser les demandes si nous le considérons, pour toute autre question, dirigez vous vers les ${roleChefAdjoint}*`,
                "inline": false
            },
            {
                "name": "\u200B",
                "value": 'https://link.clashofclans.com/fr?action=OpenClanProfile&tag=2LV9J8VLQ',
                "inline": false
            },
        ],

    })
    ]

    //! CHANNEL BIENVENU
    const channelBienvenu = await client.channels.cache.find(ch => ch.name == '1-bienvenue')
    const messagesBienvenu = await channelBienvenu.messages.fetch()

    //! CHANNEL BIENVENU
    const channelDescription = await client.channels.cache.find(ch => ch.name == '2-description')
    const messagesDescription = await channelDescription.messages.fetch()

    //! CHANNEL BIENVENU
    const channelGuideCommandes = await client.channels.cache.find(ch => ch.name == 'guide')
    const messagesGuideCommandes = await channelGuideCommandes.messages.fetch()

    //! CHANNEL INVITATION-CLAN
    const channelInvitationClan = await client.channels.cache.find(ch => ch.name == 'invitation-clan')
    const messagesInvitationClan = await channelInvitationClan.messages.fetch()

    if (messagesBienvenu.size === 0) {
        channelBienvenu.send(msgBienvenu);
    }
    if (messagesDescription.size == 0) {
        await channelDescription.send(msgDescription);
    }

    if (messagesGuideCommandes.size == 0) {
        await channelGuideCommandes.send(msgGuideCommandes);
    }
    if (messagesInvitationClan.size == 0) {
        await channelInvitationClan.send(
            {
                embeds: msgInvitationClan,
                files: [file]
            });
    }




}