import * as DiscordJS from 'discord.js';
import * as InteractionsImports from './@InteractionsImports';

export { data, execute };

const Libs = InteractionsImports.LibsExports;

const data = new DiscordJS.SlashCommandBuilder()
    .setName('gen_color').setNameLocalizations({ ru: 'ген_цвет' })
    .setDescription('Color generation')
    .setDescriptionLocalizations({ ru: 'Генерация цвета' })
    .addNumberOption(option => option.setName('min_brightness_percent')
        .setNameLocalizations({ ru: 'процент_мин_яркости' })
        .setDescription('Sets minimal brightness for color')
        .setDescriptionLocalizations({ ru: 'Устанавливает для цвета минимальную яркость' })
        .setMinValue(0)
        .setMaxValue(100)
    )
    .addNumberOption(option => option.setName('max_brightness_percent')
        .setNameLocalizations({ ru: 'процент_макс_яркости' })
        .setDescription('Sets maximum brightness for color')
        .setDescriptionLocalizations({ ru: 'Устанавливает для цвета максимальную яркость' })
        .setMinValue(0)
        .setMaxValue(100)
    );
async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    let minBrightnessPercent = interaction.options.getNumber('min_brightness_percent');
    let maxBrightnessPercent = interaction.options.getNumber('max_brightness_percent');
    minBrightnessPercent = (minBrightnessPercent == null ? 0 : minBrightnessPercent);
    maxBrightnessPercent = (maxBrightnessPercent == null ? 255 : maxBrightnessPercent);

    const color = Libs.Tools.genColor(maxBrightnessPercent, minBrightnessPercent);

    await interaction.reply({
        embeds: [
            new DiscordJS.EmbedBuilder()
                .setDescription([
                    '**HEX**', '(`' + color.hex + '`)',
                    '**RGB**', '(`' + color.rgb.join('`, `') + '`)',
                    '**DEC**', '(`' + color.dec + '`)',
                ].join('\n'))
                // @ts-ignore
                .setColor(color.hex)
        ]
    });
};