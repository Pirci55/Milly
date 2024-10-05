module.exports = {
	commandName: 'interactionCreate',
	name: 'interactionCreate',
	execute(interaction) {
		date = new Date()
		if (date.getHours() <= 9) {
			hourTime = '0';
		}
		else {
			hourTime = '';
		}
		if (date.getMinutes() <= 9) {
			minutTime = '0';
		}
		else {
			minutTime = '';
		}
		console.log(`${hourTime}${date.getHours()}:${minutTime}${date.getMinutes()} Команда: "${interaction.commandName}" Пользователь: ${interaction.user.tag} Сервер: "${interaction.guild.name}" Канал: "${interaction.channel.name}"`);
	},
};