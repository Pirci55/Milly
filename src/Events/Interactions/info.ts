import * as DiscordJS from 'discord.js';
import * as InteractionsImports from './@InteractionsImports';

export { data, execute };

const LibsExports = InteractionsImports.LibsExports;
const SrcExports = InteractionsImports.SrcExports;
const ModulesExports = InteractionsImports.ModulesExports;

const Tools = LibsExports.Tools;
const DB_Config = new LibsExports.DB_Config();

const { startDate } = ModulesExports.Ready;

const data = new DiscordJS.SlashCommandBuilder()
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
    );
async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    const { Client } = SrcExports.Index;
    const l = interaction.locale;
    const botConfig = await DB_Config.getBotConfig();
    const workTime = Tools.getTime(Tools.workTime(startDate).getTime());
    const embed = new DiscordJS.EmbedBuilder().setColor(Tools.genDecColor(100, 25));

    switch (interaction.options.getNumber('category')) {
        case 0:
            embed.setTitle(`${Client.user.username} ${Tools.lang(l, 'инфо', 'info')}`)
                .setDescription(`
                    \`${workTime.years}/${workTime.months}/${workTime.days
                    } ${workTime.hours}:${workTime.minutes}:${workTime.seconds}\` ${Tools.lang(l, 'время работы', 'work time')}
                    \`${botConfig['startTime']['value']}\` ${Tools.lang(l, 'мс последний запуск', 'ms last start')}
                    \`${botConfig['starts']['value']}\` ${Tools.lang(l, 'запусков', 'starts')}
                    \`${Client.guilds.cache.size}\` ${Tools.lang(l, 'серверов', 'guilds')}
                    \`${Tools.totalMemberCount(Client)}\` ${Tools.lang(l, 'пользователей', 'members')}
                    \`${Tools.totalUserCount(Client)}\` ${Tools.lang(l, 'юзеров', 'users')}
                    \`${Tools.totalBotCount(Client)}\` ${Tools.lang(l, 'ботов', 'bots')}
                `)
                .setThumbnail(Client.user.avatarURL({ size: 4096 }));
            break;
        case 1:
            const g = interaction.guild;
            embed.setTitle(`${interaction.guild.name} ${Tools.lang(l, 'инфо', 'info')}`)
                .setDescription(`
                    \`${g.description}\` ${Tools.lang(l, 'описание', 'description')}
                    \`${g.memberCount}/${g.maximumMembers}\` ${Tools.lang(l, 'пользователей', 'members')}
                    \`${g.channels.cache.size}\` ${Tools.lang(l, 'каналов', 'channels')}
                    \`${g.emojis.cache.size}\` ${Tools.lang(l, 'эмодзи', 'emojies')}
                    \`${g.stickers.cache.size}\` ${Tools.lang(l, 'стикеров', 'stickers')}
                    \`${g.roles.cache.size}\` ${Tools.lang(l, 'ролей', 'roles')}
                    \`${g.premiumSubscriptionCount}\` ${Tools.lang(l, 'бустов', 'nitros')}
                    \`${g.maximumBitrate}\` ${Tools.lang(l, 'макс битрейт', 'max bitrate')}
                    \`${g.nsfwLevel}\` nsfw ${Tools.lang(l, 'уровень', 'level')}
                    \`${g.verificationLevel}\` ${Tools.lang(l, 'уровень верификации', 'verification level')}
                    \`${g.ownerId}\` ${Tools.lang(l, 'id владельца', 'owner id')}
                    \`${g.id}\` ${Tools.lang(l, 'id сервера', 'guild id')}
                    \`${g.createdAt.getDay()}/${g.createdAt.getMonth()}/${g.createdAt.getFullYear()
                    } ${g.createdAt.getHours()}:${g.createdAt.getMinutes()}:${g.createdAt.getSeconds()
                    }\` ${Tools.lang(l, 'дата создания', 'created date')}
                `)
                .setThumbnail(interaction.guild.iconURL({ size: 4096 }))
                .setImage(interaction.guild.bannerURL({ size: 4096 }));
            break;
        default:
            embed.setTitle('Error');
            break;
    };
    interaction.reply({ embeds: [embed] });
};