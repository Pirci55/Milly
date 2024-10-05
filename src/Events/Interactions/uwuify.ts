import * as DiscordJS from 'discord.js';

export { data, execute };

const data = new DiscordJS.SlashCommandBuilder()
    .setName('uwuify').setNameLocalizations({ ru: 'увуфицировать' })
    .setDescription('Replaces some letters with the letter "w"')
    .setDescriptionLocalizations({ ru: 'Заменяет некоторые буквы на букву "w"' })
    .addStringOption(option => option.setName('text').setRequired(true)
        .setNameLocalizations({ ru: 'текст' })
        .setDescription('Your text').setDescriptionLocalizations({ ru: 'Ваш текст' })
        .setMaxLength(1024)
    );
async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    const ruChars = ['л', 'м', 'в', 'п', 'ф', 'р', 'ш', 'щ'];
    const enChars = ['l', 'm', 'p', 'f', 'v', 'r'];
    let text = interaction.options.getString('text');

    await interaction.reply({
        content: text
            .replace(new RegExp('[' + (ruChars.join('') + enChars.join('')).toUpperCase() + ']', 'g'), 'W')
            .replace(new RegExp('[' + (ruChars.join('') + enChars.join('')).toLowerCase() + ']', 'g'), 'w')
    });
};