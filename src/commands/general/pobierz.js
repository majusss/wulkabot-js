const GitHub = require("../../utils/github");
const {
  WulkanowyManager,
  WulkanowyBuild,
} = require("../../utils/wulkanowy_manager");
const { EmbedBuilder } = require("discord.js");

const github = new GitHub();
const wulkanowy_manager = new WulkanowyManager();

const OTHER_DOWNLOADS = [
  "[Google Play](https://play.google.com/store/apps/details?id=io.github.wulkanowy)",
  "[GitHub](https://github.com/wulkanowy/wulkanowy/releases)",
  "[F-Droid](https://f-droid.org/en/packages/io.github.wulkanowy)",
  "[AppGallery](https://appgallery.huawei.com/app/C101440411)",
  `<#898126463134490664>`,
].join(" | ");

module.exports = {
  data: {
    name: "pobierz",
    description: "Najnowsza wersja aplikacji",
    dm_permissions: "0",
  },
  async execute(interaction) {
    await interaction.deferReply();
    const id = setTimeout(() => {
      interaction.editReply({ content: "request timed out" });
    }, 15000);

    const release = await github.fetchLatestRelease("wulkanowy", "wulkanowy");
    const downloadUrls = release.assets
      .map((asset) => `[${asset.name}](${asset.browser_download_url})`)
      .join("\n");

    const pulls = await github.fetchOpenPulls("wulkanowy", "wulkanowy");
    const branches = ["develop", ...pulls.map((pull) => pull.head.ref)];
    const deduplicatedBranches = Array.from(new Set(branches));
    const builds = await Promise.allSettled(
      deduplicatedBranches.map((branch) =>
        wulkanowy_manager.fetchBranchBuild(branch),
      ),
    );

    const lines = deduplicatedBranches
      .map((branch, index) => {
        const build = builds[index];
        if (
          build.status === "fulfilled" &&
          build.value instanceof WulkanowyBuild
        ) {
          return `\`${build.value.build_number}\` - [${branch}](${build.value.download_url})`;
        }
        return null;
      })
      .filter((line) => line !== null)
      .join("\n");

    const text = [
      `**Najnowsza wersja ${release.name}**`,
      downloadUrls,
      "",
      "**Wersje testowe**",
      lines,
      "",
      "**Inne źródła**",
      OTHER_DOWNLOADS,
    ].join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Pobierz Wulkanowego!")
      .setDescription(text)
      .setColor("#d32f2f");

    clearTimeout(id);
    await interaction.editReply({ embeds: [embed] });
  },
};
