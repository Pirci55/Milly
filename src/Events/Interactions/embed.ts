import * as DiscordJS from 'discord.js';
import * as InteractionsImports from './@InteractionsImports';

export { data, execute, modal };

const Src = InteractionsImports.SrcExports;
const Libs = InteractionsImports.LibsExports;
const Tools = Libs.Tools;
const Regex = Libs.Regex;

const data = new DiscordJS.SlashCommandBuilder()
    .setName('embed').setNameLocalizations({ ru: 'эмбед' })
    .setDescription('Allows you to create embeds')
    .setDescriptionLocalizations({ ru: 'Позволяет создавать эмбеды' })

    .addSubcommand(subcommand => subcommand.setName('create')
        .setNameLocalizations({ ru: 'создать' })
        .setDescription('Creates an empty embed').setDescriptionLocalizations({ ru: 'Создаёт пустой эмбед' })
    )
    .addSubcommand(subcommand => subcommand.setName('edit')
        .setNameLocalizations({ ru: 'редактировать' })
        .setDescription('Edited by embed').setDescriptionLocalizations({ ru: 'Редактирует эмбед' })

        .addStringOption(option => option.setName('category').setRequired(true)
            .setNameLocalizations({ ru: 'категория' })
            .setDescription('Description').setDescriptionLocalizations({ ru: 'Описание' })
            .addChoices({
                name: 'Title_color_description',
                name_localizations: { ru: 'Заголовок_Цвет_Описание' },
                value: 'category1'
            }, {
                name: 'Thumbnail, timestamp and image',
                name_localizations: { ru: 'Миниатюра_Таймстамп_Изображение' },
                value: 'category2'
            }, {
                name: 'Author',
                name_localizations: { ru: 'Автор' },
                value: 'category3'
            }, {
                name: 'Footer',
                name_localizations: { ru: 'Подвал' },
                value: 'category4'
            })
        )

        .addStringOption(option => option.setName('id')
            .setNameLocalizations({ ru: 'id' })
            .setDescription('Load data from embed').setDescriptionLocalizations({ ru: 'Загрузит данные с эмбеда' })
            .setMinLength(1)
            .setMaxLength(64)
        )
    );
