import * as DiscordJS from 'discord.js';
import * as SrcImports from './@SrcImports';


export {
    Client,
    REST,
};


/* распаковка модулей */


const InteractionsExports = SrcImports.InteractionsExports;
const ModulesExports = SrcImports.ModulesExports;
const LibsExports = SrcImports.LibsExports;
const SrcExports = SrcImports.SrcExports;


/* константы и переменные */


//const DB_Config = new LibsExports.DB_Config();
const REST = new DiscordJS.REST({ version: '10' }).setToken(SrcExports.Config.token);
const Client = new DiscordJS.Client({
    intents: [
        DiscordJS.GatewayIntentBits.AutoModerationConfiguration,
        DiscordJS.GatewayIntentBits.AutoModerationExecution,
        DiscordJS.GatewayIntentBits.DirectMessageReactions,
        DiscordJS.GatewayIntentBits.DirectMessageTyping,
        DiscordJS.GatewayIntentBits.DirectMessages,
        DiscordJS.GatewayIntentBits.GuildEmojisAndStickers,
        DiscordJS.GatewayIntentBits.GuildIntegrations,
        DiscordJS.GatewayIntentBits.GuildInvites,
        DiscordJS.GatewayIntentBits.GuildMembers,
        DiscordJS.GatewayIntentBits.GuildMessageReactions,
        DiscordJS.GatewayIntentBits.GuildMessageTyping,
        DiscordJS.GatewayIntentBits.GuildMessages,
        DiscordJS.GatewayIntentBits.GuildModeration,
        DiscordJS.GatewayIntentBits.GuildPresences,
        DiscordJS.GatewayIntentBits.GuildScheduledEvents,
        DiscordJS.GatewayIntentBits.GuildVoiceStates,
        DiscordJS.GatewayIntentBits.GuildWebhooks,
        DiscordJS.GatewayIntentBits.Guilds,
        DiscordJS.GatewayIntentBits.MessageContent
    ]
});


/* ивенты клиента */


Client.once(DiscordJS.Events.ClientReady, async () => {
    Object.values(ModulesExports).forEach(module => { if (module.execute) module.execute(); });

    await REST.put(DiscordJS.Routes.applicationCommands(Client.user.id), {
        body: (function () {
            const interactionsData = [];
            Object.values(InteractionsExports).forEach(interaction => interactionsData.push(interaction.data.toJSON()));
            return interactionsData;
        })()
    });

    //const botConfig = await DB_Config.getBotConfig();

    //console.log(
    //    `Запущен за ${botConfig['readyTime']['value']
    //    }ms в ${botConfig['starts']['value']
    //    } раз!`
    //);
});

Client.on(DiscordJS.Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
        const command = Object.values(InteractionsExports).filter(c => c.data.name == interaction.commandName).shift();
        if (!command) return;
        if (interaction.isAutocomplete() && command['autocomplete']) {
            await command['autocomplete'](interaction);
        };
        if (interaction.isChatInputCommand() && command['execute']) {
            await command['execute'](interaction);
        };
    };
    if (interaction.isModalSubmit()) {
        const command = Object.values(InteractionsExports).filter(c => c.data.name == interaction.customId).shift();
        if (!command) return;
        if (interaction.isModalSubmit() && command['modal']) {
            await command['modal'](interaction);
        };
    };
});

Client.login(SrcExports.Config.token);