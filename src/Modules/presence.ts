import * as DiscordJS from 'discord.js';
import * as ModulesImports from './@ModulesImports';

export { execute };

const ModulesExports = ModulesImports.ModulesExports;
const LibsExports = ModulesImports.LibsExports;
const SrcExports = ModulesImports.SrcExports;

//const Tools = LibsExports.Tools;
//const DB_Config = new LibsExports.DB_Config();
//
async function execute() {
//    const { startDate } = ModulesExports.Ready;
//
//    async function update() {
//        const { Client } = SrcExports.Index;
//
//        const workTime = Tools.getTime(Tools.workTime(startDate).getTime());
//        const botConfig = await DB_Config.getBotConfig();
//
//        Client.user.setPresence({
//            activities: [{
//                name: [
//                    `${workTime.months}/${workTime.days} ${workTime.hours}:${workTime.minutes} work time;`,
//                    `${botConfig['starts']['value']} starts;`,
//                    `${botConfig['startTime']['value']} ms last start;`,
//                    `${Client.guilds.cache.size} guilds;`,
//                    `${Tools.totalMemberCount(Client)} members;`,
//                ].reduce((sum, item) => sum + ' ' + item),
//                type: DiscordJS.ActivityType.Listening, url: 'https://www.twitch.tv//'
//            }]
//        });
//        setTimeout(() => { update(); }, 60000);
//    };
//    update();
};