async function execute(interaction: DiscordJS.ChatInputCommandInteraction<DiscordJS.CacheType>) {
    const { Client } = Src.Index;
    const l = interaction.locale;

    const options = {
        subcommand: interaction.options.getSubcommand(),
        category: interaction.options.getString('category'),
        id: interaction.options.getString('id'),
    };

    if (options.subcommand == 'create') {
        const newEmbed = new DiscordJS.EmbedBuilder();
        await interaction.reply({ embeds: [newEmbed.setDescription('ID: ...')] });
        const reply = await interaction.fetchReply();
        await interaction.editReply({ embeds: [newEmbed.setDescription(reply.id)] })
    } else {
        const message = await interaction.channel.messages.fetch(options.id).catch(() => { });
        let oldEmbed: DiscordJS.Embed;
        if (message) if (message.embeds) if (message.embeds.length) oldEmbed = message.embeds[0];
        const editorModal = new DiscordJS.ModalBuilder()
            .setCustomId(data.name)
            .setTitle(Tools.lang(l, 'Эмбед редактор', 'Embed editor'))
            .setComponents(
                new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                    new DiscordJS.TextInputBuilder()
                        .setCustomId('id')
                        .setLabel(Tools.lang(l, 'Айди сообщения', 'Message id'))
                        .setStyle(DiscordJS.TextInputStyle.Short)
                        .setMinLength(0)
                        .setMaxLength(64)
                        .setRequired(true)
                        .setValue(oldEmbed ? options.id : '')
                )
            );

        switch (options.category) {
            case 'category1':
                editorModal.addComponents(
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('title')
                            .setLabel(Tools.lang(l, 'Заголовок', 'Title'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder(Tools.lang(l, 'Мой заголовок', 'My title'))
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.title)
                                        value = oldEmbed.data.title;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('description')
                            .setLabel(Tools.lang(l, 'Описание', 'Description'))
                            .setStyle(DiscordJS.TextInputStyle.Paragraph)
                            .setPlaceholder(Tools.lang(l, 'Мое описание', 'My description'))
                            .setMinLength(0)
                            .setMaxLength(2048)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.description)
                                        value = oldEmbed.data.description;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('color')
                            .setLabel(Tools.lang(l, 'Цвет', 'Color'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('#rrggbb')
                            .setMinLength(0)
                            .setMaxLength(16)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.color)
                                        value = '#' + oldEmbed.data.color.toString(16);
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('title_url')
                            .setLabel(Tools.lang(l, 'Ссылка заголовка', 'Title url'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('https://example.com')
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.url)
                                        value = oldEmbed.data.url;
                                return value;
                            })())
                    ),
                );
                break;
            case 'category2':
                editorModal.addComponents(
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('thumbnail_url')
                            .setLabel(Tools.lang(l, 'Ссылка миниатюры', 'Thumbnail url'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('https://example.com/example.png')
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.thumbnail)
                                        if (oldEmbed)
                                            if (oldEmbed.data.thumbnail.url)
                                                value = oldEmbed.data.thumbnail.url;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('image_url')
                            .setLabel(Tools.lang(l, 'Ссылка изображения', 'Image url'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('https://example.com/example.png')
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.image)
                                        if (oldEmbed)
                                            if (oldEmbed.data.image.url)
                                                value = oldEmbed.data.image.url;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('timestamp')
                            .setLabel(Tools.lang(l, 'Таймстамп', 'Timestamp'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('123456789')
                            .setMinLength(0)
                            .setMaxLength(32)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.timestamp)
                                        value = new Date(oldEmbed.data.timestamp).getTime().toString();
                                return value;
                            })())
                    ),
                );
                break;
            case 'category3':
                editorModal.addComponents(
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('author_name')
                            .setLabel(Tools.lang(l, 'Имя автора', 'Author name'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder(Tools.lang(l, 'Мое имя', 'My name'))
                            .setMinLength(0)
                            .setMaxLength(64)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.author)
                                        if (oldEmbed)
                                            if (oldEmbed.data.author.name)
                                                value = oldEmbed.data.author.name;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('author_url')
                            .setLabel(Tools.lang(l, 'Ссылка автора', 'Author url'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('https://example.com')
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.author)
                                        if (oldEmbed)
                                            if (oldEmbed.data.author.url)
                                                value = oldEmbed.data.author.url;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('author_image_url')
                            .setLabel(Tools.lang(l, 'Ссылка изображения автора', 'Author image url'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('https://example.com/example.png')
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.author)
                                        if (oldEmbed)
                                            if (oldEmbed.data.author.icon_url)
                                                value = oldEmbed.data.author.icon_url;
                                return value;
                            })())
                    ),
                );
                break;
            case 'category4':
                editorModal.addComponents(
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('footer_text')
                            .setLabel(Tools.lang(l, 'Текст подвала', 'Footer text'))
                            .setStyle(DiscordJS.TextInputStyle.Paragraph)
                            .setPlaceholder(Tools.lang(l, 'Мой текст', 'My text'))
                            .setMinLength(0)
                            .setMaxLength(1024)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.footer)
                                        if (oldEmbed)
                                            if (oldEmbed.data.footer.text)
                                                value = oldEmbed.data.footer.text;
                                return value;
                            })())
                    ),
                    new DiscordJS.ActionRowBuilder<DiscordJS.ModalActionRowComponentBuilder>().setComponents(
                        new DiscordJS.TextInputBuilder()
                            .setCustomId('footer_image_url')
                            .setLabel(Tools.lang(l, 'Ссылка изображения подвала', 'Footer image url'))
                            .setStyle(DiscordJS.TextInputStyle.Short)
                            .setPlaceholder('https://example.com/example.png')
                            .setMinLength(0)
                            .setMaxLength(256)
                            .setRequired(false)
                            .setValue((function () {
                                let value = '';
                                if (oldEmbed)
                                    if (oldEmbed.data.footer)
                                        if (oldEmbed)
                                            if (oldEmbed.data.footer.icon_url)
                                                value = oldEmbed.data.footer.icon_url;
                                return value;
                            })())
                    ),
                );
                break;
        };

        await interaction.showModal(editorModal);
    };
};

