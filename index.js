const
    startTimestamp = new Date(),
    {
        GatewayIntentBits,
        REST,
        ActivityType,
        Events,
        SlashCommandBuilder,
        EmbedBuilder,
        Routes,
        PermissionFlagsBits,
        Client,
        isJSONEncodable,
        SlashCommandStringOption,
        PermissionsBitField
    } = require('discord.js'),
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildWebhooks,
        ]
    }),
    fs = require('fs'),
    jsdom = require('jsdom'),
    path = require('path'),
    config = require(path.join(__dirname, 'config.json')),
    rest = new REST({ version: '10' }).setToken(config.token);
let db = loadJSON(path.join(__dirname, 'database.json'));

const
    urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    hexRegex = /#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g,
    scripts = {
        events: {
            interactionCreate: {
                bot_learn: {
                    data: new SlashCommandBuilder()
                        .setName('bot_learn').setNameLocalizations({ ru: 'обучение_бота' })
                        .setDescription('Train the bot to speak').setDescriptionLocalizations({ ru: 'Обучите бота говорить' })

                        .addSubcommand(subcommand => subcommand.setName('info')
                            .setNameLocalizations({ ru: 'информация' })
                            .setDescription('Information')
                            .setDescriptionLocalizations({ ru: 'Информация' })
                        )
                        .addSubcommand(subcommand => subcommand.setName('options')
                            .setNameLocalizations({ ru: 'опции' })
                            .setDescription('Parameters')
                            .setDescriptionLocalizations({ ru: 'Параметры' })

                            .addBooleanOption(option => option.setName('toggle')
                                .setNameLocalizations({ ru: 'выключатель' })
                                .setDescription('Enable training in this channel?')
                                .setDescriptionLocalizations({ ru: 'Включить обучение в этом канале?' })
                            )
                            .addStringOption(option => option.setName('reply_chance')
                                .setNameLocalizations({ ru: 'шанс_ответа' })
                                .setDescription('The chance that the bot will respond to the message (0 - 1)')
                                .setDescriptionLocalizations({ ru: 'Шанс, что бот ответит на сообщение (0 - 1)' })
                            )
                            .addStringOption(option => option.setName('search_engine')
                                .setNameLocalizations({ ru: 'поисковой_движок' })
                                .setDescription('Response selection engine')
                                .setDescriptionLocalizations({ ru: 'Движок подбора ответа' })
                                .addChoices(
                                    {
                                        name: 'simple (a = b)',
                                        name_localizations: { ru: 'простой (a = b)' },
                                        value: 'simple'
                                    },
                                    {
                                        name: 'hard (a ~= b)',
                                        name_localizations: { ru: 'сложный (a ~= b)' },
                                        value: 'hard'
                                    },
                                )
                            )
                        )
                        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
                    async execute(interaction) {
                        const l = interaction.locale;
                        const subcommand = interaction.options.getSubcommand();
                        const toggle = interaction.options.getBoolean('toggle');
                        const searchEngine = interaction.options.getString('search_engine');
                        const replyChance = (() => {
                            let value = interaction.options.getString('reply_chance');
                            if (value > 1) { value = 1; };
                            if (value < 0) { value = 0; };
                            return value;
                        })();

                        function getValue(obj, key, defaultValue = {}) {
                            if (obj[key] == undefined) { obj[key] = defaultValue; };
                            return obj[key];
                        };

                        getValue(db, 'guilds');
                        getValue(db.guilds, interaction.guild.id);
                        getValue(db.guilds[interaction.guild.id], 'channels');
                        getValue(db.guilds[interaction.guild.id].channels, interaction.channel.id);
                        getValue(db.guilds[interaction.guild.id].channels[interaction.channel.id], 'bot_learn');
                        const channelData = db.guilds[interaction.guild.id].channels[interaction.channel.id].bot_learn;
                        getValue(channelData, 'toggle', false);
                        getValue(channelData, 'replyChance', 1);
                        getValue(channelData, 'searchEngine', 'simple');
                        getValue(channelData, 'database');
                        const database = channelData.database;

                        if (toggle != null) {
                            channelData.toggle = toggle;
                        };
                        if (replyChance != null) {
                            channelData.replyChance = replyChance;
                        };
                        if (searchEngine != null) {
                            channelData.searchEngine = searchEngine;
                        };

                        interaction.reply({
                            embeds: [(
                                new EmbedBuilder()
                                    .setTitle(`${l == 'ru' ? 'Обучение' : 'Learning'} ${channelData.toggle} ${l == 'ru' ? 'в' : 'in'} ${interaction.channel.name}`)
                                    .setDescription(`
                                        \`${channelData.replyChance}/1\` ${l == 'ru' ? 'шанс ответа' : 'reply chance'}
                                        \`${channelData.searchEngine}\` ${l == 'ru' ? 'поисковой движок' : 'search engine'}
                                        \`${(() => {
                                            let i = 0;
                                            Object.values(database).forEach(value => i += value.length)
                                            return i;
                                        })()}\` ${l == 'ru' ? 'сохранено ответов' : 'saves reply count'}
                                        \`\`\`Бот говорит лишь то, чему его научили пользователи.\nВключая команду вы соглашаетесь с тем, что автор бота не несёт ответственности за его высказывания.\`\`\`
                                    `)
                                    .setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`)
                            )]
                        });

                        saveJSON(path.join(__dirname, 'database.json'), db);
                        return 'any';
                    },
                },
                chat_gpt: {
                    data: new SlashCommandBuilder()
                        .setName('chat_gpt').setNameLocalizations({ ru: 'чат_гпт' })
                        .setDescription('I will answer the question using chatGPT').setDescriptionLocalizations({ ru: 'Отвечу на вопрос при помощи chatGPT' })
    
                        .addStringOption(option => option.setName('message').setRequired(true)
                            .setNameLocalizations({ ru: 'сообщение' })
                            .setDescription('Message')
                            .setDescriptionLocalizations({ ru: 'Сообщение' })
                        ),
                    async execute(interaction) {
                        const message = interaction.options.getString('message').slice(0, 2000);
                        const { ChatGPTAPI } = await import('chatgpt');
                        const api = (
                            interaction.user.id == 468367650796339201
                                ? new ChatGPTAPI({ apiKey: config.chatGPTkey })
                                : new ChatGPTAPI({ apiKey: config.chatGPTkey, completionParams: { max_tokens: 450 } })
                        );
                        let response;
                        await interaction.deferReply();
                        try {
                            response = (await api.sendMessage(message)).text;
                        } catch (error) {
                            errLog(error);
                            response = (interaction.locale == 'ru' ? 'Не удалось сгенерировать ответ. Попробуйте позже' : 'The response could not be generated. Try again later');
                        };
                        interaction.editReply(response);
                        return { message: message, response: response };
                    },
                },
                /*
                deep_ai: {
                    data: new SlashCommandBuilder()
                        .setName('deep_ai').setNameLocalizations({ ru: 'дип_аи' })
                        .setDescription('I will answer the question using deepAI').setDescriptionLocalizations({ ru: 'Отвечу на вопрос при помощи deepAI' })

                        .addStringOption(option => option.setName('message').setRequired(true)
                            .setNameLocalizations({ ru: 'сообщение' })
                            .setDescription('Message')
                            .setDescriptionLocalizations({ ru: 'Сообщение' })
                        ),
                    async execute(interaction) {
                        const l = interaction.locale;
                        const message = interaction.options.getString('message').slice(0, 2000);
                        const data = new FormData;
                        let response;
                        await interaction.deferReply();
                        data.append('chat_style', 'chat');
                        data.append('chatHistory', JSON.stringify([{ role: 'user', content: message }]));
                        try {
                            await fetch('https://api.deepai.org/hacking_is_a_crime', {
                                credentials: 'include',
                                method: 'POST',
                                body: data,
                                headers: { 'api-key': config.deepAIkey }
                            }).then(result => result.text()).then(content => { response = content; });
                        } catch {
                            response = (l == 'ru' ? 'Не удалось сгенерировать ответ. Попробуйте позже' : 'The response could not be generated. Try again later');
                        };
                        interaction.editReply(response);
                        return { message: message, response: response };
                    },
                },
                clear: {
                    data: new SlashCommandBuilder()
                        .setName('clear').setNameLocalizations({ ru: 'отчистка' })
                        .setDescription('I\'ll clean the chat from messages').setDescriptionLocalizations({ ru: 'Отчищу чат от сообщений' })

                        .addNumberOption(option => option.setName('size').setRequired(true)
                            .setNameLocalizations({ ru: 'размер' })
                            .setDescription('Number of messages')
                            .setDescriptionLocalizations({ ru: 'Кол-во сообщений' })
                            .setMinValue(1).setMaxValue(1024)
                        )
                        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
                    async execute(interaction) {
                        const l = interaction.locale;
                        const deleteCount = interaction.options.getNumber('size') + 1;
                        let deletedMessagesCount = -1;

                        await interaction.reply(
                            `${l == 'ru' ? 'Удаление' : 'Deleted'
                            } ${deleteCount
                            } ${l == 'ru' ? 'сообщений' : 'messages'
                            }...`
                        );

                        await (function deleteMessages(count = 1) {
                            return interaction.channel.messages
                                .fetch({ limit: 100 })
                                .then(messages => {
                                    //console.log(messages)
                                    if (messages.size > 1) {
                                        count -= messages.size;
                                        messages.forEach(message => {
                                            message.delete().catch(error => errLog(error));;
                                            deletedMessagesCount++;
                                        });
                                        if (count > 1) {
                                            return deleteMessages(count);
                                        };
                                    };
                                })
                                .catch(error => errLog(error));
                        })(deleteCount);

                        if (interaction.appPermissions.has(PermissionFlagsBits.SendMessages)) {
                            interaction.channel.send(
                                `<@${interaction.user.id
                                }> ${l == 'ru' ? 'Удалено' : 'Deleted'
                                } ${deletedMessagesCount
                                } ${l == 'ru' ? 'сообщений' : 'messages'
                                }`
                            );
                        };
                        return deletedMessagesCount;
                    },
                },*/
                google_translate: {
                    data: new SlashCommandBuilder()
                        .setName('google_translate').setNameLocalizations({ ru: 'гугл_перевод' })
                        .setDescription('Translate').setDescriptionLocalizations({ ru: 'Перевод' })

                        .addStringOption(option => option.setName('message').setRequired(true)
                            .setNameLocalizations({ ru: 'сообщение' })
                            .setDescription('Message')
                            .setDescriptionLocalizations({ ru: 'Сообщение' })
                        )
                        .addStringOption(option => option.setName('language').setRequired(true)
                            .setNameLocalizations({ ru: 'язык' })
                            .setDescription('Translate to')
                            .setDescriptionLocalizations({ ru: 'Перевести на' })
                            .addChoices(
                                { name: 'ru', value: 'ru' },
                                { name: 'en', value: 'en' },
                                { name: 'fr', value: 'fr' },
                            )
                        ),
                    async execute(interaction) {
                        await interaction.deferReply();
                        const message = interaction.options.getString('message').slice(0, 500);
                        const { translate } = await import('@vitalets/google-translate-api');
                        const response = (await translate(message, { to: interaction.options.getString('language') })).text;
                        interaction.editReply(response);
                        return { message: message, response: response };
                    },
                },
                rp: {
                    data: (() => {
                        function arrayLoader(array = [], startIndex = 0, count = 25) {
                            const result = [];
                            for (let i = startIndex; i < array.length && i < startIndex + count; i++) {
                                array[i].value = JSON.stringify(array[i].value);
                                result.push(array[i]);
                            };
                            return result;
                        };
                        const actList = [
                            {
                                name: 'Kiss',
                                name_localizations: { ru: 'Поцеловать' },
                                value: { ru: 'поцеловал(-а)', en: 'kisses' }
                            },
                            {
                                name: 'Squeak',
                                name_localizations: { ru: 'Запищать' },
                                value: { ru: 'запищал(-а) на', en: 'squeaks at' }
                            },
                            {
                                name: 'Jump',
                                name_localizations: { ru: 'Прыгнуть' },
                                value: { ru: 'прыгнул(-а) на', en: 'jumps' }
                            },
                            {
                                name: 'Snort',
                                name_localizations: { ru: 'Фыркнуть' },
                                value: { ru: 'фыркнул(-а) на', en: 'snortes at' }
                            },
                            {
                                name: 'Stroke',
                                name_localizations: { ru: 'Погладить' },
                                value: { ru: 'погладил(-а)', en: 'strokes' }
                            },
                            {
                                name: 'Tickle',
                                name_localizations: { ru: 'Защикотать' },
                                value: { ru: 'защикотал(-а)', en: 'tickles' }
                            },
                            {
                                name: 'Touch',
                                name_localizations: { ru: 'Потрогать' },
                                value: { ru: 'потрогал(-а)', en: 'touches' }
                            },
                            {
                                name: 'Approach',
                                name_localizations: { ru: 'Подойти' },
                                value: { ru: 'подошел(-ла) к', en: 'approaches' }
                            },
                            {
                                name: 'Purrrs',
                                name_localizations: { ru: 'Помурчать' },
                                value: { ru: 'помурчал(-а)', en: 'purrrs' }
                            },
                            {
                                name: 'Release',
                                name_localizations: { ru: 'Отпустить' },
                                value: { ru: 'отпустил(-а)', en: 'releases' }
                            },
                            {
                                name: 'Move away',
                                name_localizations: { ru: 'Отойти' },
                                value: { ru: 'отошел(-ла) от', en: 'moves away from' }
                            },
                            {
                                name: 'Climb on',
                                name_localizations: { ru: 'Залезть' },
                                value: { ru: 'залез(-ла) на', en: 'climbs' }
                            },
                            {
                                name: 'Scratch',
                                name_localizations: { ru: 'Почесать' },
                                value: { ru: 'почесал(-а)', en: 'scratches' }
                            },
                            {
                                name: 'Push',
                                name_localizations: { ru: 'Толкнуть' },
                                value: { ru: 'толкнул(-а)', en: 'pushes' }
                            },
                            {
                                name: 'Slap',
                                name_localizations: { ru: 'Шлепнуть' },
                                value: { ru: 'шлепнул(-а)', en: 'slappes' }
                            },
                            {
                                name: 'Grab',
                                name_localizations: { ru: 'Схватить' },
                                value: { ru: 'схватил(-а)', en: 'grabs' }
                            },
                            {
                                name: 'Get off',
                                name_localizations: { ru: 'Слезть' },
                                value: { ru: 'слез(-ла) с', en: 'gets off' }
                            },
                            {
                                name: 'Bite',
                                name_localizations: { ru: 'Укусить' },
                                value: { ru: 'укусил(-а)', en: 'bites' }
                            },
                            {
                                name: 'Boop',
                                name_localizations: { ru: 'Бупнуть' },
                                value: { ru: 'бупнул(-а)', en: 'boops' }
                            },
                            {
                                name: 'Lick',
                                name_localizations: { ru: 'Лизнуть' },
                                value: { ru: 'лизнул(-а)', en: 'licks' }
                            },
                            {
                                name: 'Hug',
                                name_localizations: { ru: 'Обнять' },
                                value: { ru: 'обнял(-а)', en: 'hugs' }
                            },
                            {
                                name: 'Fuck',
                                name_localizations: { ru: 'Выебать' },
                                value: { ru: 'выебал(-а)', en: 'fucks' }
                            },
                            {
                                name: 'Squeeze',
                                name_localizations: { ru: 'Тискает' },
                                value: { ru: 'тискает', en: 'squeezes' }
                            },
                            {
                                name: 'Kill',
                                name_localizations: { ru: 'Убить' },
                                value: { ru: 'убил(-а)', en: 'killed' }
                            },
                        ];
                        const area_top = [
                            {
                                name: 'Tongue',
                                name_localizations: { ru: 'Язык' },
                                value: { ru: 'язык', en: 'tongue' }
                            },
                            {
                                name: 'Cheeks',
                                name_localizations: { ru: 'Щеки' },
                                value: { ru: 'щеки', en: 'cheeks' }
                            },
                            {
                                name: 'Forehead',
                                name_localizations: { ru: 'Лоб' },
                                value: { ru: 'лоб', en: 'forehead' }
                            },
                            {
                                name: 'Neck',
                                name_localizations: { ru: 'Шея' },
                                value: { ru: 'шею', en: 'neck' }
                            },
                            {
                                name: 'Nose',
                                name_localizations: { ru: 'Нос' },
                                value: { ru: 'нос', en: 'nose' }
                            },
                            {
                                name: 'Mouth',
                                name_localizations: { ru: 'Рот' },
                                value: { ru: 'рот', en: 'mouth' }
                            },
                            {
                                name: 'Head',
                                name_localizations: { ru: 'Голову' },
                                value: { ru: 'голову', en: 'head' }
                            },
                            {
                                name: 'Horn',
                                name_localizations: { ru: 'Рог' },
                                value: { ru: 'рог', en: 'horn' }
                            },
                            {
                                name: 'Eyes',
                                name_localizations: { ru: 'Глаза' },
                                value: { ru: 'глаза', en: 'eyes' }
                            },
                            {
                                name: 'Ears',
                                name_localizations: { ru: 'Уши' },
                                value: { ru: 'уши', en: 'ears' }
                            },
                            {
                                name: 'Left ear',
                                name_localizations: { ru: 'Левое ухо' },
                                value: { ru: 'левое ухо', en: 'left ear' }
                            },
                            {
                                name: 'Right ear',
                                name_localizations: { ru: 'Правое ухо' },
                                value: { ru: 'правое ухо', en: 'right ear' }
                            },
                            {
                                name: 'Mane',
                                name_localizations: { ru: 'Грива' },
                                value: { ru: 'гриву', en: 'mane' }
                            },
                            {
                                name: 'Right cheek',
                                name_localizations: { ru: 'Правая щека' },
                                value: { ru: 'правую щеку', en: 'right cheek' }
                            },
                            {
                                name: 'Left cheek',
                                name_localizations: { ru: 'Левая щека' },
                                value: { ru: 'левую щеку', en: 'left cheek' }
                            },
                        ];
                        const area_bottom = [
                            {
                                name: 'Wing',
                                name_localizations: { ru: 'Крыло' },
                                value: { ru: 'крыло', en: 'wing' }
                            },
                            {
                                name: 'Left wing',
                                name_localizations: { ru: 'Левое крыло' },
                                value: { ru: 'левое крыло', en: 'left wing' }
                            },
                            {
                                name: 'Right wing',
                                name_localizations: { ru: 'Правое крыло' },
                                value: { ru: 'правое крыло', en: 'right wing' }
                            },
                            {
                                name: 'Tail',
                                name_localizations: { ru: 'Хвост' },
                                value: { ru: 'хвост', en: 'tail' }
                            },
                            {
                                name: 'Waistline',
                                name_localizations: { ru: 'Талия' },
                                value: { ru: 'талию', en: 'waist' }
                            },
                            {
                                name: 'Ass',
                                name_localizations: { ru: 'Жепа' },
                                value: { ru: 'жепу', en: 'ass' }
                            },
                            {
                                name: 'Chest',
                                name_localizations: { ru: 'Грудь' },
                                value: { ru: 'грудь', en: 'chest' }
                            },
                            {
                                name: 'Belly',
                                name_localizations: { ru: 'Живот' },
                                value: { ru: 'живот', en: 'belly' }
                            },
                            {
                                name: 'Back',
                                name_localizations: { ru: 'Спина' },
                                value: { ru: 'спину', en: 'back' }
                            },
                            {
                                name: 'Lower back',
                                name_localizations: { ru: 'Низ спины' },
                                value: { ru: 'низ спины', en: 'lower back' }
                            },
                            {
                                name: 'Upper back',
                                name_localizations: { ru: 'Верх спины' },
                                value: { ru: 'верх спины', en: 'upper back' }
                            },
                            {
                                name: 'Middle of the back',
                                name_localizations: { ru: 'Середина спины' },
                                value: { ru: 'середину спины', en: 'middle of the back' }
                            },
                            {
                                name: 'Cutie Mark',
                                name_localizations: { ru: 'Кьютимарка' },
                                value: { ru: 'кьютимарку', en: 'cutie mark' }
                            },
                            {
                                name: 'Front hoof',
                                name_localizations: { ru: 'Переднее копыто' },
                                value: { ru: 'переднее копыто', en: 'front hoof' }
                            },
                            {
                                name: 'Front right hoof',
                                name_localizations: { ru: 'Переднее правое копыто' },
                                value: { ru: 'переднее правое копыто', en: 'front right hoof' }
                            },
                            {
                                name: 'Front left hoof',
                                name_localizations: { ru: 'Переднее левое копыто' },
                                value: { ru: 'переднее левое копыто', en: 'front left hoof' }
                            },
                            {
                                name: 'Rear hoof',
                                name_localizations: { ru: 'Заднее копыто' },
                                value: { ru: 'заднее копыто', en: 'rear hoof' }
                            },
                            {
                                name: 'Rear right hoof',
                                name_localizations: { ru: 'Заднее правое копыто' },
                                value: { ru: 'заднее правое копыто', en: 'rear right hoof' }
                            },
                            {
                                name: 'Rear left hoof',
                                name_localizations: { ru: 'Заднее левое копыто' },
                                value: { ru: 'заднее левое копыто', en: 'rear left hoof' }
                            },
                        ];
                        const slashCommand = new SlashCommandBuilder()
                            .setName('rp').setNameLocalizations({ ru: 'рп' })
                            .setDescription('Make rp action').setDescriptionLocalizations({ ru: 'Сделать рп действие' })

                            .addStringOption(option => option.setName('act').setRequired(true)
                                .setNameLocalizations({ ru: 'действие' })
                                .setDescription('Select an action')
                                .setDescriptionLocalizations({ ru: 'Выберите действие' })
                                .addChoices(...arrayLoader(actList, 0))
                            )
                            .addUserOption(option => option.setName('user_1').setRequired(true)
                                .setNameLocalizations({ ru: 'пользователь_1' })
                                .setDescription('Who do we interact with?')
                                .setDescriptionLocalizations({ ru: 'С кем взаимодействуем?' })
                            )
                            .addStringOption(option => option.setName('language').setRequired(true)
                                .setNameLocalizations({ ru: 'язык' })
                                .setDescription('In which language to answer')
                                .setDescriptionLocalizations({ ru: 'На каком языке ответить' })
                                .addChoices(
                                    { name: 'ru', value: 'ru' },
                                    { name: 'en', value: 'en' },
                                )
                            )
                            .addStringOption(option => option.setName('area_top')
                                .setNameLocalizations({ ru: 'область_верх' })
                                .setDescription('Select the interaction area')
                                .setDescriptionLocalizations({ ru: 'Выберите область взаимодействия' })
                                .addChoices(...arrayLoader(area_top, 0))
                            )
                            .addStringOption(option => option.setName('area_bottom')
                                .setNameLocalizations({ ru: 'область_низ' })
                                .setDescription('Select the interaction area')
                                .setDescriptionLocalizations({ ru: 'Выберите область взаимодействия' })
                                .addChoices(...arrayLoader(area_bottom, 0))
                            )
                            .addStringOption(option => option.setName('message')
                                .setNameLocalizations({ ru: 'сообщение' })
                                .setDescription('Something to add')
                                .setDescriptionLocalizations({ ru: 'Что-то дописать' })
                                .setMaxLength(1024)
                            )
                            .addStringOption(option => option.setName('image_url')
                                .setNameLocalizations({ ru: 'url_изображения' })
                                .setDescription('Allows you to attach an image or gif')
                                .setDescriptionLocalizations({ ru: 'Позволяет прикрепить изображение или gif' })
                                .setMaxLength(512)
                            );
                        for (let i = 2; i < 11; i++) {
                            slashCommand.addUserOption(option => option.setName(`user_${i}`)
                                .setNameLocalizations({ ru: `пользователь_${i}` })
                                .setDescription('Who do we interact with?')
                                .setDescriptionLocalizations({ ru: 'С кем взаимодействуем?' })
                            );
                        };
                        return slashCommand;
                    })(),
                    async autocomplete(interaction) {
                        const focusedOption = interaction.options.getFocused(true);
                        let choices = [];

                        if (focusedOption.name === 'query') {
                            choices.concat();
                        }

                        if (focusedOption.name === 'act') {
                            choices = [focusedOption.value + 'v9'];
                        }

                        const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
                        await interaction.respond(
                            choices.map(choice => ({ name: choice, value: choice })),
                        );
                    },
                    async execute(interaction) {
                        const l = interaction.locale;
                        const result = [];
                        const act = [];
                        const area = [];
                        const users = [];
                        const replyLang = interaction.options.getString('language');
                        const message = interaction.options.getString('message');
                        const image = interaction.options.getString('image_url');

                        function addAct(lang) {
                            for (let i = 0; i < act.length; i++) {
                                result.push(
                                    act[i] + (i == act.length - 1 ? '' : (i == act.length - 2 ? (lang == 'ru' ? ' и' : ' and') : ','))
                                );
                            };
                        };
                        function addUsers(lang) {
                            for (let i = 0; i < users.length; i++) {
                                result.push(
                                    `<@${users[i].id}>${lang != 'ru' && area.length > 0 ? "'s" : ''}` +
                                    (i == users.length - 1 ? '' : (i == users.length - 2 ? (lang == 'ru' ? ' и' : ' and') : ','))
                                );
                            };
                        };
                        function addArea(lang) {
                            for (let i = 0; i < area.length; i++) {
                                result.push(
                                    area[i] + (i == area.length - 1 ? '' : (i == area.length - 2 ? (lang == 'ru' ? ' и' : ' and') : ','))
                                );
                            };
                        };

                        for (let i = 0; i < interaction.options.data.length; i++) {
                            const value = interaction.options.data[i].name;
                            if (value.startsWith('act')) { act.push(JSON.parse(interaction.options.getString(value))[replyLang]); };
                            if (value.startsWith('user')) { users.push(interaction.options.getUser(value)); };
                            if (value.startsWith('area')) { area.push(JSON.parse(interaction.options.getString(value))[replyLang]); };
                        };

                        result.push(`<@${interaction.user.id}>`);
                        addAct(replyLang);

                        switch (replyLang) {
                            case 'en': addUsers('en'); addArea('en'); break;
                            case 'ru': addArea('ru'); addUsers('ru'); break;
                        };

                        result.push(message ? `${replyLang == 'ru' ? 'сказав' : 'having said'}: ${message.replace(/@\w+/g, '')}` : '');

                        const content = result.reduce((sum, item) => sum + (typeof item == 'string' ? ' ' + item : '')).trim();
                        const embed = new EmbedBuilder()
                            .setDescription(content)
                            .setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`)
                        if (image != null) {
                            if (image.match(urlRegex).length > 0) {
                                embed
                                    .setFooter({ text: interaction.member.displayName, iconURL: interaction.user.avatarURL({ size: 1024 }) })
                                    .setTimestamp(Date.now())
                                    .setImage(image)
                            };
                        };

                        await interaction.reply({
                            content: (() => {
                                let str = `<@${interaction.user.id}>`;
                                users.forEach(user => { str += (str.match(new RegExp(`<@${user.id}>`, 'g')) != null ? '' : `<@${user.id}>`) });
                                return str;
                            })(),
                            embeds: [embed]
                        });
                        return content;
                    },
                },
                say: {
                    data: new SlashCommandBuilder()
                        .setName('say').setNameLocalizations({ ru: 'сказать' })
                        .setDescription('I\'ll say whatever you want').setDescriptionLocalizations({ ru: 'Скажу всё, что вам хочется' })

                        .addStringOption(option => option.setName('message').setRequired(true)
                            .setNameLocalizations({ ru: 'сообщение' })
                            .setDescription('Message')
                            .setDescriptionLocalizations({ ru: 'Сообщение' })
                        )
                        .addBooleanOption(option => option.setName('incognito')
                            .setNameLocalizations({ ru: 'анонимно' })
                            .setDescription('Incognito')
                            .setDescriptionLocalizations({ ru: 'Анонимно' })
                        )
                        .addBooleanOption(option => option.setName('embed')
                            .setNameLocalizations({ ru: 'эмбед' })
                            .setDescription('Added embed?')
                            .setDescriptionLocalizations({ ru: 'Добавить эмбед' })
                        ),
                    async execute(interaction) {
                        const l = interaction.locale;
                        const message = interaction.options.getString('message').replace(/@\w+/g, '').slice(0, 2000);
                        const addEmbed = interaction.options.getBoolean('embed');

                        if (message == '') { return interaction.reply({ content: `<@${interaction.user.id}>`, ephemeral: true }); };
                        if (interaction.options.getBoolean('incognito')) {
                            if (interaction.appPermissions.has(PermissionFlagsBits.SendMessages)) {
                                interaction.channel.send(addEmbed ? { embeds: [new EmbedBuilder().setTitle(message).setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`)] } : message);
                                interaction.reply({ content: '✅', ephemeral: true });
                            } else {
                                interaction.reply({ content: (l == 'ru' ? 'Нет прав на отправку сообщений' : 'No rights to send messages'), ephemeral: true });
                            };
                        } else {
                            interaction.reply(addEmbed ? { embeds: [new EmbedBuilder().setTitle(message)] } : message);
                        };

                        return message;
                    },
                },
                info: {
                    data: new SlashCommandBuilder()
                        .setName('info').setNameLocalizations({ ru: 'инфо' })
                        .setDescription('Some information').setDescriptionLocalizations({ ru: 'Различная информация' })
                        .addNumberOption(option => option.setName('category').setRequired(true)
                            .setNameLocalizations({ ru: 'категория' })
                            .setDescription('Select category').setDescriptionLocalizations({ ru: 'Выберите категорию' })
                            .addChoices(
                                {
                                    name: 'bot',
                                    name_localizations: { ru: 'бот' },
                                    value: 0
                                },
                                {
                                    name: 'guild',
                                    name_localizations: { ru: 'сервер' },
                                    value: 1
                                }
                            )
                        ),
                    async execute(interaction) {
                        const l = interaction.locale;
                        const embed = new EmbedBuilder().setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`);
                        switch (interaction.options.getNumber('category')) {
                            case 0:
                                embed
                                    .setTitle(`${client.user.username} ${l == 'ru' ? 'инфо' : 'info'}`)
                                    .setDescription(`
                                        \`${Object.keys(scripts.events.interactionCreate).length
                                        }\` ${l == 'ru' ? 'слэш команд, использованных' : 'slash commands'} \`${db.logs.length
                                        }\` ${l == 'ru' ? 'раз' : 'times used'}
                                        \`${(workTime() / 60000).toFixed()}\` ${l == 'ru' ? 'мин время работы' : 'min work time'}
                                        \`${db.startTime}\` ${l == 'ru' ? 'мс последний запуск' : 'ms last start'}
                                        \`${db.starts}\` ${l == 'ru' ? 'запусков' : 'starts'}
                                        \`${totalMemberCount()}\` ${l == 'ru' ? 'пользователей' : 'members'}
                                        \`${totalUserCount()}\` ${l == 'ru' ? 'юзеров' : 'users'}
                                        \`${totalBotCount()}\` ${l == 'ru' ? 'ботов' : 'bots'}
                                    `)
                                    .setThumbnail(client.user.avatarURL({ size: 4096 }));
                                break;
                            case 1:
                                embed
                                    .setTitle(`${interaction.guild.name} ${l == 'ru' ? 'инфо' : 'info'}`)
                                    .setDescription((() => {
                                        const g = interaction.guild;
                                        return `
                                            \`${g.description}\` ${l == 'ru' ? 'описание' : 'description'}
                                            \`${g.memberCount}/${g.maximumMembers}\` ${l == 'ru' ? 'пользователей' : 'members'}
                                            \`${g.channels.cache.size}\` ${l == 'ru' ? 'каналов' : 'channels'}
                                            \`${g.emojis.cache.size}\` ${l == 'ru' ? 'эмодзи' : 'emojies'}
                                            \`${g.stickers.cache.size}\` ${l == 'ru' ? 'стикеров' : 'stickers'}
                                            \`${g.roles.cache.size}\` ${l == 'ru' ? 'ролей' : 'roles'}
                                            \`${g.premiumSubscriptionCount}\` ${l == 'ru' ? 'бустов' : 'nitros'}
                                            \`${g.maximumBitrate}\` ${l == 'ru' ? 'макс битрейт' : 'max bitrate'}
                                            \`${g.nsfwLevel}\` nsfw ${l == 'ru' ? 'уровень' : 'level'}
                                            \`${g.verificationLevel}\` ${l == 'ru' ? 'уровень верификации' : 'verification level'}
                                            \`${g.ownerId}\` ${l == 'ru' ? 'id владельца' : 'owner id'}
                                            \`${g.id}\` ${l == 'ru' ? 'id сервера' : 'guild id'}
                                            \`${g.createdAt.getDay()
                                            }/${g.createdAt.getMonth()
                                            }/${g.createdAt.getFullYear()
                                            } ${g.createdAt.getHours()
                                            }:${g.createdAt.getMinutes()
                                            }:${g.createdAt.getSeconds()
                                            }\` ${l == 'ru' ? 'дата создания' : 'created date'}
                                        `
                                    })())
                                    .setThumbnail(interaction.guild.iconURL({ size: 4096 }))
                                    .setImage(interaction.guild.bannerURL({ size: 4096 }));
                                break;
                            default:
                                embed.setTitle('Error');
                                errLog('error');
                                break;
                        }
                        interaction.reply({ embeds: [embed] });
                    }
                },
                embed: {
                    data: new SlashCommandBuilder()
                        .setName('embed').setNameLocalizations({ ru: 'эмбед' })
                        .setDescription('Allows you to create embeds')
                        .setDescriptionLocalizations({ ru: 'Позволяет создавать эмбеды' })

                        .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('create')
                            .setNameLocalizations({ ru: 'создать' })
                            .setDescription('Creates an embed').setDescriptionLocalizations({ ru: 'Создаёт эмбед' })

                            .addSubcommand(subcommand => subcommand.setName('empty')
                                .setNameLocalizations({ ru: 'пустой' })
                                .setDescription('Creates an empty embed').setDescriptionLocalizations({ ru: 'Создаёт пустой эмбед' })
                            )
                            .addSubcommand(subcommand => subcommand.setName('pattern')
                                .setNameLocalizations({ ru: 'шаблон' })
                                .setDescription('Creates an pattern embed').setDescriptionLocalizations({ ru: 'Создаёт шаблонный эмбед' })
                            )
                        )
                        .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('value')
                            .setNameLocalizations({ ru: 'значение' })
                            .setDescription('Value').setDescriptionLocalizations({ ru: 'Значение' })

                            .addSubcommand(subcommand => {
                                subcommand
                                    .setName('edit')
                                    .setNameLocalizations({ ru: 'редактировать' })
                                    .setDescription('Edited by embed').setDescriptionLocalizations({ ru: 'Редактирует эмбед' })

                                    .addStringOption(option => option.setName('id').setRequired(true)
                                        .setDescription('Id of the message being edited').setDescriptionLocalizations({ ru: 'Id редактируемого сообщения' })
                                        .setMaxLength(128)
                                    )
                                    .addStringOption(option => option.setName('description')
                                        .setNameLocalizations({ ru: 'описание' })
                                        .setDescription('Description').setDescriptionLocalizations({ ru: 'Описание' })
                                        .setMaxLength(4096)
                                    )
                                    .addStringOption(option => option.setName('title')
                                        .setNameLocalizations({ ru: 'заголовок' })
                                        .setDescription('Title').setDescriptionLocalizations({ ru: 'Заголовок' })
                                        .setMaxLength(256)
                                    )
                                    .addStringOption(option => option.setName('color')
                                        .setNameLocalizations({ ru: 'цвет' })
                                        .setDescription('Color (#ffffff)').setDescriptionLocalizations({ ru: 'Цвет (#ffffff)' })
                                        .setMinLength(6).setMaxLength(6)
                                    )
                                    .addStringOption(option => option.setName('url')
                                        .setNameLocalizations({ ru: 'ссылка' })
                                        .setDescription('Url').setDescriptionLocalizations({ ru: 'Ссылка' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('image')
                                        .setNameLocalizations({ ru: 'изображение' })
                                        .setDescription('Image').setDescriptionLocalizations({ ru: 'Изображение' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('thumbnail')
                                        .setNameLocalizations({ ru: 'миниатюра' })
                                        .setDescription('Thumbnail').setDescriptionLocalizations({ ru: 'Миниатюра' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('footer_text')
                                        .setNameLocalizations({ ru: 'подвал_текст' })
                                        .setDescription('Footer text').setDescriptionLocalizations({ ru: 'Подвал текст' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('footer_icon')
                                        .setNameLocalizations({ ru: 'подвал_иконка' })
                                        .setDescription('Footer icon url').setDescriptionLocalizations({ ru: 'Url иконки подвала' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('author_name')
                                        .setNameLocalizations({ ru: 'автор_имя' })
                                        .setDescription('Author name').setDescriptionLocalizations({ ru: 'Имя автора' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('author_url')
                                        .setNameLocalizations({ ru: 'автор_url' })
                                        .setDescription('Author url').setDescriptionLocalizations({ ru: 'Url автора' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('author_icon')
                                        .setNameLocalizations({ ru: 'автор_иконка' })
                                        .setDescription('Author icon url').setDescriptionLocalizations({ ru: 'Url иконки автора' })
                                        .setMaxLength(1024)
                                    )
                                    .addStringOption(option => option.setName('timestamp')
                                        .setNameLocalizations({ ru: 'таймстамп' })
                                        .setDescription('Timestamp').setDescriptionLocalizations({ ru: 'Таймстамп' })
                                        .setMinLength(1).setMaxLength(15)
                                    );
                                //for (let i = 0; i < 2; i++) {
                                //    ['name', 'value', 'inline'].forEach(element => {
                                //        subcommand.addStringOption(option => option.setName('field_' + (i + 1) + '_' + element)
                                //            .setNameLocalizations({ ru: 'поле_' + (i + 1) + '_' + element })
                                //            .setDescription('ggg').setDescriptionLocalizations({ ru: 'ggg' })
                                //        );
                                //    });
                                //};
                                return subcommand;
                            })
                            .addSubcommand(subcommand => subcommand.setName('remove')
                                .setNameLocalizations({ ru: 'убрать' })
                                .setDescription('Removed embed value').setDescriptionLocalizations({ ru: 'Убирает значение эмбеда' })

                                .addStringOption(option => option.setName('id').setRequired(true)
                                    .setDescription('Message id').setDescriptionLocalizations({ ru: 'Id сообщения' })
                                )
                                .addStringOption(option => option.setName('value_page_1')
                                    .setNameLocalizations({ ru: 'значение_страница_1' })
                                    .setDescription('Value').setDescriptionLocalizations({ ru: 'Значение' })
                                    .addChoices({
                                        name: 'title',
                                        name_localizations: { ru: 'заголовок' },
                                        value: 'title'
                                    }, {
                                        name: 'description',
                                        name_localizations: { ru: 'описание' },
                                        value: 'description'
                                    }, {
                                        name: 'color',
                                        name_localizations: { ru: 'цвет' },
                                        value: 'color'
                                    }, {
                                        name: 'url',
                                        name_localizations: { ru: 'ссылка' },
                                        value: 'url'
                                    }, {
                                        name: 'image',
                                        name_localizations: { ru: 'изображение' },
                                        value: 'image'
                                    }, {
                                        name: 'thumbnail',
                                        name_localizations: { ru: 'миниатюра' },
                                        value: 'thumbnail'
                                    }, {
                                        name: 'footer',
                                        name_localizations: { ru: 'подвал' },
                                        value: 'footer'
                                    }, {
                                        name: 'footer text',
                                        name_localizations: { ru: 'подвал текст' },
                                        value: 'footer text'
                                    }, {
                                        name: 'author',
                                        name_localizations: { ru: 'автор' },
                                        value: 'author'
                                    }, {
                                        name: 'author name',
                                        name_localizations: { ru: 'автор имя' },
                                        value: 'author name'
                                    }, {
                                        name: 'author url',
                                        name_localizations: { ru: 'автор ссылка' },
                                        value: 'author url'
                                    }, {
                                        name: 'author icon',
                                        name_localizations: { ru: 'автор иконка' },
                                        value: 'author icon'
                                    }, {
                                        name: 'timestamp',
                                        name_localizations: { ru: 'таймстамп' },
                                        value: 'timestamp'
                                    }, {
                                        name: 'timestamp',
                                        name_localizations: { ru: 'таймстамп' },
                                        value: 'timestamp'
                                    })
                                )
                                //.addStringOption(option => option.setName('value_page_2')
                                //    .setNameLocalizations({ ru: 'значение_страница_2' })
                                //    .setDescription('Fields').setDescriptionLocalizations({ ru: 'Поля' })
                                //    .addChoices(...(() => {
                                //        let result = [];
                                //        for (let i = 0; i < 6; i++) {
                                //            result.push({
                                //                name: 'field ' + (i + 1),
                                //                name_localizations: { ru: 'поле ' + (i + 1) },
                                //                value: 'field ' + i,
                                //            });
                                //            result.push({
                                //                name: 'field ' + (i + 1) + ' name',
                                //                name_localizations: { ru: 'поле ' + (i + 1) + ' имя' },
                                //                value: 'field ' + i + ' name',
                                //            });
                                //            result.push({
                                //                name: 'field ' + (i + 1) + ' value',
                                //                name_localizations: { ru: 'поле ' + (i + 1) + ' значение' },
                                //                value: 'field ' + i + ' value',
                                //            });
                                //            result.push({
                                //                name: 'field ' + (i + 1) + ' inline',
                                //                name_localizations: { ru: 'поле ' + (i + 1) + ' в строку' },
                                //                value: 'field ' + i + ' inline',
                                //            });
                                //        };
                                //        return result;
                                //    })())
                                //)
                            )
                        ),
                    async execute(interaction) {
                        const subcommandGroup = interaction.options.getSubcommandGroup();
                        const subcommand = interaction.options.getSubcommand();
                        const value1 = (interaction.options.getString('value_page_1') != null ? interaction.options.getString('value_page_1') : '').split(' ');
                        const value2 = (interaction.options.getString('value_page_2') != null ? interaction.options.getString('value_page_2') : '').split(' ');
                        const id = interaction.options.getString('id');
                        const l = interaction.locale;

                        const description = interaction.options.getString('description');
                        const thumbnail = { url: getUrl(interaction.options.getString('thumbnail')), };
                        const timestamp = parseInt(interaction.options.getString('timestamp'));
                        const image = { url: getUrl(interaction.options.getString('image')), };
                        const title = interaction.options.getString('title');
                        const url = getUrl(interaction.options.getString('url'));
                        const author = {
                            name: interaction.options.getString('author_name'),
                            url: getUrl(interaction.options.getString('author_url')),
                            icon_url: getUrl(interaction.options.getString('author_icon'))
                        };
                        const footer = {
                            text: interaction.options.getString('footer_text'),
                            icon_url: getUrl(interaction.options.getString('footer_icon'))
                        };
                        const color = (() => {
                            let val = interaction.options.getString('color');
                            val = (val == null ? '' : val).match(hexRegex);
                            return parseInt((val != null ? (val[0].length == 7 ? val[0].substring(1) : val[0]) : null), 16);
                        })();
                        const fields = (() => {
                            const result = [];
                            for (let i = 0; i < 24; i++) {
                                result.push({
                                    name: interaction.options.getString('field ' + i + 'name'),
                                    value: interaction.options.getString('field ' + i + 'value'),
                                    inline: interaction.options.getString('field ' + i + 'inline')
                                });
                            };
                            return result;
                        })();

                        function getUrl(val) {
                            val = (val == null ? '' : val).match(urlRegex);
                            return (val != null ? val[0] : null);
                        };

                        let embed = new EmbedBuilder(); // для синтаксиса

                        switch (subcommandGroup) {
                            case 'create':
                                switch (subcommand) {
                                    case 'empty': interaction.reply({ embeds: [new EmbedBuilder().setDescription('...')] }); break;
                                    case 'pattern':
                                        interaction.reply({
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setTitle(l == 'ru' ? 'Заголовок и ссылка' : 'Title and url')
                                                    .setDescription(l == 'ru' ? 'Описание' : 'Description')
                                                    .setAuthor({
                                                        name: (l == 'ru' ? 'Автор' : 'Author'),
                                                        iconURL: interaction.user.avatarURL({ size: 512 }),
                                                        url: interaction.user.avatarURL({ size: 512 })
                                                    })
                                                    .setColor('#ffffff')
                                                    .setFooter({
                                                        text: (l == 'ru' ? 'Подвал' : 'Footer'),
                                                        iconURL: interaction.user.avatarURL({ size: 512 })
                                                    })
                                                    .setImage(interaction.user.avatarURL({ size: 4096 }))
                                                    .setThumbnail(interaction.user.avatarURL({ size: 1024 }))
                                                    .setTimestamp(Date.now())
                                                    .setURL(interaction.user.avatarURL({ size: 512 }))
                                            ]
                                        });
                                        break;
                                };
                                break;
                            case 'value':
                                await interaction.deferReply();
                                const message = await interaction.channel.messages.fetch(id).catch(() => { });
                                if (!message) {
                                    interaction.editReply(l == 'ru' ? 'Сообщение не найдено' : 'Message not found').catch(() => { });
                                } else {
                                    if (message.author.id == client.user.id &&
                                        message.embeds.length > 0 &&
                                        message.interaction.user.id == interaction.user.id &&
                                        message.author.id == interaction.applicationId) {
                                        embed = message.embeds[0];
                                        switch (subcommand) {
                                            case 'edit':
                                                embed.data.description = (description == null ? embed.data.description : description);
                                                embed.data.color = (isNaN(color) ? embed.data.color : color);
                                                embed.data.title = (title == null ? embed.data.title : title);
                                                embed.data.url = (url == null ? embed.data.url : url);
                                                embed.data.image = (image == null ? embed.data.image : image);
                                                embed.data.thumbnail = (thumbnail == null ? embed.data.thumbnail : thumbnail);
                                                embed.data.footer = (footer == null ? embed.data.footer : footer);
                                                embed.data.author = (author == null ? embed.data.author : author);
                                                embed.data.timestamp = (isNaN(timestamp) ? embed.data.timestamp : timestamp);
                                                //embed.data.fields = (() => {
                                                //    const result = [];
                                                //    for (let i = 0; i < fields.length; i++) {
                                                //        const element = fields[i];
                                                //        result.push({
                                                //            name: 'j', //(element.name != null ? element.name : embed.data.fields[i].name),
                                                //            value:  22,   //(element.value != null ? element.value : embed.data.fields[i].value),
                                                //            inline: 1   //(element.inline != null ? element.inline : embed.data.fields[i].inline),
                                                //        });
                                                //    };
                                                //    return result;
                                                //})();
                                                //embed.data.fields.pop()
                                                break;
                                            case 'remove':
                                                if (value1.length > 0) {
                                                    if (isUndefined(value1[1])) {
                                                        embed.data[value1[0]] = null;
                                                    } else {
                                                        embed.data[value1[0]][value1[1]] = null;
                                                    };
                                                };
                                                if (value2.length > 0) {
                                                    if (isUndefined(value2[2])) {
                                                        embed.data[value2[0]][value2[1]][value2[2]] = null;
                                                    } else {
                                                        embed.data[value2[0]][value2[1]] = null;
                                                    };
                                                };
                                                break;
                                        };
                                        if (typeof embed.data.description != 'string' &&
                                            typeof embed.data.title != 'string') {
                                            embed.data.description = `\`\`\`${l == 'ru' ?
                                                'Обязательно наличие описания или заголовка' :
                                                'A description or title is required'}\`\`\``;
                                        };
                                        message.edit({ embeds: [embed] }).catch(() => { });
                                        interaction.editReply(l == 'ru' ? 'Готово!' : 'Finnaly!').catch(() => { });
                                    } else {
                                        interaction.editReply(l == 'ru' ? 'Недостаточно прав' : 'Not enough rights').catch(() => { });
                                    };
                                };
                                setTimeout(() => {
                                    interaction.deleteReply().catch(() => { });
                                }, 10000);
                                break;
                        };
                        return 'l';
                    }
                }
            },
            messageCreate: {
                bot_learn: {
                    async execute(message) {
                        function getValue(obj, key, defaultValue = {}) {
                            if (obj[key] == undefined) { obj[key] = defaultValue; };
                            return obj[key];
                        };

                        getValue(db, 'guilds');
                        getValue(db.guilds, message.guild.id);
                        getValue(db.guilds[message.guild.id], 'channels');
                        getValue(db.guilds[message.guild.id].channels, message.channel.id);
                        getValue(db.guilds[message.guild.id].channels[message.channel.id], 'bot_learn');
                        const channelData = db.guilds[message.guild.id].channels[message.channel.id].bot_learn;
                        getValue(channelData, 'toggle', false);
                        getValue(channelData, 'replyChance', 1);
                        getValue(channelData, 'searchEngine', 'simple');
                        const database = channelData.database;

                        saveJSON(path.join(__dirname, 'database.json'), db);

                        message.content = message.content.slice(0, 2000);

                        function checkIntegrity(keysArray = [], checkedObject, setsType = {}) {
                            for (const key of keysArray) {
                                if (isUndefined(checkedObject[key])) { checkedObject[key] = setsType; };
                            };
                        };
                        function compareWord(originalWord, checkedWord) {
                            let count = 0;
                            for (let i = 0; i < originalWord.length; i++) {
                                if (originalWord[i] == checkedWord[i]) { count++; };
                            };
                            return count / originalWord.length;
                        };
                        function searchSimilarText(database = { 'a': ['b', 'c'] }, text) {
                            let result = [];
                            const regexp = /[^ |\n]+/g;
                            const wordsArray = text.match(regexp);
                            Object.entries(database).forEach(line => {
                                const finnaly = {
                                    line: { key: line[0], value: line[1] },
                                    words: {},
                                    totalWords: 0
                                };
                                const transformedLine = `${line[0]} ${line[1].reduce((sum, item) => sum + ' ' + item)}`;
                                wordsArray.forEach(word => {
                                    if (word.length > 2) {
                                        let wordCount = 0;
                                        let lastIndexPos = 0;
                                        while (true) {
                                            let searchedWordIndex = transformedLine.indexOf(word, lastIndexPos);
                                            if (searchedWordIndex == -1) { break; };
                                            lastIndexPos = searchedWordIndex + word.length;
                                            wordCount++;
                                        };
                                        finnaly.words[word] = wordCount;
                                        finnaly.totalWords += wordCount;
                                    };
                                });
                                if (finnaly.totalWords > 0) {
                                    result.push(finnaly);
                                };
                            });
                            result.sort(function (a, b) {
                                if (a.totalWords > b.totalWords) { return -1; };
                                if (a.totalWords < b.totalWords) { return 1; };
                                return 0;
                            });
                            return result;
                        };

                        if (!message.author.bot && message.content != '' && channelData) {
                            if (channelData.toggle && message.guild.id != '448218734763704352') {
                                if ((Math.random() <= channelData.replyChance || message.content.startsWith(`<@${client.user.id}>`)) && message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
                                    switch (channelData.searchEngine) {
                                        case 'simple':
                                            for (const line of Object.entries(database)) {
                                                const responces = line[1];
                                                if (line[0] == message.content && message.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
                                                    message.reply(responces[Math.floor(Math.random() * responces.length)]).catch();
                                                };
                                            };
                                            break;
                                        case 'hard':
                                            if (message.content.startsWith(`<@${client.user.id}>`)) { message.content = message.content.substring(`<@${client.user.id}>`.length).trim(); };
                                            if (message.content != '') {
                                                const searchResult = searchSimilarText(database, message.content);
                                                if (searchResult.length > 0 && message.member.permissions.has(PermissionsBitField.Flags.SendMessages)) {
                                                    let line = searchResult[0].line;
                                                    message.reply(line.value[Math.floor(Math.random() * line.value.length)]).catch();
                                                };
                                            };
                                    };
                                };
                                if (message.reference) {
                                    let responceMes = message.channel.messages.cache.get(message.reference.messageId);
                                    if (responceMes.content != '') {
                                        responceMes.content = responceMes.content.slice(0, 2000);
                                        if (database[responceMes.content] == undefined) { database[responceMes.content] = []; };

                                        let noHaveDuplicate = true;
                                        for (const word of database[responceMes.content]) {
                                            if (word == responceMes.content) { noHaveDuplicate = false; };
                                        };
                                        if (noHaveDuplicate) {
                                            database[responceMes.content].push(message.content);
                                            saveJSON(path.join(__dirname, 'database.json'), db);
                                            try { message.react('📨'); } catch { };
                                        };
                                    };
                                };
                            };
                        };

                    }
                },/*
                random_events: {
                    activeEvents: new Map(),
                    eventsList: [
                        {
                            name: 'math',
                            startTime: undefined,
                            timeLimitMs: 600000,
                            trueReply: undefined,
                            operators: '/*+-',
                            numbers: '123456789',
                            maxExampleSize: 10,
                            execute(message, isStart = false) {
                                if (isStart) {
                                    const exampleSize = (function genValue(maxExampleSize) {
                                        const val = Math.floor(Math.random() * maxExampleSize);
                                        if (val % 2 == 1 && val > 0) {
                                            return val;
                                        } else {
                                            return genValue(maxExampleSize);
                                        };
                                    })(this.maxExampleSize);
                                    let example = '';
                                    let lastValisNum = false;
                                    for (let i = 0; i < exampleSize; i++) {
                                        if (lastValisNum) {
                                            example += randArrValue(this.operators);
                                            lastValisNum = false;
                                        } else {
                                            example += randArrValue(this.numbers);
                                            lastValisNum = true;
                                        };
                                    };
                                    this.trueReply = (eval(example).toString().indexOf('.') > -1 ? eval(example).toFixed(2) : eval(example).toString());
                                    message.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setTitle(this.name + ' event')
                                                .setDescription(
                                                    'Посчитайте: `' + example + '`\n' +
                                                    'Допустимо не более двух чисел после запятой'
                                                )
                                                .setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`)
                                        ]
                                    });
                                } else if (message.content == this.trueReply) {
                                    message.reply('Правильно');
                                    return true;
                                };
                                return false;
                            }
                        },
                    ],
                    execute(message) {
                        if (!message.author.bot) {
                            if ( Math.random() >= 0.975 && !this.activeEvents.has(message.guildId)) {
                                const event = randArrValue(this.eventsList);
                                this.activeEvents.set(message.guildId, event);
                                event.startTime = new Date();
                                event.execute(message, true);
                            } else {
                                const event = this.activeEvents.get(message.guildId);
                                if (!event) { return; };
                                if ((new Date()).getTime() - event.startTime.getTime() < event.timeLimitMs) {
                                    if (event.execute(message)) {
                                        this.activeEvents.delete(message.guildId);
                                    };
                                } else {
                                    this.activeEvents.delete(message.guildId);
                                    message.channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setTitle(this.name + ' event')
                                                .setDescription(
                                                    'Посчитайте: ' + example + '\n' +
                                                    'Допустимо не более двух чисел после запятой'
                                                )
                                                .setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`)
                                        ]
                                    });
                                };
                            };
                        };
                    },
                },*/
            },
        },
        modules: {
            update_bot_status: {
                async execute() {
                    client.user.setPresence({
                        activities: [{
                            name: [
                                `${db.starts} starts;`,
                                `${db.startTime} ms last start;`,
                                `work ${(workTime() / 60000).toFixed()} min;`,
                                `${client.guilds.cache.size} guilds;`,
                                `${totalMemberCount()} members;`,
                                `${Object.keys(scripts.events.interactionCreate).length} slash commands ${db.logs.length} times used;`,
                            ].reduce((sum, item) => sum + ' ' + item),
                            type: ActivityType.Streaming, url: 'https://www.twitch.tv//'
                        }]
                    });
                    setTimeout(() => { this.execute(); }, 60000);
                },
            },
            group_site_parsing: {
                async execute() {
                    let lastUpdate = '';
                    (async function cycle() {
                        const pares = await fetch('https://omacademy.ru/rasp-new/Website-students/cg36.htm', {
                            method: 'post',
                            'content-type': 'text/html'
                        }).then(r => r.text()).then(v => {
                            const doc = (new jsdom.JSDOM(v)).window.document;
                            const div = doc.getElementsByClassName('lrg2')[0];
                            const table = div.getElementsByTagName('table')[0];
                            const indexForRemove = [];
                            const lines = [];
                            const normalizeData = {
                                lastUpdate: removeBadSym(doc.getElementsByClassName('ref')[0].textContent),
                                days: [],
                            };
                            function removeBadSym(value) {
                                return value.replace(/\n/g, '').trim();
                            };
                            for (const tr of table.getElementsByTagName('tr')) {
                                const line = {
                                    date: undefined,
                                    time: undefined,
                                    item: undefined,
                                    classroom: undefined,
                                    teacher: undefined,
                                };
                                let haveDate = false;
                                for (let i = 0; i < tr.childNodes.length; i++) {
                                    const td = tr.childNodes[i];
                                    switch (td.className) {
                                        case 'hd':
                                            if (td.getAttribute('rowspan') == '7') {
                                                haveDate = true;
                                                line.date = removeBadSym(td.textContent);
                                            } else {
                                                line.time = removeBadSym(td.textContent);
                                            };
                                            break;
                                        case 'ur':
                                            if (i == 1 + haveDate) {
                                                for (const a of td.childNodes) {
                                                    switch (a.className) {
                                                        case 'z1': line.item = removeBadSym(a.textContent); break;
                                                        case 'z2': line.classroom = removeBadSym(a.textContent); break;
                                                        case 'z3': line.teacher = removeBadSym(a.textContent); break;
                                                    };
                                                };
                                            };
                                            break;
                                    };
                                };
                                lines.push(line);
                            };
                            // фильтр
                            for (let i = 0; i < lines.length; i++) {
                                const array = Object.values(lines[i]);
                                let notFound = 0;
                                array.forEach(value => {
                                    if (value == undefined) { notFound++; };
                                });
                                if (notFound == array.length) { indexForRemove.push(i); };
                            };
                            indexForRemove.sort((a, b) => b - a).forEach(index => {
                                lines.splice(index, 1);
                            });
                            // сортировка
                            for (let i = 0; i < lines.length; i++) {
                                if (lines[i].date != undefined) {
                                    const result = [];
                                    for (let k = i; k < i + 6; k++) {
                                        result.push(lines[k]);
                                    };
                                    normalizeData.days.push(result);
                                };
                            };
                            return normalizeData;
                        }).catch(error => errLog(error));
                        if (lastUpdate != pares.lastUpdate) {
                            lastUpdate = pares.lastUpdate;
                            const channel = await client.channels.fetch('871850948425822249');
                            const user = await client.users.fetch('468367650796339201');
                            channel.messages.fetch({ limit: 100 }).then(messages => {
                                messages.forEach(message => {
                                    if (message.author.bot) {
                                        try { message.delete(); } catch (error) { errLog(error); };
                                    };
                                });
                            });
                            user.send({
                                embeds: [new EmbedBuilder()
                                    .setTitle(pares.lastUpdate)
                                    .setTimestamp(new Date().getTime())
                                    .setColor(`#${genColor(16, 100)}${genColor(16, 100)}${genColor(16, 100)}`)
                                    .setURL('https://omacademy.ru/rasp-new/Website-students/cg36.htm')
                                    .setDescription(
                                        (() => {
                                            function isUndef(value, afterText = '', beforeText = '') {
                                                return (value == undefined ? '' : afterText + value + beforeText);
                                            };
                                            let result = '';
                                            for (let i = 0; i < 4; i++) {
                                                if (isUndefined(pares.days[i])) { continue; };
                                                pares.days[i].forEach(line => {
                                                    result +=
                                                        isUndef(line.date, '# ', '\n') +
                                                        isUndef(line.time, '**', '**') +
                                                        isUndef(line.classroom, '\n``', '``\n') +
                                                        isUndef(line.item, '```', '\n') +
                                                        isUndef(line.teacher, '', '```') + '\n';
                                                });
                                            };
                                            if (result == '') { result = 'Parsing error'; };
                                            return result.slice(0, 2000);
                                        })()
                                    )
                                ]
                            });
                        };
                        setTimeout(() => { cycle(); }, 1800000);
                    })();
                },
            },
        },
    };

function errLog(text) {
    console.log(
        `%c${text}`,
        `
        padding:10px;
        color:rgb(255, 200, 200);
        border-top:2px rgb(175, 150, 150) solid;
        border-bottom:2px rgb(175, 150, 150) solid;
        background-color:rgb(75, 50, 50);
        `
    );
};
function totalMemberCount() {
    let members = 0;
    client.guilds.cache.forEach(guild => members += guild.memberCount);
    return members;
};
function totalUserCount() { return client.users.cache.size; };
function totalBotCount() { return totalMemberCount() - client.users.cache.size; };
function isUndefined(value = undefined) { return value == undefined; };
function saveJSON(path = '', data) { fs.writeFileSync(path, JSON.stringify(data)); return data; };
function loadJSON(path = '') { try { return JSON.parse(fs.readFileSync(path)); } catch { return saveJSON(path, {}); }; };
function randValue(value = 100) { return Math.floor(Math.random() * value); };
function randArrValue(array = []) { return array[randValue(array.length)]; };
function workTime() { return new Date(new Date() - startTimestamp); };
function fixTime(number = 10) { return (number.toString().length == 1 ? '0' : '') + number.toString(); };
function genColor(format = 10, minBrightness = 0, maxBrightness = 255) {
    let value = randValue(maxBrightness - minBrightness) + minBrightness;
    return (value > 255 ? 255 : (value < 0 ? 0 : value)).toString(format);
};

client.once(Events.ClientReady, () => {
    db.startTime = new Date() - startTimestamp;
    db.starts += 1;
    saveJSON(path.join(__dirname, 'database.json'), db);

    rest.put(Routes.applicationCommands(client.user.id), {
        body: (() => {
            const result = [];
            Object.values(scripts.events.interactionCreate).forEach(interaction => {
                result.push(interaction.data.toJSON());
            });
            return result;
        })()
    });

    Object.values(scripts.modules).forEach(module => { module.execute(); });

    console.log('Started!');
});

client.on(Events.InteractionCreate, interaction => {
    try {
        const command = scripts.events.interactionCreate[interaction.commandName];
        if (!command) { return; };

        if (interaction.isAutocomplete()) {
            command.autocomplete(interaction);
        };
        if (interaction.isChatInputCommand()) {
            command.execute(interaction).then(callback => {
                const time = new Date();
                const year = time.getFullYear().toString();
                const month = fixTime(time.getMonth());
                const day = fixTime(time.getDay());
                const hour = fixTime(time.getHours());
                const minute = fixTime(time.getMinutes());
                const second = fixTime(time.getSeconds());
                if (db.logs == undefined) { db.logs = []; };
                db.logs.push({
                    time: time,
                    guildId: interaction.guildId,
                    channelId: interaction.channelId,
                    userId: interaction.user.id,
                    messageId: interaction.id,
                    commandName: interaction.commandName,
                    optionsData: interaction.options.data,
                    callback: callback,
                });
                saveJSON(path.join(__dirname, 'database.json'), db);
                console.log([
                    year + '/' + month + '/' + day,
                    hour + ':' + minute + ':' + second,
                    interaction.guild.name, interaction.user.username, `/ ${interaction.commandName} `
                ].reduce((sum, value) => sum + ' | ' + value), callback);
            });
        };
    } catch (error) {
        errLog(error);
        interaction.reply({ content: `Не удалось выполнить "${interaction.commandName}"`, ephemeral: true });
    }
});

client.on(Events.MessageCreate, message => {
    try {
        Object.values(scripts.events.messageCreate).forEach(e => {
            e.execute(message);
        });
    } catch (error) { errLog(error); };
});

// логиним бота
client.login(config.token);