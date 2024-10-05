const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fetch = require('node-fetch');

var var_activities = {
    '880218394199220334': 'Youtube',
    '880218832743055411': 'Youtube.dev',
    '755827207812677713': 'Poker',
    '773336526917861400': 'Betrayal',
    '814288819477020702': 'Fishing',
    '832012774040141894': 'Chess',
    '832012586023256104': 'Chess.dev',
    '879863686565621790': 'Lettertile',
    '879863976006127627': 'Wordsnack',
    '878067389634314250': 'Doodlecrew',
    '879863881349087252': 'Awkword',
    '852509694341283871': 'Spellcast',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Запустить активность')
        .addStringOption(option =>
            option
                .setName('target')
                .setDescription('Выберите активность')
                .setRequired(true)
                .addChoice('Youtube', '880218394199220334')
                .addChoice('Youtube.dev', '880218832743055411')
                .addChoice('Poker', '755827207812677713')
                .addChoice('Betrayal', '773336526917861400')
                .addChoice('Fishing', '814288819477020702')
                .addChoice('Chess', '832012774040141894')
                .addChoice('Chess.dev', '832012586023256104')
                .addChoice('Lettertile', '879863686565621790')
                .addChoice('Wordsnack', '879863976006127627')
                .addChoice('Doodlecrew', '878067389634314250')
                .addChoice('Awkword', '879863881349087252')
                .addChoice('Spellcast', '852509694341283871'))
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Выберите канал')
                .addChannelType(2)),
    async execute(interaction) {
        const client = MYAPP.botClient;
        const apl_id = interaction.options.getString('target');
        const apl_channel = interaction.options.getChannel('channel');;
        const apl_name = var_activities[apl_id] || null;
        if (apl_channel) {
            inv_id = apl_channel.id;
            apl_name_id = apl_channel.name;
        } else {
            try {
                inv_id = interaction.member.voice.channel.id;
                apl_name_id = interaction.member.voice.channel.name;
            } catch (err) {
                rolecolor = "#2C2E33";
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor(`${rolecolor}`)
                    .setDescription(`Нужно находиться в голосовом канале, или указать канал`);
                interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
                return;
            }
        }
        fetch(`https://discord.com/api/v8/channels/${inv_id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: apl_id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(invite => {
                rolecolor = "#2C2E33";
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor(`${rolecolor}`)
                    .setDescription(`["${apl_name}" в канале "${apl_name_id}"](https://discord.com/invite/${invite.code})`);
                interaction.reply({ embeds: [exampleEmbed] });
            })
    },
};