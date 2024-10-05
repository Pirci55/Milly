import * as DiscordJS from 'discord.js';
import * as InteractionsImports from './@InteractionsImports';

export { data, autocomplete, execute };

const LibsExports = InteractionsImports.LibsExports;
const DB = new LibsExports.DB();
const Tools = LibsExports.Tools;

const data = new DiscordJS.SlashCommandBuilder()
    .setName('rptest').setNameLocalizations({ ru: 'рптест' })
    .setDescription('Make rp action').setDescriptionLocalizations({ ru: 'Сделать рп действие' })
    .addStringOption(option => option.setName('action').setRequired(true)
        .setNameLocalizations({ ru: 'действие' })
        .setDescription('@user')
        .setDescriptionLocalizations({ ru: '@пользователь' })
        .setAutocomplete(true)
    );
async function autocomplete(interaction: DiscordJS.AutocompleteInteraction<DiscordJS.CacheType>) {
    let members = [];
    let userInput = interaction.options.getFocused();
    let patterns = DB.getColumn(await DB.sql('rpmessages').select('*'), 'content');

    if (userInput.length) {
        patterns.push(userInput)
    }
    else patterns = [];

    userInput = userInput
        .split(' ')
        .map(async word => {
            const isMember = /@(\S)+/g.test(word);

            if (isMember) {
                members = (await interaction.guild.members.fetch()).map(member => member);
                const member = members.filter(member => {
                    const name = member.displayName;
                    if (!name) return false;
                    return name.toLowerCase().startsWith(word.slice(1).toLowerCase());
                }).shift();
                if (member) word = member.displayName;
            };

            return word;
        })
        .join(' ');

    const transformed = patterns
        .sort((pattern1, pattern2) => {
            const a = Tools.compareText(pattern1, userInput);
            const b = Tools.compareText(pattern2, userInput);
            return (a == b ? -1 : (a > b ? -1 : 1));
        })
        .slice(0, 5)
        .map(pattern => {
            const name =  pattern;
            members.forEach(member => {
                pattern = pattern
                    .replace(Tools.ecroSpecChar(member.displayName), `<@${member.id}>`);
            });
            const value = pattern;
            return { name, value }
        });

    await interaction.respond(transformed);
};
async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    const action = interaction.options.getString('action');
    const filtered = action.replace(/[<@]+[0-9]+>/g, '@');

    await interaction.reply({ content: `\\*${action}\\*` });
    await DB.sql('rpmessages')
        .insert({ content: DB.sql.raw('?', filtered) })
        .catch(() => { });
};