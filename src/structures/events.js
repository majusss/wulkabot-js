const process = require("node:process");
const { readdirSync } = require("node:fs");

module.exports = {
  async execute(client) {
    const PATH = process.cwd() + "/src/events";
    const events = readdirSync(PATH);
    for (let event of events) {
      event = event.split(".")[0];
      client.on(event, async (...args) => {
        await require(`${PATH}/${event}.js`).execute(...args);
      });
    }
  },
};
