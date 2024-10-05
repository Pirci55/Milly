const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Client, Collection, Intents, Options } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_WEBHOOKS
	]
});

MYAPP = {};
all_bot_commands = [];
all_bot_events = [];
const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	all_bot_commands.push(command.data.toJSON().name);
};

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	};
	all_bot_events.push(event.commandName);
};

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		all_bot_commands = `${all_bot_commands}`;
		all_bot_events = `${all_bot_events}`;
		console.log(`1) Запущена регистрация ивентов: ${all_bot_events.replace(/\,/g, ' ')}`);
		console.log(`2) Запущена регистрация команд: ${all_bot_commands.replace(/\,/g, ' ')}`);

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('3) Зарегистрировано!');
	} catch (error) {
		console.error(error);
	}
})();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
};

// Создаёт кастомное окончание слова в зависимости от числа
function customEnding(number, single, few, multiple) {
	if (Math.floor(number / 10) % 10 == 1) return multiple;
	return number % 10 == 0 ? multiple : number % 10 == 1 ? single : number % 10 < 5 ? few : multiple;
};

client.once('ready', () => {
	console.log("============== Milly ==============");
	presence1();
	function presence1() {
		client.guilds.cache.get('629236364113739795').roles.cache.get('901546248266461244').setColor('RANDOM')

		membersCounter = 0;
		client.guilds.cache.forEach(guild => {
			membersCounter += guild.memberCount;
		});
		client.user.setPresence({
			activities: [{
				name: `${membersCounter} пользовател${customEnding(membersCounter, 'ь', 'я', 'ей')}`,
				type: 'WATCHING',
			}]
		});
		setTimeout(presence2, 500000);
	}
	function presence2() {
		client.guilds.cache.get('629236364113739795').roles.cache.get('901546248266461244').setColor('RANDOM')

		serversCounter = 0;
		serversCounter = client.guilds.cache.size;
		client.user.setPresence({
			activities: [{
				name: `${serversCounter} сервер${customEnding(serversCounter, '', 'а', 'ов')}`,
				type: 'WATCHING',
			}]
		});
		setTimeout(presence1, 500000);
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async message => {
	if (message.author.username == client.user.username && message.author.discriminator == client.user.discriminator) return;
	const command = client.commands.get(message.commandName);
	if (!command) return;
	try {
		await command.execute(message);
	} catch (error) {
		console.error(error);
	}
});

MYAPP.botFs = fs;
MYAPP.botClient = client;

client.login(token);