const var_hello = [
    'Здравствуй',
    'Привет',
    'Qq',
    '0/',
    'Ку',
];

const command_triggers = [
    'здравствуй',
    'здравствуйте',
    'здравствуйте все',
    'привет',
    'привет всем',
    'всем привет',
    'qq',
    'qq all',
    'ку',
    'ку всем',
    'всем ку',
    'здаров',
    'здаров всем',
    'здарова',
    'здарова всем',
];

module.exports = {
    commandName: 'hello',
    name: 'messageCreate',
    execute(message) {
        const client = MYAPP.botClient;
        if (message.author.username == client.user.username && message.author.discriminator == client.user.discriminator) return;
        for (let i = 0; i < command_triggers.length; i++) {
            if (message.content.trim().toLowerCase() == command_triggers[i]) {
                var RandElement = var_hello[Math.floor(Math.random() * var_hello.length)];
                return message.reply(`${RandElement}`);
            };
        }
    }
};