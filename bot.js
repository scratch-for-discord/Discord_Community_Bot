(async () => {
    // default imports
    const events = require('events');
    const {
        exec
    } = require("child_process")
    const logs = require("discord-logs")
    const Discord = require("discord.js")
    const {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js")
    const fs = require('fs');
    let process = require('process');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // block imports
    const os = require("os-utils");
    let URL = require('url')
    let {
        DB
    } = require("mongquick");
    let https = require("https")
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
    const Database = require("easy-json-database")
    const Database = require("easy-json-database")

    // define s4d components (pretty sure 90% of these arnt even used/required)
    let s4d = {
        Discord,
        fire: null,
        joiningMember: null,
        reply: null,
        player: null,
        manager: null,
        Inviter: null,
        message: null,
        notifer: null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // check if d.js is v13
    if (!require('./package.json').dependencies['discord.js'].startsWith("^13.")) {
        let file = JSON.parse(fs.readFileSync('package.json'))
        file.dependencies['discord.js'] = '^13.12.0'
        fs.writeFileSync('package.json', JSON.stringify(file))
        exec('npm i')
        throw new Error("Seems you arent using v13 please re-run or run `npm i discord.js@13.12.0`");
    }

    // check if discord-logs is v2
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
        let file = JSON.parse(fs.readFileSync('package.json'))
        file.dependencies['discord-logs'] = '^2.0.0'
        fs.writeFileSync('package.json', JSON.stringify(file))
        exec('npm i')
        throw new Error("discord-logs must be 2.0.0. please re-run or if that fails run `npm i discord-logs@2.0.0` then re-run");
    }

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION",
            "CHANNEL"
        ]
    });

    // when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // upon error print "Error!" and the error
    process.on('uncaughtException', function(err) {
        console.log('Error!');
        console.log(err);
    });

    // give the new client to discord-logs
    logs(s4d.client);

    // pre blockly code
    s4d.database = new Database('./database.json')

    // blockly code
    var time_var, channel_update, botuptime, channel_update_old, j, s4dcolor, ar_keys, channel_category, channel_text, channel_voice, channel_announcement, channel_stage, roles_mod, roles_mentionable, roles_hoisted, roles_total;

    // Describe this function...
    function time(time_var) {
        return String(Math.round(time_var / 60) > 120 ? Math.round((time_var / 60) / 60) : Math.round(time_var / 60)) + String(Math.round(time_var / 60) > 120 ? ' hours' : ' mins');
    }

    function colourRgb(r, g, b) {
        r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
        g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
        b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
        r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
        g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
        b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
        return '#' + r + g + b;
    }


    const database2 = new Database('./autoresponse.json')
    const database1 = new Database('./database.json')
    const reviews = new Database('./reviewsDB.json')
    var s4dcolor = (colourRgb((254 / 255) * 100, (169 / 255) * 100, (24 / 255) * 100));

    const calc_total = async (helper) => {
        let rjson = reviews.get(String('reviewed'));
        let hjson = (rjson[String(helper)]);
        let sum = 0;
        var j_list = (Object.getOwnPropertyNames(hjson.reviews));
        for (var j_index in j_list) {
            j = j_list[j_index];
            let value = (hjson.reviews[String(j)]);
            sum = (sum + value.rating)
        }
        hjson[String('total')] = sum
        rjson[String(helper)] = hjson
        reviews.set(String('reviewed'), rjson);


    };

    await s4d.client.login((process.env[String('TOKEN')])).catch((e) => {
        const tokenInvalid = true;
        const tokenError = e;
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("An invalid bot token was provided!")
        } else {
            throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
        }
    });

    s4d.client.on('ready', async () => {
        s4d.client.user.setPresence({
            status: "online",
            activities: [{
                name: (String((s4d.client.guilds.cache.get('932651844344373278')).memberCount) + ' members in S4D'),
                type: "WATCHING"
            }]
        });
        botuptime = (Math.floor(new Date().getTime() / 1000));
           });

           s4d.client.application?.commands.create({
            name: 'CreateIssue',
            type: 3
        })

    s4d.client.on('guildUpdate', async (oldGuild, newGuild) => {
        channel_update = [];
        channel_update_old = [];
        if (((oldGuild).afkChannel) != ((newGuild).afkChannel)) {
            channel_update.push(('AFK: ' + String((oldGuild).afkChannel)));
            channel_update_old.push(('AFK: ' + String((newGuild).afkChannel)));
        }
        if (((oldGuild).verified) != ((newGuild).verified)) {
            channel_update.push(('Verification Status: ' + String((oldGuild).verified)));
            channel_update_old.push(('Verification Status: ' + String((newGuild).verified)));
        }
        if (0 != 0) {
            channel_update.push(('Verification Level: ' + ''));
            channel_update_old.push(('Verification Level: ' + ''));
        }
        if (((oldGuild).systemChannel) != ((newGuild).systemChannel)) {
            channel_update.push(('System: ' + String((oldGuild).systemChannel)));
            channel_update_old.push(('System: ' + String((newGuild).systemChannel)));
        }
        if (((oldGuild).rulesChannel) != ((newGuild).rulesChannel)) {
            channel_update.push(('Rules channel: ' + String((oldGuild).rulesChannel)));
            channel_update_old.push(('Rules channel: ' + String((newGuild).rulesChannel)));
        }
        if (((oldGuild).premiumTier) != ((newGuild).premiumTier)) {
            channel_update.push(('Boost Level:  ' + String((oldGuild).premiumTier)));
            channel_update_old.push(('Boost Level:  ' + String((newGuild).premiumTier)));
        }
        if (((oldGuild).premiumProgressBarEnabled) != ((newGuild).premiumProgressBarEnabled)) {
            channel_update.push(('Boost progress bar: ' + String((oldGuild).premiumProgressBarEnabled)));
            channel_update_old.push(('Boost progress bar: ' + String((newGuild).premiumProgressBarEnabled)));
        }
        if (((oldGuild).preferredLocale) != ((newGuild).preferredLocale)) {
            channel_update.push(('Locale: ' + String((oldGuild).preferredLocale)));
            channel_update_old.push(('Locale: ' + String((newGuild).preferredLocale)));
        }
        if (((oldGuild).name) != ((newGuild).name)) {
            channel_update.push(('Name: ' + String((oldGuild).name)));
            channel_update_old.push(('Name: ' + String((newGuild).name)));
        }
        if (((oldGuild).icon) != ((newGuild).icon)) {
            channel_update.push(('Icon: ' + String((oldGuild).icon)));
            channel_update_old.push(('Icon: ' + String((newGuild).icon)));
        }
        if (((oldGuild).explicitContentFilter) != ((newGuild).explicitContentFilter)) {
            channel_update.push(('Explicit Filter: ' + String((oldGuild).explicitContentFilter)));
            channel_update_old.push(('Explicit Filter: ' + String((newGuild).explicitContentFilter)));
        }
        if (((oldGuild).description) != ((newGuild).description)) {
            channel_update.push(('Description: ' + String((oldGuild).description)));
            channel_update_old.push(('Description: ' + String((newGuild).description)));
        }
        if (((oldGuild).defaultMessageNotifications) != ((newGuild).defaultMessageNotifications)) {
            channel_update.push(('Default notification: ' + String((oldGuild).defaultMessageNotifications)));
            channel_update_old.push(('Default notification: ' + String((newGuild).defaultMessageNotifications)));
        }
        if (!!channel_update.length) {
            var embed1 = new Discord.MessageEmbed();
            embed1.setColor('#6666cc');
            embed1.setTitle(String('Server Updated'))
            embed1.setURL(String());
            embed1.addField(String('Before'), String((String(channel_update_old.join(', ')) + '')), false);
            embed1.addField(String('After'), String((String(channel_update.join(', ')) + '')), false);
            s4d.client.channels.cache.get('933175093016789074').send({
                embeds: [embed1]
            });

        }

    });

    s4d.client.on('channelUpdate', async (oldChannel, newChannel) => {
        channel_update = [];
        channel_update_old = [];
        if ((oldChannel.name) != (newChannel.name)) {
            channel_update.push(('Name: ' + String(newChannel.name)));
            channel_update_old.push(('Name: ' + String(oldChannel.name)));
        }
        if ((oldChannel.topic) != (newChannel.topic)) {
            channel_update.push(('Topic: ' + String(newChannel.topic)));
            channel_update_old.push(('Topic: ' + String(oldChannel.topic)));
        }
        if ((oldChannel.type) != (newChannel.type)) {
            channel_update.push(('Type: ' + String(newChannel.type)));
            channel_update_old.push(('Type: ' + String(oldChannel.position)));
        }
        if ((oldChannel.position) != (newChannel.position)) {
            channel_update.push(('position: ' + String(newChannel.position)));
            channel_update_old.push(('position: ' + String(oldChannel.position)));
        }
        if ((oldChannel.rateLimitPerUser) != (newChannel.rateLimitPerUser)) {
            channel_update.push(('Slowmode: ' + String(newChannel.rateLimitPerUser)));
            channel_update_old.push(('Slowmode: ' + String(oldChannel.rateLimitPerUser)));
        }
        if ((oldChannel.userLimit) != (newChannel.userLimit)) {
            channel_update.push(('User Limit: ' + String(newChannel.userLimit)));
            channel_update_old.push(('User Limit: ' + String(oldChannel.userLimit)));
        }
        if ((oldChannel.bitrate) != (newChannel.bitrate)) {
            channel_update.push(('Bitrate: ' + String(newChannel.bitrate)));
            channel_update_old.push(('Bitrate: ' + String(oldChannel.bitrate)));
        }
        if ((oldChannel.nsfw) != (newChannel.nsfw)) {
            channel_update.push(('NSFW: ' + String(newChannel.nsfw)));
            channel_update_old.push(('NSFW: ' + String(oldChannel.nsfw)));
        }
        if (!!channel_update.length) {
            var embed1 = new Discord.MessageEmbed();
            embed1.setColor('#6666cc');
            embed1.setTitle(String((((newChannel.type) == 'GUILD_VOICE') ? 'Voice channel updated' : 'Text channel updated')))
            embed1.setURL(String());
            embed1.addField(String('Channel'), String((String(newChannel))), false);
            embed1.addField(String('Before'), String((String(channel_update_old.join(', ')) + '')), false);
            embed1.addField(String('After'), String((String(channel_update.join(', ')) + '')), false);
            s4d.client.channels.cache.get('933175093016789074').send({
                embeds: [embed1]
            });

        }

    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (((s4dmessage.channel).type) == 'GUILD_NEWS') {
            eval('s4dmessage.crosspost()');
        } else if ((s4dmessage.channel) == s4d.client.channels.cache.get('1010545985006600292')) {} else if ('<@939129451046920253>' == (s4dmessage.content)) {
            s4dmessage.reply({
                content: String((['Hi ', (s4dmessage.member.user).username, ', i have only slash commands!'].join(''))),
                allowedMentions: {
                    repliedUser: true
                }
            });
        } else if (((s4dmessage.channel).parentId) == '932651844973502470') {
            if ((String((s4dmessage.content)).includes(String('thx'))) || (String((s4dmessage.content)).includes(String('thanks'))) || (String((s4dmessage.content)).includes(String('thank you')))) {
                s4dmessage.channel.send({
                    content: String('use `/review` in <#932651844973502473> to rate your helper(s)!')
                });
            }
        }

    });

    s4d.client.on('interactionCreate', async (interaction) => {
        let member = interaction.guild.members.cache.get(interaction.member.user.id)
        switch ((interaction.commandName)) {
            case 'bot':
                switch ((interaction.options.getSubcommand())) {
                    case 'shutdown':
                        if ((interaction.member).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                            await interaction.reply({
                                content: 'shuting down...',
                                ephemeral: true,
                                components: []
                            });
                            await delay(Number(2) * 1000);
                            s4d.client.destroy();
                        } else {
                            await interaction.reply({
                                content: '<a:youtried:939133664887988264>',
                                ephemeral: true,
                                components: []
                            });
                        }

                        break;
                    case 'info':
                        var embed1 = new Discord.MessageEmbed();
                        embed1.setTitle(String('Help'))
                        embed1.setURL(String());
                        embed1.addField(String('Guilds'), String((String(s4d.client.guilds.cache.size))), true);
                        embed1.addField(String('Users'), String((String(s4d.client.users.cache.size))), true);
                        embed1.addField(String('Info'), String((['Ram: `', Math.round((Number((os.totalmem()))) - (Number((os.freemem())))), '/', Math.round(Number((os.totalmem()))), ' MB (', Math.round((((Number((os.totalmem()))) - (Number((os.freemem())))) / (Number((os.totalmem())))) * 100), '%)`', '\n', 'Version: `v2.5.3`'].join(''))), true);
                        embed1.addField(String('Other'), String((['Commands used: ', s4d.database.get(String('commands')), '\n', 'Bot uptime: ', time((Math.floor(new Date().getTime() / 1000)) - botuptime)].join(''))), false);
                        embed1.setColor(s4dcolor);
                        await interaction.reply({
                            embeds: [embed1],
                            ephemeral: false,
                            components: []
                        });


                        break;

                };

                break;
            case 'help':
                var embed1 = new Discord.MessageEmbed();
                embed1.setColor(s4dcolor);
                embed1.setTitle(String('Help'))
                embed1.setURL(String());
                embed1.setDescription(String((['**__BOT__**' + '\n' +
                    'help - display this command' + '\n' +
                    'bot info - see bot stats' + '\n' +
                    'server - shows info about the server' + '\n' +
                    'rickroll - well try it' + '\n' +
                    'report - send report to moderators' + '\n' +
                    'links - get a link for website' + '\n' +
                    '247 - see how to make your bot 24/7' + '\n' +
                    'errors - how to fix an error', '\n', '**__STAFF__**' + '\n' +
                    'bot ban (add/remove) - ban someone from using s4d' + '\n' +
                    'autoresponse (show/set/remove) - add, removes keywords or see all of them ', '', '', ''
                ].join(''))));
                await interaction.reply({
                    embeds: [embed1],
                    ephemeral: false,
                    components: []
                });


                break;
            case 'server':
                var embed = new Discord.MessageEmbed()
                embed.setColor(s4dcolor);
                embed.setAuthor(((interaction.guild).name), ((interaction.guild).iconURL({
                    dynamic: true
                })));
                embed.setThumbnail(((interaction.guild).iconURL({
                    dynamic: true
                })));
                embed.addField('🆔・ Server ID', '```932651844344373278```', true);
                embed.addField('👑・ Server owner', '<@395165536545275905>', true);
                embed.addField('🕛・ Created', (['<t:', '1642428300', ':R>'].join('')), true);
                embed.addField((['🫂・ Server members [ ', ((interaction.guild).members.cache.filter(m => m.user.bot).size) + ((interaction.guild).members.cache.filter(m => !m.user.bot).size), ' ]'].join('')), (['```Members: ', (interaction.guild).members.cache.filter(m => !m.user.bot).size, '  |  Bots: ', (interaction.guild).members.cache.filter(m => m.user.bot).size, '```'].join('')), false);
                channel_category = 0;
                channel_text = 0;
                channel_voice = 0;
                channel_announcement = 0;
                channel_stage = 0;
                (interaction.guild).channels.cache.forEach(async (c) => {
                    if (((c).type) == 'GUILD_TEXT') {
                        channel_text = (typeof channel_text === 'number' ? channel_text : 0) + 1;
                    } else if (((c).type) == 'GUILD_VOICE') {
                        channel_voice = (typeof channel_voice === 'number' ? channel_voice : 0) + 1;
                    } else if (((c).type) == 'GUILD_STAGE_VOICE') {
                        channel_stage = (typeof channel_stage === 'number' ? channel_stage : 0) + 1;
                    } else if (((c).type) == 'GUILD_NEWS') {
                        channel_announcement = (typeof channel_announcement === 'number' ? channel_announcement : 0) + 1;
                    } else if (((c).type) == 'GUILD_CATEGORY') {
                        channel_category = (typeof channel_category === 'number' ? channel_category : 0) + 1;
                    }

                })
                embed.addField((['Server categories and channels [ ', (interaction.guild).channels.cache.size, ']'].join('')), (['```Categories: ', channel_category, '  |  Text: ', channel_text, '  |  Voice:', channel_voice, '  |  Announcement: ', channel_announcement, '  |  Stage:', channel_stage, '```'].join('')), false);
                embed.addField('<:nitro_badge:1011338125227868270>・ Boosts', (['```Boost level: ', (interaction.guild).premiumTier, '  |  Boost amount: ', (interaction.guild).premiumSubscriptionCount, '```'].join('')), false);
                roles_mod = 0;
                roles_mentionable = 0;
                roles_hoisted = 0;
                roles_total = 0;
                (interaction.guild).roles.cache.forEach(async (ro) => {
                    roles_total = (typeof roles_total === 'number' ? roles_total : 0) + 1;
                    if ((ro).hoisted) {
                        roles_hoisted = (typeof roles_hoisted === 'number' ? roles_hoisted : 0) + 1;
                    }
                    if ((ro).mentionable) {
                        roles_mentionable = (typeof roles_mentionable === 'number' ? roles_mentionable : 0) + 1;
                    }
                    if ((ro).permissions.has('MANAGE_MESSAGES')) {
                        roles_mod = (typeof roles_mod === 'number' ? roles_mod : 0) + 1;
                    }

                })
                embed.addField((['🖊️・ Roles [ ', roles_total, ']'].join('')), (['```Hoisted: ', roles_hoisted, '  |  Mentionable: ', roles_mentionable, '  |  Moderator: ', roles_mod, '```'].join('')), false);
                embed.addField('📘・ Description', (['```', (interaction.guild).description, '```'].join('')), false);
                await interaction.reply({
                    embeds: [(embed)],
                    ephemeral: false,
                    components: []
                });


                break;
            case 'autoresponse':
                if (((interaction.member)._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('933990402078408715')).id)) || ((interaction.member)._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('932651844428251195')).id))) {
                    switch ((interaction.options.getSubcommand())) {
                        case 'show':
                            ar_keys = [];
                            var JSONdataS4D = JSON.parse(fs.readFileSync('autoresponse.json'));
                            Object.keys(JSONdataS4D).forEach(async s4dkey => {
                                ar_keys.push((s4dkey));

                            })
                            var embed = new Discord.MessageEmbed()
                            embed.setColor(s4dcolor);
                            embed.setTitle('Autoresponse')
                                .setURL();
                            embed.setDescription((['**Keys: **', Object.keys(JSONdataS4D).length, '\n', '**KeyWords:**`', ar_keys.join('`, `'), '`'].join('')));
                            await interaction.reply({
                                embeds: [(embed)],
                                ephemeral: true,
                                components: []
                            });


                            break;
                        case 'add':
                            database2.set(String(((interaction.options.getString('keyword')).toLowerCase())), [interaction.options.getString('name'), String((interaction.options.getString('description'))).replaceAll('>', String('\n')), interaction.options.getString('image')]);
                            await interaction.reply({
                                content: (['added `', interaction.options.getString('keyword'), '` to database"'].join('')),
                                ephemeral: true,
                                components: []
                            });
                            (((interaction.guild).members.cache.get('513095506914705418') || await (interaction.guild).members.fetch('513095506914705418'))).send({
                                content: String((['added keyword `', (interaction.options.getString('keyword')).toLowerCase(), '` with name ', interaction.options.getString('name'), ' and description ', String((interaction.options.getString('description'))).replaceAll('>', String('\n')), '\n', ' and image ', interaction.options.getString('image'), interaction.member.user].join('')))
                            });

                            break;
                        case 'remove':
                            if (database2.has(String(((interaction.options.getString('keyword')).toLowerCase())))) {
                                (((interaction.guild).members.cache.get('513095506914705418') || await (interaction.guild).members.fetch('513095506914705418'))).send({
                                    content: String((['removed keyword `', (interaction.options.getString('keyword')).toLowerCase(), '` with name ', database2.get(String(((interaction.options.getString('keyword')).toLowerCase())))[0], ' and description ', database2.get(String(((interaction.options.getString('keyword')).toLowerCase())))[1], ' and image ', database2.get(String(((interaction.options.getString('keyword')).toLowerCase()))).slice(-1)[0], '\n', interaction.member.user].join('')))
                                });
                                database2.delete(String((interaction.options.getString('keyword'))));
                                await interaction.reply({
                                    content: (['Keyword `', (interaction.options.getString('keyword')).toLowerCase(), '` removed'].join('')),
                                    ephemeral: true,
                                    components: []
                                });
                            } else {
                                await interaction.reply({
                                    content: (['Keyword `', interaction.options.getString('keyword'), '` not found'].join('')),
                                    ephemeral: true,
                                    components: []
                                });
                            }

                            break;

                    };
                } else {
                    await interaction.reply({
                        content: 'You dont have access to use this command!',
                        ephemeral: true,
                        components: []
                    });
                }

                break;
            case 'report':
                var embed = new Discord.MessageEmbed()
                embed.setTitle('🚨 REPORT 🚨')
                    .setURL();
                embed.setDescription((['**author: **', interaction.member.user, ' - ', (interaction.member.user).id, '\n', '**offender: **', interaction.options.getUser('user'), ' - ', (interaction.options.getMember('user')).id, '\n', '**message: **', interaction.options.getString('reason')].join('')));
                embed.setColor(s4dcolor);
                s4d.client.channels.cache.get('932651845724291084').send({
                    embeds: [embed]
                });

                await interaction.reply({
                    content: 'Thanks for your report, please wait until the staff team view it, in meantime take a cookie 🍪!',
                    ephemeral: true,
                    components: []
                });

                break;
            case 'links':
                var embed1 = new Discord.MessageEmbed();
                embed1.setColor(s4dcolor);
                switch ((interaction.options.getString('link'))) {
                    case 's4d':
                        embed1.setTitle(String('Official s4d website'))
                        embed1.setURL(String());
                        embed1.setDescription(String('Here is the link for [Scratch for Discord](https://scratch-for-discord.com/)'));

                        break;
                    case 'slash':
                        embed1.setTitle(String('Slash register'))
                        embed1.setURL(String());
                        embed1.setDescription(String('Here is the link for [slash register](https://slash-commands-gui.androz2091.fr/)'));

                        break;
                    case 'replit':
                        embed1.setTitle(String('Replit'))
                        embed1.setURL(String());
                        embed1.setDescription(String('Here is the link for [Replit](https://replit.com/~)'));

                        break;
                    case 'uptimerobot':
                        embed1.setTitle(String('Uptime Robot'))
                        embed1.setURL(String());
                        embed1.setDescription(String('Here is the link for [UptimeRobot](https://uptimerobot.com/)'));

                        break;

                };
                await interaction.reply({
                    embeds: [embed1],
                    ephemeral: false,
                    components: []
                });


                break;
            case 'helper':
                switch ((interaction.options.getSubcommand())) {
                    case 'review':
                        const user = ((interaction.member.user).id);
                        const helper = ((interaction.options.getMember('helper')).id);
                        var reviewed = reviews.get(String('reviewed'));
                        let reviewers = reviews.get(String('reviewers'));
                        let newReview = {
                            "rating": (interaction.options.getString('rating')),
                            "comment": (interaction.options.getString('comment')),
                            "timestamp": (new Date().getTime()),
                        };
                        if (!(reviewed[String(helper)])) {
                            reviewed[String(helper)] = (new Object())
                        }
                        if (!((reviewed[String(helper)])[String('reviews')])) {
                            (reviewed[String(helper)])[String('reviews')] = (new Object())
                        }
                        ((reviewed[String(helper)])[String('reviews')])[String(user)] = newReview
                        if (!(reviewers[String(helper)])) {
                            reviewers[String(user)] = []
                        }
                        if ((reviewers[String(user)]).includes(helper)) {
                            await interaction.reply({
                                content: 'you have already reviewed this helper. ',
                                ephemeral: false,
                                components: []
                            });
                            (interaction.channel).send(String('do you want to edit your review?')).then(() => {
                                (interaction.channel).awaitMessages({
                                    filter: (m) => m.author.id === (interaction.member).id,
                                    time: (5 * 60 * 1000),
                                    max: 1
                                }).then(async (collected) => {
                                    s4d.reply = collected.first().content;
                                    s4d.message = collected.first();
                                    if (!(((s4d.reply) || '').startsWith('y' || ''))) {
                                        (interaction.channel).send({
                                            content: String('cancelled')
                                        });
                                        return
                                    }
                                    reviews.set(String('reviewed'), reviewed);
                                    reviews.set(String('reviewers'), reviewers);
                                    calc_total(helper)

                                    (interaction.channel).send({
                                        content: String((['successfully edited your rating for ', interaction.options.getMember('helper'), '!'].join(''))),
                                        allowedMentions: {
                                            users: [],

                                        }
                                    });

                                    s4d.reply = null;
                                }).catch(async (e) => {
                                    console.error(e);
                                    (interaction.channel).send({
                                        content: String('cancelled')
                                    });
                                });
                            })
                            return
                        }
                        (reviewers[String(user)]).push(helper);
                        reviews.set(String('reviewed'), reviewed);
                        reviews.set(String('reviewers'), reviewers);
                        calc_total(helper)

                        await interaction.reply({
                            content: (['successfully rated ', interaction.options.getMember('helper'), '!'].join('')),
                            ephemeral: true,
                            components: []
                        });

                        break;
                    case 'helper-list':

                        /*
                  i rlly need to add the "notify discord that the
              bot got the command and is infact working on
              a response but currently has no text to send"
              block
                  */
                        await interaction.reply({
                            content: 'getting helpers',
                            ephemeral: true,
                            components: []
                        });
                        var reviewed = reviews.get(String('reviewed'));
                        let pages = [
                            []
                        ]
                        let helpers = Object.getOwnPropertyNames(reviewed)
                            .map(x => {
                                return {
                                    user: x,
                                    total: reviewed[x].total,
                                    numrev: Object.getOwnPropertyNames(reviewed[x].reviews).length
                                }
                            })
                            .sort((a, b) => a.total - b.total)
                            .reduce((out, item) => {
                                if (out.user != null) out = [`<@${out.user}> \`${out.user}\`: ${out.total}`]
                                out.push(`<@${item.user}> \`${item.user}\`: ${Math.floor(item.total / item.numrev)}`)
                                return out
                            })
                            .forEach((item, index) => {
                                let page = pages.length - 1
                                if (page < Math.floor(index / 10)) {
                                    pages[page] = pages[page].join(',\n')
                                    pages.push([])
                                    page = pages.length - 1
                                }
                                pages[page].push(item)
                            })
                        pages[pages.length - 1] = pages[pages.length - 1].join(',\n')
                        const buttons_all = (new MessageActionRow()
                            .addComponents(new MessageButton()
                                .setCustomId('maxL')
                                .setEmoji('⏮')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('left')
                                .setEmoji('◀')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('right')
                                .setEmoji('▶')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('maxR')
                                .setEmoji('⏭')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                            ));
                        const buttons_left = (new MessageActionRow()
                            .addComponents(new MessageButton()
                                .setCustomId('maxL')
                                .setEmoji('⏮')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('left')
                                .setEmoji('◀')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('right')
                                .setEmoji('▶')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('maxR')
                                .setEmoji('⏭')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                            ));
                        const buttons_right = (new MessageActionRow()
                            .addComponents(new MessageButton()
                                .setCustomId('maxL')
                                .setEmoji('⏮')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('left')
                                .setEmoji('◀')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('right')
                                .setEmoji('▶')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('maxR')
                                .setEmoji('⏭')
                                .setDisabled(false)
                                .setStyle(('PRIMARY')),
                            ));
                        const buttons_none = (new MessageActionRow()
                            .addComponents(new MessageButton()
                                .setCustomId('maxL')
                                .setEmoji('⏮')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('left')
                                .setEmoji('◀')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('right')
                                .setEmoji('▶')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                                new MessageButton()
                                .setCustomId('maxR')
                                .setEmoji('⏭')
                                .setDisabled(true)
                                .setStyle(('PRIMARY')),
                            ));
                        let page = 1;
                        var embed = new Discord.MessageEmbed();
                        embed.setColor('#00cccc');
                        embed.setTitle(String('helper list'))
                        embed.setURL(String());
                        embed.setDescription(String((pages[(page - 1)])));
                        embed.setFooter({
                            text: String((['page ', page, '/', pages.length].join(''))),
                            iconURL: String()
                        });

                        (interaction.channel).send({
                            embeds: [embed],
                            components: [buttons_right]
                        }).then(async m => {

                            let collector = m.createMessageComponentCollector({
                                filter: i => i.user.id === i.user.id,
                                time: Number(60000) * 1000
                            });
                            collector.on('collect', async i => {
                                if ((i.customId) == 'maxL') {
                                    page = 1
                                } else if ((i.customId) == 'left') {
                                    page = (page - 1)
                                } else if ((i.customId) == 'right') {
                                    page = (page + 1)
                                } else if ((i.customId) == 'maxR') {
                                    page = (pages.length)
                                }
                                var embed = new Discord.MessageEmbed();
                                embed.setColor('#00cccc');
                                embed.setTitle(String('helper list'))
                                embed.setURL(String());
                                embed.setDescription(String((pages[(page - 1)])));
                                embed.setFooter({
                                    text: String((['page ', page, '/', pages.length].join(''))),
                                    iconURL: String()
                                });


                                /*
                      im not sure if i got this correct but it should
                  be correct
                      */
                                if (page == 1) {
                                    if (pages.length == 1) {
                                        await i.update({
                                            embeds: [embed],
                                            components: [buttons_none]
                                        }).then(async m => {

                                        });
                                    } else {
                                        await i.update({
                                            embeds: [embed],
                                            components: [buttons_right]
                                        }).then(async m => {

                                        });
                                    }
                                } else if (page == pages.length) {
                                    await i.update({
                                        embeds: [embed],
                                        components: [buttons_left]
                                    }).then(async m => {

                                    });
                                } else {
                                    await i.update({
                                        embeds: [embed],
                                        components: [buttons_all]
                                    }).then(async m => {

                                    });
                                }

                            })

                        });

                        break;

                };

                break;

        };
        s4d.database.add(String('commands'), parseInt(1));

    });

    synchronizeSlashCommands(s4d.client, [{
        name: 'helper',
        description: 'a set of commands for doing stuff related to helpers!',
        options: [{
            name: 'review',
            description: 'rate a helper anywhere from 0 to five stars!',
            type: 1,
            options: [{
                type: 6,
                name: 'helper',
                required: true,
                description: 'the helper to rate',
                choices: [

                ]
            }, {
                type: 3,
                name: 'rating',
                required: true,
                description: 'anything from 0-5 stars',
                choices: [{
                    name: String('0 stars'),
                    value: String('0')
                }, {
                    name: String('⭐'),
                    value: String('1')
                }, {
                    name: String('⭐⭐'),
                    value: String('2')
                }, {
                    name: String('⭐⭐⭐'),
                    value: String('3')
                }, {
                    name: String('⭐⭐⭐⭐'),
                    value: String('4')
                }, {
                    name: String('⭐⭐⭐⭐⭐'),
                    value: String('5')
                }, ]
            }, {
                type: 3,
                name: 'comment',
                required: false,
                description: 'what is your opinion on this helper?',
                choices: [

                ]
            }, ]
        }, {
            name: 'helper-list',
            description: 'get a list of helpers listed best to worst',
            type: 1,
            options: [

            ]
        }, ]
    }, {
        name: 'bot',
        description: 'description of bot',
        options: [{
            name: 'info',
            description: 'info about the bot',
            type: 1,
            options: [

            ]
        }, {
            name: 'shutdown',
            description: 'shutdown the bot (admin only)',
            type: 1,
            options: [

            ]
        }, ]
    }, {
        name: 'help',
        description: 'help command',
        options: [

        ]
    }, {
        name: 'server',
        description: 'server information',
        options: [

        ]
    }, {
        name: 'report',
        description: 'person',
        options: [{
            name: 'person',
            description: 'report a person',
            type: 1,
            options: [{
                type: 6,
                name: 'user',
                required: true,
                description: 'user',
                choices: [

                ]
            }, {
                type: 3,
                name: 'reason',
                required: true,
                description: 'reason',
                choices: [

                ]
            }, ]
        }, ]
    }, {
        name: 'links',
        description: 'link for website',
        options: [{
            type: 3,
            name: 'link',
            required: false,
            description: 'link to a website...',
            choices: [{
                name: String('slash builder'),
                value: String('slash')
            }, {
                name: String('replit'),
                value: String('replit')
            }, {
                name: String('s4d official website'),
                value: String('s4d')
            }, {
                name: String('uptimerobot'),
                value: String('uptimerobot')
            }, ]
        }, ]
    }, ], {
        debug: false,

    });

    s4d.client.on('interactionCreate', async (interaction) => {
        switch ((interaction.commandName)) {
            case 'CreateIssue':
                const body = (interaction.options.getMessage('message'));
                const title = "Found a bug";
                const labels = ["Fix"];

                const response = await fetch(`https://api.github.com/repos/scratch-for-discord/Web-Application_Frontend/issues`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/vnd.github+json",
                        "Authorization": `Bearer ${process.env.GITHUB}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        labels
                    }),
                })
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const json = await response.json();
                await interaction.reply({
                    ephemeral: true,
                    embeds: [(!response.ok ? 'Issue creation failed' : 'Issue created')],
                    components: []
                })

                break;

        };

    });

    s4d.client.on('emojiUpdate', async (emoji) => {
        var embed1 = new Discord.MessageEmbed();
        embed1.setColor('#6666cc');
        embed1.setTitle(String('Emoji Deleted'))
        embed1.setURL(String());
        embed1.setDescription(String('Some desc here...'));
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed1]
        });


    });

    s4d.client.on('emojiDelete', async (emoji) => {
        var embed1 = new Discord.MessageEmbed();
        embed1.setColor('#6666cc');
        embed1.setTitle(String('Emoji Deleted'))
        embed1.setURL(String());
        embed1.setDescription(String((['Name: ', emoji.name, '\n', 'Url: ', emoji.url, '', '', ''].join(''))));
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed1]
        });


    });

    s4d.client.on('emojiCreate', async (emoji) => {
        var embed1 = new Discord.MessageEmbed();
        embed1.setColor('#6666cc');
        embed1.setTitle(String('Emoji Created'))
        embed1.setURL(String());
        embed1.setDescription(String((['Name: ', emoji.name, '\n', 'Url: ', emoji.url].join(''))));
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed1]
        });


    });

    return s4d
})();