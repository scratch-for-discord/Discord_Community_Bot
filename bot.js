(async () => {
    let process = require('process');
    process.on('uncaughtException', function(err) {
        console.log(`Error!`);
        console.log(err);
    });
    const events = require('events');
    const {
        exec
    } = require("child_process")
    let Discord = require("discord.js")
    let Database = require("easy-json-database")
    let {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js")
    let logs = require("discord-logs")
    const os = require("os-utils");
    let URL = require('url')
    let https = require("https")
    const {
        DiscordTogether
    } = require('discord-together');
    const miliConverter = require("millisecond-converter")
    let fs = require('fs');
    const devMode = typeof __E_IS_DEV !== "undefined" && __E_IS_DEV;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const s4d = {
        Discord,
        database: new Database(`./database.json`),
        fire: null,
        joiningMember: null,
        reply: null,
        tokenInvalid: false,
        tokenError: null,
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
    s4d.client = new s4d.Discord.Client({
        intents: [Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)],
        partials: ["REACTION", "CHANNEL"]
    });
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })
    logs(s4d.client);
    s4d.client.discordTogether = new DiscordTogether(s4d.client);
    var channel_update, channel_update_old, member, key_reply, prefix, databaseargs, voice, thread_channels, keys_names, botuptime, color, s4dcolor, ar_keys, channel_name, channelid, databasedata, loaded, skipped, i, delete2;

    function colourRgb(r, g, b) {
        r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
        g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
        b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
        r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
        g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
        b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
        return '#' + r + g + b;
    }

    function subsequenceFromStartFromEnd(sequence, at1, at2) {
        var start = at1;
        var end = sequence.length - 1 - at2 + 1;
        return sequence.slice(start, end);
    }

    function textToTitleCase(str) {
        return str.replace(/\S+/g,
            function(txt) {
                return txt[0].toUpperCase() + txt.substring(1).toLowerCase();
            });
    }

    function colourRandom() {
        var num = Math.floor(Math.random() * Math.pow(2, 24));
        return '#' + ('00000' + num.toString(16)).substr(-6);
    }


    s4d.client.on('ready', async () => {
        eval('console.clear()');
        console.log('🧱・S4D#6399 is alive!');
        s4d.client.user.setPresence({
            status: "online",
            activities: [{
                name: (String((s4d.client.guilds.cache.get('932651844344373278')).memberCount) + ' members in S4D'),
                type: "WATCHING"
            }]
        });
        prefix = '/';
        botuptime = (Math.floor(new Date().getTime() / 1000));
        thread_channels = ['932651844973502472', '932651845212573730', '932651845212573733', '935600698920419378'];
        s4dcolor = colourRgb((254 / 255) * 100, (169 / 255) * 100, (24 / 255) * 100);
        databasedata = String(JSON.stringify(s4d.database.all())).split('},{');
        databaseargs = databasedata.slice(((databasedata.indexOf('"key":"932657557691060274-937799226522472469","data":"bot load"') + 1) - 1), databasedata.length);
        loaded = 0;
        skipped = 0;
        var i_end = databaseargs.length;
        var i_inc = 1;
        if (1 > i_end) {
            i_inc = -i_inc;
        }
        for (i = 1; i_inc >= 0 ? i <= i_end : i >= i_end; i += i_inc) {
            delete2 = 'yes';
            s4d.client.channels.cache.get((databaseargs[(i - 1)].slice(7, 25))).messages.fetch((databaseargs[(i - 1)].slice(26, 44))).then(async (s4dmessage) => {
                delete2 = 'no';

            });
            await delay(Number(0.5) * 1000);
            if (delete2 == 'yes') {
                s4d.database.delete(String(([databaseargs[(i - 1)].slice(7, 25), '-', databaseargs[(i - 1)].slice(26, 44)].join(''))));
                skipped = (typeof skipped === 'number' ? skipped : 0) + 1;
            } else {
                loaded = (typeof loaded === 'number' ? loaded : 0) + 1;
            }
            await delay(Number(0.5) * 1000);
        }
        console.log((['successfully loaded threads: ', loaded, '\n', 'failed to load threads: ', skipped].join('')));

    });

    await s4d.client.login((process.env.TOKEN)).catch((e) => {
        s4d.tokenInvalid = true;
        s4d.tokenError = e;
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("An invalid bot token was provided!")
        } else {
            throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
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
        var embed = new Discord.MessageEmbed();
        embed.setColor('#6666cc');
        embed.setTitle(String('Text channel updated'))
        embed.addField(String('Before'), String((String(channel_update_old.join(', ')) + '')), false);
        embed.addField(String('After'), String((String(channel_update.join(', ')) + '')), false);
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed]
        });


    });

    const http = require('http');
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Bot is running');
    });
    server.listen(3000);

    s4d.client.on('messageUpdate', async (oldMessage, newMessage) => {
        s4dmessage = newMessage
        if ((newMessage.content) == 'https://tenor.com/view/rick-astley-never-gonna-give-you-up-rickroll-dance-moves-dancing-guy-gif-20856902') {
            if ((newMessage.member.user.id) == '939129451046920253') {
                await delay(Number(4) * 1000);
                newMessage.delete()
            }
        }

    });

    s4d.client.on('interactionCreate', async (interaction) => {
        let member = interaction.guild.members.cache.get(interaction.member.user.id)
        if (s4d.database.get(String('botban')).indexOf(String(interaction.member.user)) + 1 == 0) {
            if ((interaction.commandName) == 'bot') {
                if ((interaction.options.getSubcommand()) == 'shutdown') {
                    if ((interaction.member).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                        await interaction.reply({
                            content: 'shuting down...',
                            ephemeral: true || false,
                            components: []
                        });
                        await delay(Number(2) * 1000);
                        s4d.client.destroy();
                    } else {
                        await interaction.reply({
                            content: '<a:youtried:939133664887988264>',
                            ephemeral: true || false,
                            components: []
                        });
                    }
                } else if ((interaction.options.getSubcommand()) == 'info') {
                    let bot = new MessageEmbed()
                    bot.setTitle('Help');
                    bot.addField('Guilds', String(s4d.client.guilds.cache.size), true);
                    bot.addField('Users', String(s4d.client.users.cache.size), true);
                    bot.addField('Info', ['Ram: `', Math.round((Number((os.totalmem()))) - (Number((os.freemem())))), '/', Math.round(Number((os.totalmem()))), ' MB (', Math.round((((Number((os.totalmem()))) - (Number((os.freemem())))) / (Number((os.totalmem())))) * 100), '%)`', '\n', 'Version: `v1.0.0`'].join(''), true);
                    bot.addField('Other', ['Commands used: ', s4d.database.get(String('commands')), '\n', 'Server uptime: ', Math.round((Number((miliConverter.secsMinsHoursDays((os.sysUptime() * 1000), "string")))) / 60) < 120 ? Math.round((Number((miliConverter.secsMinsHoursDays((os.sysUptime() * 1000), "string")))) / 60) : Math.round(((Number((miliConverter.secsMinsHoursDays((os.sysUptime() * 1000), "string")))) / 60) / 60), Math.round((Number((miliConverter.secsMinsHoursDays((os.sysUptime() * 1000), "string")))) / 60) < 120 ? ' mins' : ' hours', '\n', 'Bot uptime: ', Math.round(((Math.floor(new Date().getTime() / 1000)) - botuptime) / 60) > 120 ? Math.round((((Math.floor(new Date().getTime() / 1000)) - botuptime) / 60) / 60) : Math.round(((Math.floor(new Date().getTime() / 1000)) - botuptime) / 60), Math.round(((Math.floor(new Date().getTime() / 1000)) - botuptime) / 60) > 120 ? ' hours' : ' mins'].join(''), false);
                    bot.setColor(s4dcolor);
                    await interaction.reply({
                        embeds: [bot]
                    });
                } else if ((interaction.options.getSubcommand()) == 'ban') {
                    if ((interaction.member).permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                        if ((interaction.options.getUser('add')) != null) {
                            if (!(((interaction.guild).members.cache.get(((interaction.options.getUser('add')).id)) || await (interaction.guild).members.fetch(((interaction.options.getUser('add')).id)))).permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
                                member = String(interaction.options.getUser('add'));
                                databaseargs = s4d.database.get(String('botban'));
                                if (databaseargs.indexOf(member) + 1 == 0) {
                                    databaseargs.push(member);
                                    s4d.database.set(String('botban'), databaseargs);
                                    await interaction.reply({
                                        content: (String((interaction.options.getUser('add')).username) + ' has been banned from using me'),
                                        ephemeral: true || false,
                                        components: []
                                    });
                                } else {
                                    await interaction.reply({
                                        content: (String((interaction.options.getUser('add')).username) + ' has been already bot banned'),
                                        ephemeral: true || false,
                                        components: []
                                    });
                                }
                            } else {
                                await interaction.reply({
                                    content: (String((interaction.options.getUser('add')).username) + ' can´t be bot banned'),
                                    ephemeral: true || false,
                                    components: []
                                });
                            }
                        } else if ((interaction.options.getUser('remove')) != null) {
                            databaseargs = s4d.database.get(String('botban'));
                            if (databaseargs.indexOf(interaction.options.getUser('remove')) + 1 != 0) {
                                databaseargs.splice(((databaseargs.indexOf(interaction.options.getUser('remove')) + 1) - 1), 1);
                                s4d.database.set(String('botban'), databaseargs);
                                await interaction.reply({
                                    content: (String((interaction.options.getUser('remove')).username) + ' has been unbanned from using me'),
                                    ephemeral: true || false,
                                    components: []
                                });
                            } else {
                                await interaction.reply({
                                    content: (String((interaction.options.getUser('remove')).username) + ' is not bot banned'),
                                    ephemeral: true || false,
                                    components: []
                                });
                            }
                        } else {
                            await interaction.reply({
                                content: 'This command is used to ban user from using me',
                                ephemeral: true || false,
                                components: []
                            });
                        }
                    } else {
                        await interaction.reply({
                            content: '<a:youtried:939133664887988264>',
                            ephemeral: true || false,
                            components: []
                        });
                    }
                }
            } else if ((interaction.commandName) == 'help') {
                let Help = new MessageEmbed()
                Help.setTitle('Help');
                Help.setColor(s4dcolor);
                Help.setDescription(['**note: Bot is currently in testing so not many commands are there **', '\n', '\n', '**__BOT__**', '\n', 'help - display this command' + '\n' +
                    'bot - see bot stats (bot shutdown - admin only)' + '\n' +
                    'server - shows info about the server' + '\n' +
                    'autopublish - autopublish message from announcement channel use without args for more info' + '\n' +
                    'color - get info about color'
                ].join(''));
                await interaction.reply({
                    embeds: [Help]
                });
            } else if ((interaction.commandName) == 'server') {
                var embed = new Discord.MessageEmbed()
                embed.setAuthor(((interaction.guild).name), ((interaction.guild).iconURL({
                    dynamic: true
                })));
                embed.setThumbnail(((interaction.guild).iconURL({
                    dynamic: true
                })));
                embed.setColor(s4dcolor);
                embed.addField('🆔 **Server ID:**', (String((interaction.guild).id)), false);
                embed.addField('📅 **Created**', (['<t:', '1642428300', ':R>'].join('')), true);
                embed.addField('👑** Owned by**', (['<@!', String((s4d.client.guilds.cache.get('932651844344373278')).ownerId), '>'].join('')), true);
                embed.addField((['🫂 **Members (', (interaction.guild).members.cache.filter(m => !m.user.bot).size, ')**'].join('')), ([(interaction.guild).premiumTier, ' boost level', '\n', (interaction.guild).roles.cache.size, ' roles', '\n', (interaction.guild).channels.cache.size, ' channels'].join('')), true);
                await interaction.reply({
                    embeds: [(embed)],
                    ephemeral: false,
                    components: []
                });

            } else if ((interaction.commandName) == 'color') {
                https.get(('https://api.popcat.xyz/color/' + String(interaction.options.getString('hex'))), async resp => {
                        let data2 = "";
                        resp.on("data", async chunk => {
                            data2 += chunk;
                        });
                        resp.on("end", async () => {
                            let data = JSON.parse(data2)
                            if ((data.error) == 'Not valid!' || (data.stauts) == '500') {
                                var embed = new Discord.MessageEmbed()
                                embed.setTitle('Color');
                                embed.setColor('#ff0000');
                                embed.setDescription('Not valid!');
                                await interaction.reply({
                                    embeds: [(embed)],
                                    ephemeral: true,
                                    components: []
                                });

                            } else if ((data.statusCode) == '429') {
                                var embed = new Discord.MessageEmbed()
                                embed.setTitle('Color');
                                embed.setColor('#ff0000');
                                embed.setDescription('You are Ratelimited!');
                                await interaction.reply({
                                    embeds: [(embed)],
                                    ephemeral: true,
                                    components: []
                                });

                            } else {
                                color = (data.hex);
                                var embed = new Discord.MessageEmbed()
                                embed.setTitle((data.name));
                                embed.setColor(color);
                                embed.addField('Hex', (data.hex), true);
                                embed.addField('RGB', (subsequenceFromStartFromEnd(data.rgb, 4, 1)), true);
                                embed.setImage((['https://serux.pro/rendercolour?hex=', interaction.options.getString('hex'), '&height=100&width=225'].join('')));
                                await interaction.reply({
                                    embeds: [(embed)],
                                    ephemeral: false,
                                    components: []
                                });

                            }

                        });
                    })
                    .on("error", async err => {
                        console.log("Error: " + err.message);
                    });
            } else if ((interaction.commandName) == 'autopublish') {
                if (s4d.database.has(String((String((interaction.guild).id) + '-autopublish')))) {
                    databaseargs = s4d.database.get(String((String((interaction.guild).id) + '-autopublish')));
                } else {
                    databaseargs = false;
                }
                if ((interaction.options.getSubcommand()) == 'list') {
                    if (databaseargs.length > 0) {
                        await interaction.reply({
                            content: (['autopublish channels - <#', databaseargs.join('> , <#'), '>'].join('')),
                            ephemeral: false || false,
                            components: []
                        });
                    } else {
                        await interaction.reply({
                            content: 'no channels set yet',
                            ephemeral: false || false,
                            components: []
                        });
                    }
                } else if ((interaction.options.getSubcommand()) == 'add') {
                    if ((interaction.member).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                        channelid = subsequenceFromStartFromEnd(String(interaction.options.getChannel('channel')), 2, 1);
                        try {
                            if (((interaction.options.getChannel('channel')).type) == 'GUILD_NEWS') {
                                if (databaseargs != false) {
                                    if (s4d.database.get(String((String((interaction.guild).id) + '-autopublish'))).indexOf(channelid) + 1 == 0) {
                                        databaseargs.push(channelid);
                                        s4d.database.set(String((String((interaction.guild).id) + '-autopublish')), databaseargs);
                                        await interaction.reply({
                                            content: ':thumbsup: ',
                                            ephemeral: true || false,
                                            components: []
                                        });
                                    } else {
                                        await interaction.reply({
                                            content: 'This channel is already registered',
                                            ephemeral: true || false,
                                            components: []
                                        });
                                    }
                                } else {
                                    databaseargs[0] = channelid;
                                    s4d.database.set(String((String((interaction.guild).id) + '-autopublish')), databaseargs);
                                    await interaction.reply({
                                        content: ':thumbsup: ',
                                        ephemeral: true || false,
                                        components: []
                                    });
                                }
                            } else {
                                await interaction.reply({
                                    content: 'This channel either doesn´t exist or is not set to Announcements ',
                                    ephemeral: true || false,
                                    components: []
                                });
                            }

                        } catch (err) {
                            await interaction.reply({
                                content: 'This channel either doesn´t exist or is not set to Announcements ',
                                ephemeral: true || false,
                                components: []
                            });

                        };
                    } else {
                        await interaction.reply({
                            content: 'You are missing permission `Administrator`',
                            ephemeral: true || false,
                            components: []
                        });
                    }
                } else if ((interaction.options.getSubcommand()) == 'remove') {
                    if ((interaction.member).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                        channelid = subsequenceFromStartFromEnd(String(interaction.options.getChannel('channel')), 2, 1);
                        if (s4d.database.has(String((String((interaction.guild).id) + '-autopublish')))) {
                            if (s4d.database.get(String((String((interaction.guild).id) + '-autopublish'))).indexOf(channelid) + 1 != 0) {
                                databaseargs.splice(((databaseargs.indexOf(channelid) + 1) - 1), 1);
                                s4d.database.set(String((String((interaction.guild).id) + '-autopublish')), databaseargs);
                                await interaction.reply({
                                    content: ':thumbsup: ',
                                    ephemeral: true || false,
                                    components: []
                                });
                            } else {
                                await interaction.reply({
                                    content: 'channel is not followed',
                                    ephemeral: true || false,
                                    components: []
                                });
                            }
                        } else {
                            await interaction.reply({
                                content: '0 channels are followed',
                                ephemeral: true || false,
                                components: []
                            });
                        }
                    } else {
                        await interaction.reply({
                            content: 'You are missing permission `Administrator`',
                            ephemeral: true || false,
                            components: []
                        });
                    }
                }
            } else if ((interaction.commandName) == 'rickroll') {
                if ((interaction.commandName) == 'rickroll') {
                    await interaction.reply({
                        content: 'Never gonna give you up',
                        ephemeral: false || false,
                        components: []
                    });
                    await delay(Number(1.7) * 1000);
                    await interaction.editReply({
                        content: 'Never gonna let you down',
                        components: []
                    });
                    await delay(Number(1.7) * 1000);
                    await interaction.editReply({
                        content: 'Never gonna run around and desert you',
                        components: []
                    });
                    await delay(Number(1.7) * 1000);
                    await interaction.editReply({
                        content: 'Never gonna make you cry',
                        components: []
                    });
                    await delay(Number(1.7) * 1000);
                    await interaction.editReply({
                        content: 'Never gonna say goodbye',
                        components: []
                    });
                    await delay(Number(1.7) * 1000);
                    await interaction.editReply({
                        content: 'Never gonna tell a lie and hurt you',
                        components: []
                    });
                    await delay(Number(1.7) * 1000);
                    await interaction.editReply({
                        content: 'https://tenor.com/view/rick-astley-never-gonna-give-you-up-rickroll-dance-moves-dancing-guy-gif-20856902',
                        components: []
                    });
                }
            } else if ((interaction.commandName) == 'youtube') {
                try {
                    voice = (member.voice.channelId);
                    s4d.client.discordTogether.createTogetherCode(voice, "youtube").then(async invite => {
                        await interaction.reply({
                            content: (invite.code),
                            ephemeral: true || false,
                            components: []
                        });

                    })
                } catch (err) {
                    await interaction.reply({
                        content: 'you aren´t in a voice channel',
                        ephemeral: true || false,
                        components: []
                    });
                    console.log((err));

                };
            } else if ((interaction.commandName) == 'report') {
                var embed = new Discord.MessageEmbed()
                embed.setTitle('🚨 REPORT 🚨')
                    .setURL();
                embed.setDescription((['**author: **', interaction.member.user, ' - ', (interaction.member.user).id, '\n', '**offender: **', interaction.options.getUser('user'), ' - ', (interaction.options.getUser('user')).id, '\n', '**message: **', interaction.options.getString('reason')].join('')));
                embed.setColor(s4dcolor);
                s4d.client.channels.cache.get('932651845724291084').send({
                    embeds: [embed]
                });

                await interaction.reply({
                    content: 'Thanks for your report, please wait until the staff team view it, in meantime take a cookie 🍪!',
                    ephemeral: true || false,
                    components: []
                });
            } else if ((interaction.commandName) == 'links') {
                if ((interaction.options.getString('link')) == 's4d') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Official s4d website')
                        .setURL();
                    embed.setDescription(('Here is the link for [Scratch for Discord](' + 'https://scratch-for-discord.com/)'));
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('link')) == 'slash') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Slash register')
                        .setURL();
                    embed.setDescription(('Here is the link for [slash register](' + 'https://slash-commands-gui.androz2091.fr/)'));
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('link')) == 'replit') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Replit')
                        .setURL();
                    embed.setDescription(('Here is the link for [Replit](' + 'https://replit.com/~)'));
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('link')) == 'uptimerobot') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Replit')
                        .setURL();
                    embed.setDescription(('Here is the link for [UptimeRobot](' + 'https://uptimerobot.com/)'));
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                }
            } else if ((interaction.commandName) == '247') {
                var embed = new Discord.MessageEmbed()
                embed.setColor(s4dcolor);
                embed.setTitle('Wants to run the bot 24/7 for free?')
                    .setURL();
                embed.addField('1st Method', 'If you are using preview 469 then use build in block called `Create Webserver With Text Block` and put anything there', false);
                embed.addField('2nd Method', ('server.js is outdated and doesn´t work anymore, so use 1st method' + ''), false);
                embed.addField('note', ('You will get a link which is your monitor url on [UptimeRobot](https://uptimerobot.com/)' + ''), false);
                await interaction.reply({
                    embeds: [(embed)],
                    ephemeral: false,
                    components: []
                });

            } else if ((interaction.commandName) == 'errors') {
                if ((interaction.options.getString('error')) == 'node16') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Update to node 16')
                        .setURL();
                    embed.addField('Change scripts part in "package.json" to this', ('  "scripts": {' + '\n' +
                        '    "start": "npm i && node .",' + '\n' +
                        '    "node-update": "npm i --save-dev node@17 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH",' + '\n' +
                        '    "node-clean": "rm -rf node_modules && rm package-lock.json && npm cache clear --force && npm cache clean --force && npm i"' + '\n' +
                        '  },'), false);
                    embed.setFooter('It is recommended to use preview 469 or 454', );
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('error')) == 'module') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Cannot find module X')
                        .setURL();
                    embed.addField('run:', 'npm i [module]', false);
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('error')) == 'events') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Cannot find module \'node:events\'')
                        .setURL();
                    embed.addField('Solution', ('Use the newest previews (such as 469) + install Node.js v16 and Discord.js v13'), false);
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('error')) == 'app') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Bot keeps loading forever, logged in as Unknown#0000')
                        .setURL();
                    embed.addField('Solution', 'Hosting directly on the desktop app has stopped working on newer versions. So, it is recommended to host on [Replit](https://repl.it/)', false);
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('error')) == 'Intents') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('Shows \'code loaded\' but doesn\'t start the bot')
                        .setURL();
                    embed.addField('Solution', ('Go to [discord dev](https://discord.com/developers/applications)' + '\n' +
                        '→ Choose your bot' + '\n' +
                        '→ Go to Bot Tab' + '\n' +
                        '→ Scroll down to "Privileged Gateway Intents"' + '\n' +
                        '→ checkmark the first three options.'), false);
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('error')) == 'index') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('index.js error')
                        .setURL();
                    embed.addField('Solution', ('click the 3 dots in the left menu and click on "show hidden files" ' + '\n' +
                        'replace .replit with' + '\n' +
                        '`run = "npm start"' + '\n' +
                        'entrypoint = "bot.js"`'), false);
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                } else if ((interaction.options.getString('error')) == 'database') {
                    var embed = new Discord.MessageEmbed()
                    embed.setColor(s4dcolor);
                    embed.setTitle('unexpected end of an json input')
                        .setURL();
                    embed.addField('Solution', ('go to database.json' + '\n' +
                        'make sure it starts with `{` and ends with `}`' + '\n' +
                        'and last value has not comma'), false);
                    await interaction.reply({
                        embeds: [(embed)],
                        ephemeral: false,
                        components: []
                    });

                }
            } else if ((interaction.commandName) == 'preview') {
                var embed = new Discord.MessageEmbed()
                embed.setColor(s4dcolor);
                embed.setTitle('preview')
                    .setURL();
                if ((interaction.options.getInteger('link')) != null) {
                    embed.setDescription((['Here is the [', interaction.options.getInteger('link'), '](', 'https://deploy-preview-', interaction.options.getInteger('link'), '--scratch-for-discord.netlify.app) link'].join('')));
                } else {
                    embed.setDescription((['Here is the [', 'original', '](', 'https://scratch-for-discord.netlify.app/)', ' link'].join('')));
                }
                await interaction.reply({
                    embeds: [(embed)],
                    ephemeral: false,
                    components: []
                });

            } else if ((interaction.commandName) == 'autoresponse') {
                if (((interaction.member)._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('932651844457607220')).id)) || ((interaction.member)._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('932651844428251195')).id))) {
                    if ((interaction.options.getSubcommand()) == 'show') {
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

                    } else if ((interaction.options.getSubcommand()) == 'set') {
                        database2.set(String((interaction.options.getString('keyword'))), [interaction.options.getString('name'), interaction.options.getString('description')]);
                        await interaction.reply({
                            content: (['added `', interaction.options.getString('keyword'), '` to database"'].join('')),
                            ephemeral: true || false,
                            components: []
                        });
                    } else if ((interaction.options.getSubcommand()) == 'remove') {
                        if (database2.has(String((interaction.options.getString('keyword'))))) {
                            database2.delete(String((interaction.options.getString('keyword'))));
                            await interaction.reply({
                                content: (['Keyword `', interaction.options.getString('keyword'), '` removed'].join('')),
                                ephemeral: true || false,
                                components: []
                            });
                        } else {
                            await interaction.reply({
                                content: (['Keyword `', interaction.options.getString('keyword'), '` not found'].join('')),
                                ephemeral: true || false,
                                components: []
                            });
                        }
                    }
                } else {
                    await interaction.reply({
                        content: 'You dont have access to use this command!',
                        ephemeral: true || false,
                        components: []
                    });
                }
            } else if (false) {
                return
            } else {
                return
            }
            s4d.database.add(String('commands'), parseInt(1));
        } else {
            await interaction.reply({
                content: 'you are bot banned from using me',
                ephemeral: true || false,
                components: []
            });
        }

    });

    s4d.client.on('messageCreate', async (s4dmessage) => {
        if (((s4dmessage.channel).type) == 'GUILD_NEWS') {
            if (s4d.database.has(String((String((s4dmessage.guild).id) + '-autopublish')))) {
                if ((s4dmessage.member.id) == '939129451046920253') {
                    s4dmessage.delete();
                } else {
                    if (s4d.database.get(String((String((s4dmessage.guild).id) + '-autopublish'))).indexOf(subsequenceFromStartFromEnd(String(s4dmessage.channel), 2, 1)) + 1 != 0) {
                        eval('s4dmessage.crosspost()');
                    }
                }
            }
        } else if (thread_channels.indexOf((s4dmessage.channel).id) + 1 != 0) {
            if (((s4dmessage.member)._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('933990402078408715')).id)) && (((s4dmessage.content) || '').startsWith('-' || ''))) {
                return
            } else {
                if (!((s4dmessage.member.user).bot)) {
                    if (((s4dmessage.channel).id) == '932651844973502472') {
                        channel_name = 'Support ';
                        s4dmessage.react('✋');
                        s4dmessage.react('✨');
                        s4dmessage.react('❓');
                        s4dmessage.react('❌');
                    } else if (((s4dmessage.channel).id) == '932651845212573730') {
                        channel_name = 'Feedback ';
                        s4dmessage.react('👍');
                        s4dmessage.react('👎');
                        s4dmessage.react('✅');
                        s4dmessage.react('❌');
                    } else if (((s4dmessage.channel).id) == '932651845212573733') {
                        channel_name = 'Bug ';
                        s4dmessage.react('🔎');
                        s4dmessage.react('🐛');
                        s4dmessage.react('🔧');
                        s4dmessage.react('✨');
                        s4dmessage.react('❌');
                        s4dmessage.react('👍');
                        s4dmessage.react('👎');
                    } else {
                        channel_name = 'Script ';
                        s4dmessage.react('👍');
                        s4dmessage.react('👎');
                        s4dmessage.react('❔');
                    }
                    channel_name = String(channel_name) + String(database1.get(String((String((s4dmessage.channel).id) + '-thread'))));
                    s4dmessage.startThread({
                            name: channel_name,
                            autoArchiveDuration: 10080
                        })
                        .then(async s4dCreatedThread => {

                        })
                        .catch(async s4dThreadErr => {
                            if (String(s4dThreadErr) === 'DiscordAPIError: Guild premium subscription level too low') {
                                s4dmessage.startThread({
                                        name: channel_name,
                                        autoArchiveDuration: 4320
                                    })
                                    .then(async s4dCreatedThread => {

                                    })
                                    .catch(async s4dThreadErr => {
                                        if (String(s4dThreadErr) === 'DiscordAPIError: Guild premium subscription level too low') {
                                            s4dmessage.startThread({
                                                    name: channel_name,
                                                    autoArchiveDuration: 1440
                                                })
                                                .then(async s4dCreatedThread => {

                                                })
                                                .catch(async s4dThreadErr => {
                                                    if (String(s4dThreadErr) === 'DiscordAPIError: Guild premium subscription level too low') {
                                                        s4dmessage.startThread({
                                                                name: channel_name,
                                                                autoArchiveDuration: 60
                                                            })
                                                            .then(async s4dCreatedThread => {

                                                            })
                                                            .catch(async s4dThreadErr => {
                                                                if (String(s4dThreadErr) === 'DiscordAPIError: Guild premium subscription level too low') {

                                                                }
                                                            });

                                                    }
                                                });

                                        }
                                    });

                            }
                        });
                    database1.add(String((String((s4dmessage.channel).id) + '-thread')), parseInt(1));
                    s4d.database.set(String(([(s4dmessage.channel).id, '-', s4dmessage.id].join(''))), 'unstatuated');
                }
            }
        } else if ((s4dmessage.channel) == s4d.client.channels.cache.get('1010545985006600292')) {
            if (!((s4dmessage.member.user).bot)) {
                key_reply = true;
                keys_names = [];
                var JSONdataS4D = JSON.parse(fs.readFileSync('autoresponse.json'));
                Object.keys(JSONdataS4D).forEach(async s4dkey => {
                    if (String(((s4dmessage.content).toLowerCase())).includes(String((s4dkey)))) {
                        key_reply = false;
                        var embed = new Discord.MessageEmbed();
                        embed.setAuthor({
                            name: String('Interactive Automated Support Request'),
                            iconURL: String('')
                        });
                        embed.setDescription(String((['**Name: **', textToTitleCase((JSONdataS4D[String((s4dkey))])[0]), '\n', '**Detected Keyword: **`', s4dkey, '`', '\n', (JSONdataS4D[String((s4dkey))])[1]].join(''))));
                        embed.setColor((colourRandom()));
                        s4dmessage.reply({
                            embeds: [embed],
                            allowedMentions: {
                                repliedUser: true
                            }
                        });

                        return
                    }
                    if (key_reply == true) {
                        if ((s4dmessage.content).length >= 3) {
                            if ((String(((JSONdataS4D[String((s4dkey))])[0].toLowerCase())).includes(String(((s4dmessage.content).toLowerCase())))) || (String(((s4dmessage.content).toLowerCase())).includes(String(((JSONdataS4D[String((s4dkey))])[0].toLowerCase())))) || (String(((s4dmessage.content).toLowerCase())).includes(String(((JSONdataS4D[String((s4dkey))])[0].toLowerCase().split('/')[0])))) || (String(((s4dmessage.content).toLowerCase())).includes(String(((JSONdataS4D[String((s4dkey))])[0].toLowerCase().split('/').slice(-1)[0]))))) {
                                keys_names.push((s4dkey));
                            }
                        }
                    }

                })
                await delay(Number(1) * 1000);
                if (key_reply == true) {
                    if (keys_names.length > 0) {
                        s4dmessage.reply({
                            content: String((['Found these keys for your query `', keys_names.join('`, `'), '`', ''].join(''))),
                            allowedMentions: {
                                repliedUser: true
                            }
                        });
                    }
                }
            }
        } else if ('<@!939129451046920253>' == (s4dmessage.content)) {
            s4dmessage.reply({
                content: String((['Hi ', (s4dmessage.member.user).username, ', i have only slash commands!'].join(''))),
                allowedMentions: {
                    repliedUser: true
                }
            });
        }

    });

    s4d.client.on('emojiUpdate', async (emoji) => {
        var embed = new Discord.MessageEmbed();
        embed.setColor('#6666cc');
        embed.setTitle(String('Emoji Deleted'))
        embed.setDescription(String((['Name: ', oldEmoji.name, '/', newEmoji.name, '\n', 'Url: ', newEmoji.url, '\n', 'User: ', newEmoji.author].join(''))));
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed]
        });


    });

    s4d.client.on('messageReactionAdd', async (reaction, user) => {
        if (!((user).bot)) {
            member = ((user).id);
            if (s4d.database.has(String(('932651845212573730-' + String(reaction.message.id))))) {
                if ((reaction.emoji.name) == '✅' || (reaction.emoji.name) == '❌') {
                    if (!((((s4d.client.guilds.cache.get('932651844344373278')).members.cache.get(member) || await (s4d.client.guilds.cache.get('932651844344373278')).members.fetch(member)))._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('933990402078408715')).id))) {
                        try {
                            (reaction.message).reactions.cache.get('✅').remove()

                        } catch (err) {

                        };
                        await delay(Number(0.5) * 1000);
                        try {
                            (reaction.message).reactions.cache.get('❌').remove()

                        } catch (err) {

                        };
                        await delay(Number(5) * 1000);
                        s4d.client.channels.cache.get('932651845212573730').messages.fetch((reaction.message.id)).then(async (s4dmessage) => {
                            s4dmessage.react('✅');
                            s4dmessage.react('❌');
                        });
                    } else {
                        if ((reaction.emoji.name) == '❌') {
                            try {
                                (reaction.message).reactions.cache.get('✅').remove()

                            } catch (err) {

                            };
                            s4d.database.delete(String(('932651845212573730-' + String(reaction.message.id))));
                        } else if ((reaction.emoji.name) == '✅') {
                            try {
                                (reaction.message).reactions.cache.get('❌').remove()

                            } catch (err) {

                            };
                            s4d.database.delete(String(('932651845212573730-' + String(reaction.message.id))));
                        }
                    }
                }
            } else if (s4d.database.has(String(('932651845212573733-' + String(reaction.message.id))))) {
                if ((reaction.emoji.name) == '🔎' || (reaction.emoji.name) == '🔧' || (reaction.emoji.name) == '✨' || (reaction.emoji.name) == '🐛' || (reaction.emoji.name) == '❌') {
                    if ((((s4d.client.guilds.cache.get('932651844344373278')).members.cache.get(member) || await (s4d.client.guilds.cache.get('932651844344373278')).members.fetch(member)))._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('933990402078408715')).id)) {
                        if ((reaction.emoji.name) == '🔎') {
                            try {
                                (reaction.message).reactions.cache.get('🔧').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('✨').remove()

                            } catch (err) {

                            };
                            await delay(Number(0.5) * 1000);
                            s4d.client.channels.cache.get('932651845212573733').messages.fetch((reaction.message.id)).then(async (s4dmessage) => {
                                s4dmessage.react('❌');
                                s4dmessage.react('🐛');
                            });
                        } else if ((reaction.emoji.name) == '🔧') {
                            try {
                                (reaction.message).reactions.cache.get('🔎').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('❌').remove()

                            } catch (err) {

                            };
                            await delay(Number(0.5) * 1000);
                            s4d.client.channels.cache.get('932651845212573733').messages.fetch((reaction.message.id)).then(async (s4dmessage) => {
                                s4dmessage.react('✨');
                                s4dmessage.react('🐛');
                            });
                            s4d.client.channels.cache.get('932651845212573733').send({
                                content: String((reaction.message.id))
                            });
                        } else if ((reaction.emoji.name) == '✨') {
                            try {
                                (reaction.message).reactions.cache.get('🔎').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('❌').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('🐛').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('🔧').remove()

                            } catch (err) {

                            };
                            s4d.database.delete(String(('932651845212573733-' + String(reaction.message.id))));
                        } else if ((reaction.emoji.name) == '🐛') {
                            try {
                                (reaction.message).reactions.cache.get('🔎').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('❌').remove()

                            } catch (err) {

                            };
                            await delay(Number(0.5) * 1000);
                            s4d.client.channels.cache.get('932651845212573733').messages.fetch((reaction.message.id)).then(async (s4dmessage) => {
                                s4dmessage.react('🔧');
                                s4dmessage.react('✨');
                            });
                        } else if ((reaction.emoji.name) == '❌') {
                            try {
                                (reaction.message).reactions.cache.get('🔧').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('🐛').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('❌').remove()

                            } catch (err) {

                            };
                            try {
                                (reaction.message).reactions.cache.get('🔎').remove()

                            } catch (err) {

                            };
                            s4d.database.delete(String(('932651845212573733-' + String(reaction.message.id))));
                        }
                    } else {
                        return
                    }
                }
            } else if (s4d.database.has(String(('932651844973502472-' + String(reaction.message.id))))) {
                if ((((s4d.client.guilds.cache.get('932651844344373278')).members.cache.get(member) || await (s4d.client.guilds.cache.get('932651844344373278')).members.fetch(member)))._roles.includes(((s4d.client.guilds.cache.get('932651844344373278')).roles.cache.get('933990402078408715')).id)) {
                    if ((reaction.emoji.name) == '✨') {
                        try {
                            (reaction.message).reactions.cache.get('❌').remove()

                        } catch (err) {

                        };
                        await delay(Number(0.5) * 1000);
                        try {
                            (reaction.message).reactions.cache.get('❓').remove()

                        } catch (err) {

                        };
                        await delay(Number(0.5) * 1000);
                        try {
                            (reaction.message).reactions.cache.get('✋').remove()

                        } catch (err) {

                        };
                        s4d.database.delete(String(('932651844973502472-' + String(reaction.message.id))));
                    } else if ((reaction.emoji.name) == '❌') {
                        try {
                            (reaction.message).reactions.cache.get('✋').remove()

                        } catch (err) {

                        };
                        await delay(Number(0.5) * 1000);
                        try {
                            (reaction.message).reactions.cache.get('❓').remove()

                        } catch (err) {

                        };
                        await delay(Number(0.5) * 1000);
                        try {
                            (reaction.message).reactions.cache.get('✨').remove()

                        } catch (err) {

                        };
                        s4d.database.delete(String(('932651844973502472-' + String(reaction.message.id))));
                    }
                } else {
                    return
                }
            } else if (false) {}
        }

    });

    s4d.client.on('emojiCreate', async (emoji) => {
        var embed = new Discord.MessageEmbed();
        embed.setColor('#6666cc');
        embed.setTitle(String('Emoji Created'))
        embed.setDescription(String((['Name: ', emoji.name, '\n', 'Url: ', emoji.url, '\n', 'User: ', emoji.author].join(''))));
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed]
        });


    });

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
        if (!!String(channel_update_old.join(', ')).length) {
            var embed = new Discord.MessageEmbed();
            embed.setColor('#6666cc');
            embed.setTitle(String('Server Updated'))
            embed.addField(String('Before'), String((String(channel_update_old.join(', ')) + '')), false);
            embed.addField(String('After'), String((String(channel_update.join(', ')) + '')), false);
            s4d.client.channels.cache.get('933175093016789074').send({
                embeds: [embed]
            });

        }

    });

    const database1 = new Database('./database.json')
    s4d.client.on('emojiDelete', async (emoji) => {
        var embed = new Discord.MessageEmbed();
        embed.setColor('#6666cc');
        embed.setTitle(String('Emoji Deleted'))
        embed.setDescription(String((['Name: ', emoji.name, '\n', 'Url: ', emoji.url, '\n', 'User: ', emoji.author].join(''))));
        s4d.client.channels.cache.get('933175093016789074').send({
            embeds: [embed]
        });


    });

    const database2 = new Database('./autoresponse.json')
    return s4d
})();