async function modal(interaction: DiscordJS.ModalSubmitInteraction<DiscordJS.CacheType>) {
    const { Client } = Src.Index;
    const l = interaction.locale;

    const options = {
        color: interaction.fields.fields.get('color'),
        title: interaction.fields.fields.get('title'),
        title_url: interaction.fields.fields.get('title_url'),
        description: interaction.fields.fields.get('description'),

        thumbnail_url: interaction.fields.fields.get('thumbnail_url'),
        timestamp: interaction.fields.fields.get('timestamp'),
        image_url: interaction.fields.fields.get('image_url'),

        author_name: interaction.fields.fields.get('author_name'),
        author_url: interaction.fields.fields.get('author_url'),
        author_image_url: interaction.fields.fields.get('author_image_url'),

        footer_text: interaction.fields.fields.get('footer_text'),
        footer_image_url: interaction.fields.fields.get('footer_image_url'),
    };

    const message = await interaction.channel.messages.fetch(interaction.fields.getTextInputValue('id')).catch(() => { });
    if (!message) {
        interaction.reply({ content: Tools.lang(l, 'Сообщение не найдено', 'Message not found'), ephemeral: true });
        return;
    };
    if (message.author.id != Client.user.id ||
        message.interaction.user.id != interaction.user.id ||
        message.author.id != interaction.applicationId) {
        interaction.reply({ content: Tools.lang(l, 'Недостаточно прав', 'Not enough rights'), ephemeral: true });
        return;
    };
    if (message.embeds.length == 0) {
        interaction.reply({ content: Tools.lang(l, 'У сообщения отсутствуют эмбеды', 'The message has no embeddings'), ephemeral: true });
        return;
    };

    const newEmbed = new DiscordJS.EmbedBuilder(message.embeds[0]);
    const notes = [];

    if (options.title)
        if (options.title.value.length) {
            try { newEmbed.setTitle(options.title.value); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимый заголовок', 'Invalid title'),
                    ': ',
                    options.title.value
                ].join(''));
            }
        } else newEmbed.data.title = null;
    if (options.title_url)
        if (options.title_url.value.length) {
            try { newEmbed.setURL(options.title_url.value); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимая ссылка', 'Invalid link'),
                    ': ',
                    options.title_url.value
                ].join(''));
            }
        } else newEmbed.data.url = null;

    if (options.description)
        if (options.description.value.length) {
            try { newEmbed.setDescription(options.description.value); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимое описание', 'Invalid description'),
                    ': ',
                    options.description.value
                ].join(''));
            }
        } else newEmbed.data.description = null;
    if (options.color)
        if (options.color.value.length) {
            // @ts-ignore
            try { newEmbed.setColor(options.color.value.replace(/0/g, '1')); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимый цвет', 'Invalid color'),
                    ': ',
                    options.color.value
                ].join(''));
            }
        } else newEmbed.data.color = null;
    if (options.image_url)
        if (options.image_url.value.length) {
            try { newEmbed.setImage(options.image_url.value); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимое изображение', 'Invalid image'),
                    ': ',
                    options.image_url.value
                ].join(''));
            }
        } else newEmbed.data.image = null;
    if (options.thumbnail_url)
        if (options.thumbnail_url.value.length) {
            try { newEmbed.setThumbnail(options.thumbnail_url.value); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимая миниатюра', 'Invalid thumbnail'),
                    ': ',
                    options.thumbnail_url.value
                ].join(''));
            }
        } else newEmbed.data.thumbnail = null;
    if (options.timestamp)
        if (options.timestamp.value.length) {
            try { newEmbed.setTimestamp(parseInt(options.timestamp.value)); }
            catch {
                notes.push([
                    Tools.lang(l, 'Недопустимое время', 'Invalid timestamp'),
                    ': ',
                    options.timestamp.value
                ].join(''));
            }
        } else newEmbed.data.timestamp = null;

    if (options.footer_text)
        if (options.footer_text.value.length) {
            try {
                let iconURL = null;
                if (newEmbed.data.footer) if (newEmbed.data.footer.icon_url) iconURL = newEmbed.data.footer.icon_url;
                newEmbed.setFooter({ text: options.footer_text.value, iconURL });
            } catch {
                notes.push([
                    Tools.lang(l, 'Недопустимый текст подвала', 'Invalid footer text'),
                    ': ',
                    options.footer_text.value
                ].join(''));
            }
        } else if (newEmbed.data.footer) newEmbed.data.footer.text = null;
    if (options.footer_image_url)
        if (options.footer_image_url.value.length) {
            try {
                let text = null;
                if (newEmbed.data.footer) if (newEmbed.data.footer.text) text = newEmbed.data.footer.text;
                newEmbed.setFooter({ text, iconURL: options.footer_image_url.value });
            } catch {
                notes.push([
                    Tools.lang(l, 'Недопустимое изображение подвала', 'Invalid footer image'),
                    ': ',
                    options.footer_image_url.value
                ].join(''));
            }
        } else if (newEmbed.data.footer) newEmbed.data.footer.icon_url = null;

    if (options.author_name)
        if (options.author_name.value.length) {
            try {
                let url = null;
                let iconURL = null;
                if (newEmbed.data.author) if (newEmbed.data.author.url) url = newEmbed.data.author.url;
                if (newEmbed.data.author) if (newEmbed.data.author.icon_url) iconURL = newEmbed.data.author.icon_url;
                newEmbed.setAuthor({ name: options.author_name.value, url, iconURL });
            } catch {
                notes.push([
                    Tools.lang(l, 'Недопустимое имя', 'Invalid author name'),
                    ': ',
                    options.author_name.value
                ].join(''));
            }
        } else if (newEmbed.data.author) newEmbed.data.author.name = null;
    if (options.author_url)
        if (options.author_url.value.length) {
            try {
                let name = null;
                let iconURL = null;
                if (newEmbed.data.author) if (newEmbed.data.author.name) name = newEmbed.data.author.name;
                if (newEmbed.data.author) if (newEmbed.data.author.icon_url) iconURL = newEmbed.data.author.icon_url;
                newEmbed.setAuthor({ name, url: options.author_url.value, iconURL });
            } catch {
                notes.push([
                    Tools.lang(l, 'Недопустимая ссылка автора', 'Invalid author url'),
                    ': ',
                    options.author_url.value
                ].join(''));
            }
        } else if (newEmbed.data.author) newEmbed.data.author.url = null;
    if (options.author_image_url)
        if (options.author_image_url.value.length) {
            try {
                let name = null;
                let url = null;
                if (newEmbed.data.author) if (newEmbed.data.author.name) name = newEmbed.data.author.name;
                if (newEmbed.data.author) if (newEmbed.data.author.url) url = newEmbed.data.author.url;
                newEmbed.setAuthor({ name, url, iconURL: options.author_image_url.value });
            } catch {
                notes.push([
                    Tools.lang(l, 'Недопустимое изображение автора', 'Invalid author image url'),
                    ': ',
                    options.author_image_url.value
                ].join(''));
            }
        } else if (newEmbed.data.author) newEmbed.data.author.icon_url = null;

    if (typeof newEmbed.data.description != 'string' && typeof newEmbed.data.title != 'string') {
        newEmbed.setDescription(Tools.lang(l, 'Обязательно наличие описания или заголовка', 'A description or title is required'));
    };

    message.edit({ embeds: [newEmbed] })
        .then(function () {
            interaction.reply({
                content: [
                    Tools.lang(l, 'Готово!', 'Finnaly!'),
                    (notes.length ? Tools.lang(l, 'Примечания:', 'Notes:') : ''),
                    ...notes,
                ].join('\n'),
                ephemeral: true
            });
        })
        .catch(function () {
            interaction.reply({ content: Tools.lang(l, 'Не удалось отредактировать сообщение', 'The message could not be edited'), ephemeral: true });
        });
};