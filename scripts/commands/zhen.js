const axios = require("axios");

module.exports = {
    config: {
        name: "zhen",
        description: "Interact with artificial intelligence (zhen)",
        usage: ":zhen <question>",
        author: "Rui",//modified by Jaymar 
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

                box.reply(`👋 |  Hello, ${userName}! Zhen is searching your "${question}" please wait....`);
                const response = await axios.get(`http://fi3.bot-hosting.net:20265/api/gpt?question=${encodeURIComponent(formattedQuestion)}`);
                const aiResponse = response.data.reply;
                box.reply(`🧠 | 𝐙𝐡𝐞𝐧 𝐀𝐢 |\n━━━━━━━━━━━━━━━\n ${aiResponse}` + "\n━━━━━━━━━━━━━━━\nＣＲＥＡＴＥＤ ＢＹ: ＪＡＹＭＡＲ Ｘ ＨＥＲＵＫＯ");
            } catch (error) {
                console.error("Error fetching AI response:", error);
                box.reply("Failed to get AI response. Please try again later.");
            }
        } else {
            box.reply("Please provide a question after the command. For example: `:zhen what is love?`");
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
