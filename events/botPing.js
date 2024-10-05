module.exports = {
    commandName: 'botping',
    name: 'messageCreate',
    execute(message) {
        if (message.content.trim().toLowerCase() == '<@!123>') {
            return message.reply('М?');
        };
    }
};