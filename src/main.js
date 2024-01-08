const { Client, GatewayIntentBits, Collection } = require("discord.js");
const GitHub = require("./utils/github.js");
const process = require("node:process");

const github = new GitHub();

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

try {
  (async () => {
    console.log("loading commands...");
    await require("./structures/commands.js").execute(client);
    console.log("loading handler...");
    await require("./structures/handler.js").execute(client);
    console.log("loading events...");
    const latestRelease =
      (await github.fetchLatestRelease("wulkanowy", "wulkanowy")) || "1";
    await require("./structures/events.js").execute(client);
    await client.login(process.env.DISCORD_TOKEN);
    client.user.setPresence({
      status: "dnd",
      activities: [
        {
          name: `Wulkanowy v${latestRelease.tag_name} 🌋`,
          type: 3,
        },
      ],
    });
  })();
} catch (err) {
  client.shutdown(`An error occurred while connecting to Discord:`, err);
}
