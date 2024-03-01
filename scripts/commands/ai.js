const axios = require("axios");

module.exports = {
    config: {
        name: "ai",
        description: "Interact with an AI to get responses to your questions.",
        usage: ":ai <question>",
        author: "Rui",
        license: "ISC",
        permission: 0
    },

    run: async ({ api, event, args, box }) => {
        const question = args.join(" ").trim();

        if (question) {
            try {
                const senderID = event.senderID;
                const userInfo = await getUserInfo(api, senderID);
                const userName = userInfo.name || 'User';

                const formattedQuestion = `${userName} asked: ${question}`;

                box.reply(`🧠 |  Hello, ${userName}! Waiting for Ai Response, processing your question Please wait....`);
                const response = await axios.get(`https://hiro-api.replit.app/ai/hercai?ask=${encodeURIComponent(formattedQuestion)}`);
                const aiResponse = response.data.reply;
                box.reply(`🧠 | AI |\n━━━━━━━━━━━━━━━\n ${aiResponse}` + "\n━━━━━━━━━━━━━━━\n╰•★★ AI RESPONSE ★★•╯");
            } catch (error) {
                console.error("Error fetching AI response:", error);
                box.reply("Failed to get AI response. Please try again later.");
            }
        } else {
            box.reply("Please provide a question after the command. For example: `:ai what is love?`");
        }
    }
};

async function getUserInfo(api, senderID) {
    return new Promise((resolve, reject) => {
        api.getUserInfo(senderID, (err, userInfo) => {
            if (err) {
                reject(err);
            } else {
                resolve(userInfo[senderID]);
            }
        });
    });
}
