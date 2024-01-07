const { REST, Routes } = require("discord.js");
const process = require("node:process");

module.exports = {
  async execute(client) {
    const { DISCORD_TOKEN, CLIENT_ID } = process.env;
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

    // rest
    //   .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
    //   .then(() => console.log("Successfully deleted all application commands."))
    //   .catch(console.error);

    client.commands.forEach(async (command) => {
      await rest.post(Routes.applicationCommands(CLIENT_ID), {
        body: command.data,
      });
    });
  },
};
