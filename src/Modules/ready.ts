import * as ModulesImports from './@ModulesImports';

export { startDate, readyDate, execute };

const Libs = ModulesImports.LibsExports;
//const DB_Config = new Libs.DB_Config();

const startDate = new Date();
let readyDate = new Date();

//DB_Config.getBotConfig().then(config => {
//    config['startTime']['value'] = Date.now() - startDate.getTime();
//    config['starts']['value']++;
//    DB_Config.setBotConfig(config);
//});
//
async function execute() {
//    readyDate = new Date();
//    DB_Config.getBotConfig().then(config => {
//        config['readyTime']['value'] = readyDate.getTime() - startDate.getTime();
//        DB_Config.setBotConfig(config);
//    });
};