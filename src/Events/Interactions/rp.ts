import * as DiscordJS from 'discord.js';
import * as InteractionsImports from './@InteractionsImports';

export { data, execute };

const data = (() => {
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
    const slashCommand = new DiscordJS.SlashCommandBuilder()
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
})();

async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    const l = interaction.locale;
    const Libs = InteractionsImports.LibsExports;
    const Tools = Libs.Tools;
    const Regex = Libs.Regex;
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

    const content = '*' + result.reduce((sum, item) => sum + (typeof item == 'string' ? ' ' + item : '')).trim() + '\\*';
    if (image != null) {
        if (image.match(new RegExp(Regex.url, 'g')).length > 0) {
            const embed = new DiscordJS.EmbedBuilder()
                .setColor(Tools.genDecColor(100, 25))
                .setFooter({ text: interaction.member.user.username, iconURL: interaction.user.avatarURL({ size: 1024 }) })
                .setTimestamp(Date.now())
                .setImage(image);
            interaction.reply({ content: content, embeds: [embed] });
            return;
        };
    };
    interaction.reply(content);
};