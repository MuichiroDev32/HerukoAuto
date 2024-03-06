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

                box.reply(`👋 | Hello, ${userName}! Heru Searching your "${question}" please wait....↺`);
                const response = await axios.get(`https://eurix-api.replit.app/gpt4?ask=${encodeURIComponent(formattedQuestion)}`);
                const aiResponse = response.data.reply;
                box.reply(`┏━━━━━━━━━━━━━━━━┓\n➤ 𝗛𝗘𝗥𝗨 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 💬\n┗━━━━━━━━━━━━━━━━┛\n➤ 𝙷𝚎𝚕𝚕𝚘✍️:"${userName}"\n➤ 𝚈𝚘𝚞𝚛 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚒𝚜:"${question}"\n\n➤ 𝙷𝚎𝚛𝚞 𝙰𝚗𝚜𝚠𝚎𝚛:\n${aiResponse}` + "\n━━━━━━━━━━━━━━━━━\n➤ 𝙼𝚘𝚍𝚒𝚏𝚒𝚎𝚍 𝙱𝚢: 𝙹𝚊𝚢𝚖𝚊𝚛 𝚡 𝙷𝚎𝚛𝚞𝚔𝚘\n➤ 𝙾𝚠𝚗𝚎𝚛 𝚕𝚒𝚗𝚔:https://www.facebook.com/100095054572020");
            } catch (error) {
                console.error("Error fetching AI response:", error);
                box.reply("Failed to get AI response. Please try again later.");
            }
        } else {
            box.reply("┏━━━━━━━━━━━━━┓\n➤ 𝗛𝗘𝗥𝗨 𝗔𝗜 🤖\n┗━━━━━━━━━━━━━┛\nPlease provide a question after the command. For example: `-heru what is love?`");
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
