const axios = require("axios");

module.exports = {
  config: {
    name: "gemini",
    description: "Ask gemini a question.",
    usage: "{p}gemini <question>",
    role: 0, // 0 - Everyone, 1 - Admin
    author: "Rui | Liane",//modified by Jay Mar
  },
  run: async ({ api, event, args, box }) => {
    const question = args.join(" ");

    if (!question) {
      box.reply(
        "Please provide a question after the command using the query parameter.",
      );
      return;
    }

    try {
      const response = await axios.get(
        `https://lianeapi.onrender.com/@hercai/api/gemini?key=j86bwkwo-8hako-12C&query=${question}`,
      );
      const message = response.data.message;

      box.reply(message, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error asking gemini:", error.message);
      box.reply("An error occurred while asking gemini.");
    }
  },
};
    
