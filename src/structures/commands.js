const process = require("node:process");
const { readdirSync } = require("node:fs");

module.exports = {
  async execute(client) {
    const commands = client.commands;
    const PATH = process.cwd() + "/src/commands";

    const folders = readdirSync(PATH);
    for (let dir of folders) {
      const folder = readdirSync(`${PATH}/${dir}`);

      for (let file of folder) {
        try {
          const cmd = await require(`${PATH}/${dir}/${file}`);
          commands.set(cmd.data.name, cmd);
        } catch (error) {
          console.log(`error loading command from ${file}`);
          console.log(error);
        }
      }
    }
  },
};
