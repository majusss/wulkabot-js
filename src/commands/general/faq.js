const faqData = require("../../resources/faq.json");

module.exports = {
  data: {
    name: "faq",
    description: "Często zadawane pytania",
    default_member_permissions: "0",
    dm_permissions: "0",
    options: [
      {
        name: "question",
        description: "Opcje",
        type: 3,
        required: true,
        choices: faqData.map((question) => ({
          name: Object.keys(question)[0],
          value: Object.keys(question)[0],
        })),
      },
    ],
  },
  async execute(interaction) {
    const providedQuestion = interaction.options.getString("question");
    const message = faqData.find(
      (question) => Object.keys(question)[0] === providedQuestion,
    )[providedQuestion];
    interaction.reply({ content: message });
  },
};
