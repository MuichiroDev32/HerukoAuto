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

                box.reply(`👋 |  Hello, ${userName}! Zhen is searching your "${question}" please wait....↺`);
                const response = await axios.get(`http://fi3.bot-hosting.net:20265/api/gpt?question=${encodeURIComponent(formattedQuestion)}`);
                const aiResponse = response.data.reply;
                box.reply(`┏━━━━━━━━━━━━━━━━┓\n➤ 𝗭𝗛𝗘𝗡 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 💬\n┗━━━━━━━━━━━━━━━━┛\n➤ 𝙷𝚎𝚕𝚕𝚘✍️:${userName}\n➤ 𝚈𝚘𝚞𝚛 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚒𝚜:${question}\n\n➤ 𝚉𝚑𝚎𝚗 𝙰𝚗𝚜𝚠𝚎𝚛:\n${aiResponse}` + "\n\n━━━━━━━━━━━━━━━\n➤ 𝙼𝚘𝚍𝚒𝚏𝚒𝚎𝚍  𝙱𝚢: 𝙹𝚊𝚢𝚖𝚊𝚛 𝚡 𝙷𝚎𝚛𝚞𝚔𝚘\n➤ 𝙾𝚠𝚗𝚎𝚛 𝚕𝚒𝚗𝚔:https://www.facebook.com/100095054572020");
            } catch (error) {
                console.error("Error fetching AI response:", error);
                box.reply("Failed to get AI response. Please try again later.");
            }
        } else {
            box.reply("┏━━━━━━━━━━━━━┓\n➤ 𝗭𝗛𝗘𝗡 𝗔𝗜 🤖\n┗━━━━━━━━━━━━━┛\nPlease provide a question after the command\nFor example:\n`-zhen what is love?`\n\n━━━━━━━━━━━━━━━");
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
