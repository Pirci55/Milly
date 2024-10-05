import * as DiscordJS from 'discord.js';
import * as InteractionsImports from './@InteractionsImports';

export { data, execute };

const Libs = InteractionsImports.LibsExports;
const { Tools } = Libs;

const data = new DiscordJS.SlashCommandBuilder()
    .setName('format_color').setNameLocalizations({ ru: 'формат_цвет' })
    .setDescription('Color formating')
    .setDescriptionLocalizations({ ru: 'Форматирование цвета' })
    .addStringOption(option => option.setName('color').setRequired(true)
        .setNameLocalizations({ ru: 'цвет' })
        .setDescription('Hex, Rgb, Dec')
        .setMaxLength(32)
    )
    .addStringOption(option => option.setName('format').setRequired(true)
        .setNameLocalizations({ ru: 'формат' })
        .setDescription('Hex, Rgb, Dec')
        .addChoices(
            { name: '#rrggbb', value: 'hex' },
            { name: 'r, g, b', value: 'rgb' },
            { name: '123456789', value: 'dec' },
        )
    );
async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    const l = interaction.locale;
    const descriptionContent = {
        hex: '',
        rgb: [],
        dec: 0
    };
    const format = interaction.options.getString('format');
    let color = interaction.options.getString('color');

    try {
        switch (format) {
            case 'rgb':
                let args = color.split(/[ ,]+/g).map((value) => parseInt(value));
                descriptionContent.hex = Tools.rgbColorToHexColor(args[0], args[1], args[2]);
                descriptionContent.rgb = args;
                descriptionContent.dec = Tools.rgbColorToDecColor(args[0], args[1], args[2]);
                break;
            case 'dec':
                descriptionContent.hex = Tools.decColorToHexColor(parseInt(color));
                descriptionContent.rgb = Tools.decColorToRgbColor(parseInt(color));
                descriptionContent.dec = parseInt(color);
                break;
            case 'hex':
                descriptionContent.hex = Tools.fixHexColor(color);
                descriptionContent.rgb = Tools.hexColorToRgbColor(color);
                descriptionContent.dec = Tools.hexColorToDecColor(color);
                break;
        };

        await interaction.reply({
            embeds: [
                new DiscordJS.EmbedBuilder()
                    .setDescription([
                        '### **' + Tools.lang(l, 'Ввод', 'Input') + ':** `' + color + '`',
                        '',
                        '**HEX**', '(`' + descriptionContent.hex + '`)',
                        '**RGB**', '(`' + descriptionContent.rgb.join('`, `') + '`)',
                        '**DEC**', '(`' + descriptionContent.dec + '`)',
                    ].join('\n'))
                    // @ts-ignore
                    .setColor(descriptionContent.hex)
            ]
        });
    } catch {
        await interaction.reply({ content: Tools.lang(l, 'Не валидный цвет', 'Not valid color') });
    };
};