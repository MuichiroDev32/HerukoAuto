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

                box.reply(`👋 |  Hello, ${userName}! Ai Searching your "${question}" Please wait....↺`);
                const response = await axios.get(`https://jonellccapisproject-e1a0d0d91186.herokuapp.com/api/gpt2?prompt=${encodeURIComponent(formattedQuestion)}`);
                const aiResponse = response.data.reply;
                box.reply(`┏━━━━━━━━━━━━━┓\n➤ 𝗔𝗜 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 💬\n┗━━━━━━━━━━━━━┛\n\n ${aiResponse}` + "\n━━━━━━━━━━━━━━━\n➤ 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝙱𝚢: 𝙹𝚊𝚢𝚖𝚊𝚛 𝚡 𝙷𝚎𝚛𝚞𝚔𝚘");
            } catch (error) {
                console.error("Error fetching AI response:", error);
                box.reply("Failed to get AI response. Please try again later.");
            }
        } else {
            box.reply("🤖 𝗔𝗜\n━━━━━━━━━━━━━━━\nPlease provide a question after the command. For example: `-ai what is love?`");
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
