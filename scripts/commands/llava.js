const axios = require('axios');

module.exports = {
  config: {
    name: "llava",
    version: "1.0.0",
    author: "Eugene Aguilar",
    hasPermssion: 0,
    description: "message reply a photo",
    commandCategory: "img",
    usage: "reply a photo",
  },

  run: async function({ api, event, args }) {
    try {
      if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
        const photo = event.messageReply.attachments[0].url;
        const ask = args.join(" ");
        const response = await axios.get(`https://haze-ai-models-8d44a842ac90.herokuapp.com/llava?prompt=${ask}&imageUrl=${photo}`);
        const data = response.data;
        box.send(data);  // It seems like there's a missing reference to 'box'. You might want to replace it with 'api.sendMessage' or a similar method.
      }
    } catch (error) {
      console.error(error);
    }
  }
};
