const { EmbedBuilder } = require("discord.js");
const GitHub = require("../utils/github");

const github = new GitHub();
const defaultOwner = "wulkanowy";

module.exports = {
  async execute(interaction) {
    if (interaction.author.bot) return;
    const sendRepoInfo = async (results) => {
      try {
        const [owner, repo] = results[0].split("/");
        const data = await github.fetchRepo(owner, repo);

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
          })
          .setColor(
            data.language
              ? (await github.colors)[data.language].color
              : "#d32f2f",
          );

        return embed;
      } catch (e) {
        console.log(e);
      }
    };

    const sendIssueInfo = async (repo, issueNumber) => {
      try {
        const data = await github.fetchIssue(defaultOwner, repo, issueNumber);

        const isPullRequest = "pull_request" in data;
        let color;

        if (data.state === "open") {
          color = 0x2da44e;
        } else if (data.state === "closed") {
          color = 0xcf222e;
        }

        if (isPullRequest) {
          const pullRequest = data.pull_request;

          if (pullRequest.merged_at !== null) {
            color = 0x8250df;
          } else if (data.draft) {
            color = 0x6e7781;
          }
        }

        const embed = new EmbedBuilder()
          .setTitle(
            (isPullRequest ? "Pull request" : "Issue") +
              `#${issueNumber}\n` +
              data.title,
          )
          .setURL(data.html_url)
          .setDescription(
            data.body.length > 0 && data.body?.length < 256
              ? data.body
              : data.state === "closed"
              ? "🔒 Closed"
              : "🔓 Open",
          )
          .setAuthor({
            name: data.user.login,
            iconURL: data.user.avatar_url,
            url: data.user.html_url,
          })
          .setFooter({
            text: `💬 ${data.comments}`,
          })
          .setColor(color);

        return embed;
      } catch (e) {
        console.log(e);
      }
    };

    const regexRepo = /[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+/g;
    const resultsRepo = regexRepo.exec(interaction.content);
    if (resultsRepo?.length) {
      return interaction.reply({ embeds: [await sendRepoInfo(resultsRepo)] });
    }
    const regexRepoIssue = /[a-zA-Z0-9-_.]+#[0-9]+/g;
    const resultsRepoIssue = regexRepoIssue.exec(interaction.content);
    if (resultsRepoIssue?.length) {
      return interaction.reply({
        embeds: [
          await sendIssueInfo(
            resultsRepoIssue[0].split("#")[0],
            resultsRepoIssue[0].split("#")[1],
          ),
        ],
      });
    }
    const regexIssue = /(?<=#)([0-9]+)/g;
    const resultsIssue = regexIssue.exec(interaction.content);
    if (resultsIssue?.length) {
      return interaction.reply({
        embeds: [await sendIssueInfo(defaultOwner, resultsIssue)],
      });
    }
  },
};
