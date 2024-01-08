const { EmbedBuilder } = require("discord.js");
const { checkAll } = require("../../utils/vulcan_status");
module.exports = {
  data: {
    name: "status",
    description: "Sprawdź status dziennika",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction) {
    await interaction.deferReply();
    const id = setTimeout(() => {
      interaction.editReply({ content: "request timed out" });
    }, 15000);

    const status = await checkAll();
    const ok = [];
    const errors = [];

    for (const [domain, result] of status) {
      let icon;
      console.log(domain, result);
      switch (result.state) {
        case 0:
          ok.push(domain);
          continue;
        case 1:
          icon = "🔄";
          break;
        case 2:
          icon = "⚠️";
          break;
        case 3:
          icon = "‼️";
          break;
        case 4:
          icon = "⌛";
          break;
        default:
          icon = "❓";
          break;
      }

      errors.push(`${icon} ${domain}: ${result.message || result.status_code}`);
    }

    const error_text = errors.length
      ? errors.join("\n")
      : "🟢 Wszystko działa!";
    const ok_text = ok.length
      ? ok.map((ok) => `✅ ${ok}`).join("\n")
      : "🔥 Nic nie działa";

    const embed = new EmbedBuilder()
      .setTitle("Status dziennika")
      .setColor("#d32f2f")
      .setFields(
        { name: "Błędy", value: " " + error_text },
        { name: "Działające usługi", value: " " + ok_text },
      );

    clearTimeout(id);
    await interaction.followUp({ embeds: [embed] });
  },
};
