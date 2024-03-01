const axios = require("axios");

module.exports = {
    config: {
        name: "heru",
        description: "Interact with an heruko-Ai to get responses to your questions.",
        usage: ":heru <question>",
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

                box.reply(`🤖 Hello, ${userName}! Waiting for heru Response, generating your question please wait....`);
                const response = await axios.get(`https://hiro-api.replit.app/ai/hercai?ask=${encodeURIComponent(formattedQuestion)}`);
                const aiResponse = response.data.reply;
                box.reply(`꧁༺𝙷𝙴𝚁𝚄༻꧂\n━━━━━━━━━━━━━━━\n ${aiResponse}` + "\n━━━━━━━━━━━━━━━\n𝐇𝐄𝐑𝐔 𝐁𝐘 𝐉𝐀𝐘 𝐌𝐀𝐑");
            } catch (error) {
                console.error("Error fetching AI response:", error);
                box.reply("Failed to get AI response. Please try again later.");
            }
        } else {
            box.reply("Please provide a question after the command. For example: `-heru what is love?`");
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
