const Discord = require('discord.js');
const { MessageButton, MessageActionRow, MessageEmbed, Collector } = require('discord.js')

module.exports = {
    commandName: 'clicker',
    name: 'messageCreate',
    execute(message) {
        function convertTime(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            if (sec < 10) { sec = '0' + sec };
            if (min < 10) { min = '0' + min };
            if (hour < 10) { hour = '0' + hour };
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
            return time;
        }
        function randomInteger(min, max) {
            // случайное число от min до (max+1)
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }
        function normalNumber(numb) {
            return numb.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        Number.prototype.noExponents = function () {
            var data = String(this).split(/[eE]/);
            if (data.length == 1) return data[0];

            var z = '',
                sign = this < 0 ? '-' : '',
                str = data[0].replace('.', ''),
                mag = Number(data[1]) + 1;

            if (mag < 0) {
                z = sign + '0.';
                while (mag++) z += '0';
                return z + str.replace(/^\-/, '');
            }
            mag -= str.length;
            while (mag--) z += '0';
            return str + z;
        }

        let trigger = '!'
        if (message.content.substring(0, 1) == trigger) {
            const client = MYAPP.botClient;
            const fs = MYAPP.botFs;
            var lastBotMes
            var lastMes
            var lastAuthor
            var varUpgrades = 0;
            var numberClick = 0;
            var clickMultiplier = 1;
            var server = message.guild.id;
            var channel = message.channel.id;
            var user = message.author.id;
            try {
                fs.accessSync(`./data/clicker/servers/${server}`, fs.constants.F_OK)
            } catch (err) {
                fs.mkdirSync(`./data/clicker/servers/${server}`)
                fs.mkdirSync(`./data/clicker/servers/${server}/users`)
                fs.mkdirSync(`./data/clicker/servers/${server}/users/${user}`)
            }
            try {
                fs.accessSync(`./data/clicker/servers/${server}/users`, fs.constants.F_OK)
            } catch (err) {
                fs.mkdirSync(`./data/clicker/servers/${server}/users`)
            }
            try {
                fs.accessSync(`./data/clicker/servers/${server}/users/${user}`, fs.constants.F_OK)
            } catch (err) {
                fs.mkdirSync(`./data/clicker/servers/${server}/users/${user}`)
            }
            if (message.content.toLowerCase() == `${trigger}startclicker` || message.content.toLowerCase() == `${trigger}sc`) {
                try {
                    fs.statSync(`./data/clicker/servers/${server}/users/${user}/info.json`)
                    //fs.statSync(`./data/clicker/servers/${server}/leaderboardMultiplier.json`)
                    info = JSON.parse(fs.readFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`));
                    //leaderboardMultiplier = JSON.parse(fs.readFileSync(`./data/clicker/servers/${server}/leaderboardMultiplier.json`));
                } catch (err) {
                    info = {
                        upgrades: {
                            click_Multiplier: {
                                multiplier: 1,
                                price: randomInteger(25, 50),
                            },
                            standart_Multiplier: {
                                multiplier: 2,
                                price: randomInteger(25, 50),
                            },
                        },
                        money: 0,
                        last_Upgrade: `${Date.now()}`.substring(0, 10),
                        last_Click: `${Date.now()}`.substring(0, 10),
                        last_Bonus: `${Date.now()}`.substring(0, 10),
                    };
                    /*leaderboardMultiplier = {
                        user1: {
                            multiplier: '',
                            id: '',
                        },
                        user2: {
                            multiplier: '',
                            id: '',
                        },
                        user3: {
                            multiplier: '',
                            id: '',
                        },
                        user4: {
                            multiplier: '',
                            id: '',
                        },
                        user5: {
                            multiplier: '',
                            id: '',
                        },
                        user6: {
                            multiplier: '',
                            id: '',
                        },
                        user7: {
                            multiplier: '',
                            id: '',
                        },
                        user8: {
                            multiplier: '',
                            id: '',
                        },
                        user9: {
                            multiplier: '',
                            id: '',
                        },
                        user10: {
                            multiplier: '',
                            id: '',
                        },
                    };*/
                    fs.writeFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`, JSON.stringify(info));
                    //fs.writeFileSync(`./data/clicker/servers/${server}/leaderboardMultiplier.json`, JSON.stringify(leaderboardMultiplier));
                    info = JSON.parse(fs.readFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`));
                    //leaderboardMultiplier = JSON.parse(fs.readFileSync(`./data/clicker/servers/${server}/leaderboardMultiplier.json`));
                }
                /*
                click = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('click')
                            .setLabel('CLICK!')
                            .setStyle('DANGER'),
                    );
                    */
                message.reply({
                    content: `<@${user}> **Это сообщение будет автоматически удалено через час**`,
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle('Clicker')
                            .addFields(
                                { name: 'Кликов за сеанс:', value: `🖱️ ${normalNumber(numberClick.toString())}` },
                                { name: 'Улучшений за сеанс:', value: `📈 ${normalNumber(varUpgrades.toString())}` },
                                { name: `Множитель кликов: (🖱️x${info.upgrades.click_Multiplier.multiplier}) (🧮x${info.upgrades.standart_Multiplier.multiplier})`, value: `🧮 ${normalNumber((info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier).toString())}` },
                                { name: 'Монеты:', value: `💰 ${normalNumber(info.money.toString())}` },
                                { name: 'Последнее улучшение:', value: `⏱️ ${convertTime(info.last_Upgrade)}` },
                                { name: 'Последний клик:', value: `⏱️ ${convertTime(info.last_Click)}` },
                                { name: 'Последний бонус:', value: `⏱️ ${convertTime(info.last_Bonus)}` },
                            )
                            .setImage('https://cdn.discordapp.com/attachments/870792177830207508/973155024257568798/4363421521535.png')
                            .setFooter({ text: 'Каждые ~5 секунд можно прожать 1 эмодзи' })
                    ]
                }).then(m => {
                    message.delete();
                    /*
                    setTimeout(() => {
                        m.delete().catch();
                    }, 5000)
                    */
                    filter = (reaction, user) => {
                        return ['🖱️', '🪙', '🎁'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    awReact();
                    function awReact() {
                        m.react('🖱️')
                        m.react('🪙')
                        m.react('🎁')
                        //m.react('📜')
                        m.awaitReactions({ filter, max: 1 })
                            .then(collected => {
                                const reaction = collected.first();
                                info = JSON.parse(fs.readFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`));
                                leaderboardMultiplier = JSON.parse(fs.readFileSync(`./data/clicker/servers/${server}/leaderboardMultiplier.json`));
                                var awRes = setTimeout(function () {
                                    awReact();
                                    m.reactions.cache.forEach(e => e.users.remove(message.author.id));
                                }, 1000)
                                if (reaction.emoji.name === '🖱️') {
                                    numberClick++
                                    info = {
                                        upgrades: {
                                            click_Multiplier: {
                                                multiplier: info.upgrades.click_Multiplier.multiplier,
                                                price: info.upgrades.click_Multiplier.price,
                                            },
                                            standart_Multiplier: {
                                                multiplier: info.upgrades.standart_Multiplier.multiplier,
                                                price: info.upgrades.standart_Multiplier.price,
                                            },
                                        },
                                        money: info.money += info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier,
                                        last_Upgrade: info.last_Upgrade,
                                        last_Click: `${Date.now()}`.substring(0, 10),
                                        last_Bonus: info.last_Bonus,
                                    };
                                    fs.writeFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`, JSON.stringify(info));
                                    m.edit({
                                        content: `<@${user}>`,
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle('Clicker')
                                                .addFields(
                                                    { name: 'Кликов за сеанс:', value: `🖱️ ${normalNumber(numberClick.toString())}` },
                                                    { name: 'Улучшений за сеанс:', value: `📈 ${normalNumber(varUpgrades.toString())}` },
                                                    { name: `Множитель кликов: (🖱️x${info.upgrades.click_Multiplier.multiplier})*(🧮x${info.upgrades.standart_Multiplier.multiplier})`, value: `🧮 ${normalNumber((info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier).toString())}` },
                                                    { name: 'Монеты:', value: `💰 ${normalNumber(info.money.toString())}` },
                                                    { name: 'Последнее улучшение:', value: `⏱️ ${convertTime(info.last_Upgrade)}` },
                                                    { name: 'Последний клик:', value: `⏱️ ${convertTime(info.last_Click)}` },
                                                    { name: 'Последний бонус:', value: `⏱️ ${convertTime(info.last_Bonus)}` },
                                                )
                                                .setImage('https://cdn.discordapp.com/attachments/870792177830207508/973155024257568798/4363421521535.png')
                                                .setFooter({ text: 'Каждые ~5 секунд можно прожать 1 эмодзи' })
                                        ]
                                    })
                                    awRes;
                                }
                                if (reaction.emoji.name === '🪙') {
                                    m.edit({
                                        content: `<@${user}>`,
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle('Shop')
                                                .addFields(
                                                    { name: `Множитель кликов: (🖱️x${info.upgrades.click_Multiplier.multiplier})*(🧮x${info.upgrades.standart_Multiplier.multiplier})`, value: `🧮 ${normalNumber((info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier).toString())}` },
                                                    { name: 'Монеты:', value: `💰 ${normalNumber(info.money.toString())}` },
                                                    { name: '1) 🖱️+1', value: `Цена: ${normalNumber(info.upgrades.click_Multiplier.price.toString())}`, inline: true },
                                                    { name: '2) 🧮+2', value: `Цена: ${normalNumber(info.upgrades.standart_Multiplier.price.toString())}`, inline: true },
                                                )
                                                .setImage('https://cdn.discordapp.com/attachments/870792177830207508/973155024257568798/4363421521535.png')
                                                .setFooter({ text: 'Напишите в чат номер и количество улучшений (пример: "2 1000")' })
                                        ]
                                    })
                                    checkBying();
                                    function checkBying() {
                                        m.channel.awaitMessages({ max: 1 })
                                            .then(collected => {
                                                if (collected.first().author.id == user) {
                                                    if (collected.first().content.toLowerCase().substring(0, 1) == '1') {
                                                        try {
                                                            u = Number(collected.first().content.toLowerCase().substring(2))
                                                            if (typeof u != Number) {
                                                                u = 1
                                                            }
                                                        } catch {
                                                            u = 1
                                                        }
                                                        if (u > 1000) {
                                                            u = 1000
                                                        }
                                                        for (let i = 0; i < u; i++) {
                                                            if (info.money >= info.upgrades.click_Multiplier.price) {
                                                                varUpgrades++
                                                                info = {
                                                                    upgrades: {
                                                                        click_Multiplier: {
                                                                            multiplier: info.upgrades.click_Multiplier.multiplier += 1,
                                                                            price: (info.upgrades.click_Multiplier.price * 1.2).toFixed(0),
                                                                        },
                                                                        standart_Multiplier: {
                                                                            multiplier: info.upgrades.standart_Multiplier.multiplier,
                                                                            price: info.upgrades.standart_Multiplier.price,
                                                                        },
                                                                    },
                                                                    money: info.money - info.upgrades.click_Multiplier.price,
                                                                    last_Upgrade: `${Date.now()}`.substring(0, 10),
                                                                    last_Click: info.last_Click,
                                                                    last_Bonus: info.last_Bonus,
                                                                };
                                                            }
                                                        }
                                                        fs.writeFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`, JSON.stringify(info));
                                                        collected.first().delete();
                                                        awRes;
                                                    }
                                                    if (collected.first().content.toLowerCase().substring(0, 1) == '2') {
                                                        try {
                                                            u = Number(collected.first().content.toLowerCase().substring(2))
                                                            /*if (typeof u != Number) {
                                                                u = 1
                                                            }*/
                                                        } catch {
                                                            u = 1
                                                        }
                                                        if (u > 1000) {
                                                            u = 1000
                                                        }
                                                        for (let i = 0; i < u; i++) {
                                                            if (info.money >= info.upgrades.click_Multiplier.price) {
                                                                varUpgrades++
                                                                info = {
                                                                    upgrades: {
                                                                        click_Multiplier: {
                                                                            multiplier: info.upgrades.click_Multiplier.multiplier,
                                                                            price: info.upgrades.click_Multiplier.price,
                                                                        },
                                                                        standart_Multiplier: {
                                                                            multiplier: info.upgrades.standart_Multiplier.multiplier += 2,
                                                                            price: (info.upgrades.standart_Multiplier.price * 1.4).toFixed(0),
                                                                        },
                                                                    },
                                                                    money: info.money - info.upgrades.standart_Multiplier.price,
                                                                    last_Upgrade: `${Date.now()}`.substring(0, 10),
                                                                    last_Click: info.last_Click,
                                                                    last_Bonus: info.last_Bonus,
                                                                };
                                                            }
                                                        }
                                                        fs.writeFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`, JSON.stringify(info));
                                                        collected.first().delete();
                                                        awRes;
                                                    }
                                                    m.edit({
                                                        content: `<@${user}>`,
                                                        embeds: [
                                                            new Discord.MessageEmbed()
                                                                .setTitle('Shop')
                                                                .addFields(
                                                                    { name: `Множитель кликов: (🖱️x${info.upgrades.click_Multiplier.multiplier})*(🧮x${info.upgrades.standart_Multiplier.multiplier})`, value: `🧮 ${normalNumber((info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier).toString())}` },
                                                                    { name: 'Монеты:', value: `💰 ${normalNumber(info.money.toString())}` },
                                                                    { name: '1) 🖱️+1', value: `Цена: ${normalNumber(info.upgrades.click_Multiplier.price.toString())}`, inline: true },
                                                                    { name: '2) 🧮+2', value: `Цена: ${normalNumber(info.upgrades.standart_Multiplier.price.toString())}`, inline: true },
                                                                )
                                                                .setImage('https://cdn.discordapp.com/attachments/870792177830207508/973155024257568798/4363421521535.png')
                                                                .setFooter({ text: 'Напишите в чат номер и количество улучшений (пример: "2 1000")' })
                                                        ]
                                                    })
                                                }
                                                else {
                                                    checkBying();
                                                }
                                            })
                                    }
                                }
                                if (reaction.emoji.name === '🎁') {
                                    if ((`${Date.now()}`.substring(0, 10) - info.last_Bonus) > 10000) {
                                        info = {
                                            upgrades: {
                                                click_Multiplier: {
                                                    multiplier: info.upgrades.click_Multiplier.multiplier,
                                                    price: info.upgrades.click_Multiplier.price,
                                                },
                                                standart_Multiplier: {
                                                    multiplier: info.upgrades.standart_Multiplier.multiplier,
                                                    price: info.upgrades.standart_Multiplier.price,
                                                },
                                            },
                                            money: info.money += ((((`${Date.now()}`.substring(0, 10) - info.last_Click) / 10) * (info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier)) * 0.5).toFixed(0),
                                            last_Upgrade: info.last_Upgrade,
                                            last_Click: info.last_Click,
                                            last_Bonus: `${Date.now()}`.substring(0, 10),
                                        };
                                        fs.writeFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`, JSON.stringify(info));
                                        m.edit({
                                            content: `<@${user}>`,
                                            embeds: [
                                                new Discord.MessageEmbed()
                                                    .setTitle('Clicker')
                                                    .addFields(
                                                        { name: 'Кликов за сеанс:', value: `🖱️ ${normalNumber(numberClick.toString())}` },
                                                        { name: 'Улучшений за сеанс:', value: `📈 ${normalNumber(varUpgrades.toString())}` },
                                                        { name: `Множитель кликов: (🖱️x${info.upgrades.click_Multiplier.multiplier})*(🧮x${info.upgrades.standart_Multiplier.multiplier})`, value: `🧮 ${normalNumber((info.upgrades.click_Multiplier.multiplier * info.upgrades.standart_Multiplier.multiplier).toString())}` },
                                                        { name: 'Монеты:', value: `💰 ${normalNumber(info.money.toString())}` },
                                                        { name: 'Последнее улучшение:', value: `⏱️ ${convertTime(info.last_Upgrade)}` },
                                                        { name: 'Последний клик:', value: `⏱️ ${convertTime(info.last_Click)}` },
                                                        { name: 'Последний бонус:', value: `⏱️ ${convertTime(info.last_Bonus)}` },
                                                    )
                                                    .setImage('https://cdn.discordapp.com/attachments/870792177830207508/973155024257568798/4363421521535.png')
                                                    .setFooter({ text: 'Каждые ~10 минут можно получить 1 бонус' })
                                            ]
                                        })
                                    }
                                    awRes;
                                }
                                /*
                                if (reaction.emoji.name === '📜') {
                                    for (let i = 1; i <= 10; i++) {
                                        if (leaderboardMultiplier.user[i].id != '---') {
                                            if (leaderboardMultiplier.user[i].multiplier > info.upgrades.standart_Multiplier.multiplier) {
                                                leaderboardMultiplier = {
                                                    user1: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user2: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user3: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user4: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user5: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user6: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user7: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user8: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user9: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                    user10: {
                                                        multiplier: '',
                                                        id: '',
                                                    },
                                                };
                                                fs.writeFileSync(`./data/clicker/servers/${server}/leaderboardMultiplier.json`, JSON.stringify(leaderboardMultiplier));
                                            }
                                        }
                                    }
                                    m.edit({
                                        content: `<@${user}>`,
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle('Multiplier leaderboard')
                                                .addFields(
                                                    { name: `${info.upgrades.standart_Multiplier.multiplier}`, value: `${normalNumber(info.money.toString())}` },
                                                )
                                                .setImage('https://cdn.discordapp.com/attachments/870792177830207508/973155024257568798/4363421521535.png')
                                                .setFooter({ text: 'Напишите в чат номер фильтра' })
                                        ]
                                    })
                                }
                                */
                            })
                            .catch(error => console.log(error));
                    }
                })
            }
            if (message.content.toLowerCase() == `${trigger}resetclicker` || message.content.toLowerCase() == `${trigger}rc`) {
                info = {
                    upgrades: {
                        click_Multiplier: {
                            multiplier: 1,
                            price: randomInteger(25, 50),
                        },
                        standart_Multiplier: {
                            multiplier: 2,
                            price: randomInteger(25, 50),
                        },
                    },
                    money: 0,
                    last_Upgrade: `${Date.now()}`.substring(0, 10),
                    last_Click: `${Date.now()}`.substring(0, 10),
                    last_Bonus: `${Date.now()}`.substring(0, 10),
                };
                fs.writeFileSync(`./data/clicker/servers/${server}/users/${user}/info.json`, JSON.stringify(info));
            }
        }
        return;
    }
}
