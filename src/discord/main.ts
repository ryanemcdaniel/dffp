import {Client, Events, GatewayIntentBits, Message} from "discord.js";

const DISCORD_ACCESS_TOKEN = '';

class SerenityApplication {
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            failIfNotExists: false,
        });
    }

    startBot() {
        this.client
            .login(DISCORD_ACCESS_TOKEN)
            .then(() => {
                this.addClientEventHandlers();
            })
            .catch((err) => {
                console.error("Error starting bot", err);
            });
    }

    addClientEventHandlers() {
        this.client.on(Events.MessageCreate, (message: Message) => {
            const { content } = message;
            message.reply(`DEEP FRIED: ${content}`);
        });

        this.client.on(Events.ClientReady, () => {
            console.log("DEEP FRIED client logged in");
        });

        this.client.on(Events.Error, (err: Error) => {
            console.error("Client error", err);
        });
    }
}

const app = new SerenityApplication();
app.startBot();