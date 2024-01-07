const { EmbedBuilder } = require("discord.js");
const GitHub = require("../utils/github");

const github = new GitHub();

module.exports = {
  async execute(interaction) {
    if (interaction.author.bot) return;

    const regex = /[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+/g;
    const results = regex.exec(interaction.content);
    if (!results[0]) return;
    const [owner, repo] = results[0].split("/");

    try {
      const data = await github.fetchRepo(owner, repo);

      console.log(data);

      const embed = new EmbedBuilder()
        .setTitle(data.full_name)
        .setURL(data.html_url)
        .setDescription(data.description)
        .setAuthor({
          name: data.owner.login,
          iconURL: data.owner.avatar_url,
          url: data.owner.html_url,
        })
        .setFooter({
          text: `⭐ ${data.stargazers_count} 🍴 ${data.forks_count} 👀 ${data.watchers_count}`,
        });
      interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(e);
    }
  },
};
