const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

var var_bite_gif = [
    `https://cdn.discordapp.com/attachments/876845411036430366/876846185925730334/bite3.gif`,
    `https://cdn.discordapp.com/attachments/876845411036430366/876846186731012156/bite1.gif`,
    `https://cdn.discordapp.com/attachments/876845411036430366/876846192133308486/bite2.gif`
];

var var_boop_gif = [
    `https://cdn.discordapp.com/attachments/870779326633758770/870779780285497364/ZomboMeme_30072021185835.png`,
    `https://cdn.discordapp.com/attachments/870779326633758770/870780819818549348/boop4.gif`,
    `https://cdn.discordapp.com/attachments/870779326633758770/870780824356810782/boop3.gif`,
    `https://cdn.discordapp.com/attachments/870779326633758770/870780824453275668/boop2.gif`,
    'https://cdn.discordapp.com/attachments/870779326633758770/870781769404805250/boop6.gif',
    `https://cdn.discordapp.com/attachments/870779326633758770/870781776950337546/boop5.gif`,
    `https://cdn.discordapp.com/attachments/870779326633758770/870782810829508668/boop7.gif`
];

var var_eee_gif = [
    `https://cdn.discordapp.com/attachments/870779509782237194/870785156833755147/eee2.gif`,
    `https://cdn.discordapp.com/attachments/870779509782237194/870780975603400714/eee1.gif`,
    `https://cdn.discordapp.com/attachments/870779509782237194/876846233489113118/eee3.gif`
];

var var_hug_gif = [
    `https://cdn.discordapp.com/attachments/871281736254881833/871281789048586300/hug1.gif`,
    `https://cdn.discordapp.com/attachments/871281736254881833/871287217174249483/hug2.gif`,
	`https://cdn.discordapp.com/attachments/871281736254881833/961948318068506624/hug3.gif`,
	`https://cdn.discordapp.com/attachments/871281736254881833/961948426680029184/hug4.gif`,
	`https://cdn.discordapp.com/attachments/871281736254881833/961948698802266162/hug5.gif`,
	`https://cdn.discordapp.com/attachments/871281736254881833/961948707996192818/hug6.gif`,
	`https://cdn.discordapp.com/attachments/871281736254881833/961948730234380329/hug7.gif`,
	`https://cdn.discordapp.com/attachments/871281736254881833/961948742137823262/hug8.gif`
];

var var_kiss_gif = [
    `https://cdn.discordapp.com/attachments/901780360201908234/901783358785351680/zq2kWtH.gif`,
    `https://cdn.discordapp.com/attachments/901780360201908234/901783355484430387/34O6w1J.gif`
];

var var_lick_gif = [
    `https://cdn.discordapp.com/attachments/870779414785429524/870780897216069642/lick3.gif`,
    `https://cdn.discordapp.com/attachments/870779414785429524/870780897161523200/lick2.gif`,
    `https://cdn.discordapp.com/attachments/870779414785429524/870780901829775461/lick1.gif`,
    `https://cdn.discordapp.com/attachments/870779414785429524/870780912445583420/lick4.gif`
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('r')
        .setDescription('Сделать рп действие')
        .addStringOption(option =>
            option
                .setName('target')
                .setDescription('Выберите действие')
                .setRequired(true)
                .addChoice('Bite', 'bite')
                .addChoice('Boop', 'boop')
                .addChoice('Eee', 'eee')
                .addChoice('Hug', 'hug')
                .addChoice('Kiss', 'kiss')
                .addChoice('Lick', 'lick'))
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('С кем взаимодействуем?')
                .setRequired(true)),
    async execute(interaction) {
        rolecolor = "#2C2E33";
        const rp_id = interaction.options.getString('target');
        const user = interaction.options.getUser('user');
        if (rp_id == "bite") {
            RandElement = var_bite_gif[Math.floor(Math.random() * (var_bite_gif.length))];
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(`${rolecolor}`)
                .setImage(`${RandElement}`);
            await interaction.reply({ content: `<@${interaction.member.id}> сделал(-а) кусь <@${user.id}>`, embeds: [exampleEmbed] });
            return;
        } else if (rp_id == "boop") {
            RandElement = var_boop_gif[Math.floor(Math.random() * (var_boop_gif.length))];
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(`${rolecolor}`)
                .setImage(`${RandElement}`);
            await interaction.reply({ content: `<@${interaction.member.id}> сделал(-а) буп <@${user.id}>`, embeds: [exampleEmbed] });
            return;
        } else if (rp_id == "eee") {
            RandElement = var_eee_gif[Math.floor(Math.random() * (var_eee_gif.length))];
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(`${rolecolor}`)
                .setImage(`${RandElement}`);
            await interaction.reply({ content: `<@${interaction.member.id}> запищал(-а) на <@${user.id}>`, embeds: [exampleEmbed] });
            return;
        } else if (rp_id == "hug") {
            RandElement = var_hug_gif[Math.floor(Math.random() * (var_hug_gif.length))];
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(`${rolecolor}`)
                .setImage(`${RandElement}`);
            await interaction.reply({ content: `<@${interaction.member.id}> обнял(-а) <@${user.id}>`, embeds: [exampleEmbed] });
            return;
        } else if (rp_id == "kiss") {
            RandElement = var_kiss_gif[Math.floor(Math.random() * (var_kiss_gif.length))];
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(`${rolecolor}`)
                .setImage(`${RandElement}`);
            await interaction.reply({ content: `<@${interaction.member.id}> поцеловал(-а) <@${user.id}>`, embeds: [exampleEmbed] });
            return;
        } else if (rp_id == "lick") {
            RandElement = var_lick_gif[Math.floor(Math.random() * (var_lick_gif.length))];
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor(`${rolecolor}`)
                .setImage(`${RandElement}`);
            await interaction.reply({ content: `<@${interaction.member.id}> сделал(-а) лизь <@${user.id}>`, embeds: [exampleEmbed] });
            return;
        }
    },
};