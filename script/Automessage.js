const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "auto message",
    version: "1.1.0",
    role: 2,
    description: "auto message by time",
    hasPrefix: false,
    aliases: ["auto"],
    usages: "[Text]",
    cooldown: 0,
};

module.exports.run = async function ({ api, event, args, admin }) {
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    let sentCount = 0;
    const custom = args.join(" ");

    // Format the current time
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const message = `
🔔 𝗔𝘂𝘁𝗼 𝗦𝗰𝗵𝗲𝗱𝘂𝗹𝗲:
▬▬▬▬▬▬▬▬▬▬▬▬
⏰ time now - ${currentTime}

📌 ano silbe ng pag online mo kung hinde mo din naman e chachat owner ko😎
    `;

    async function sendMessage(thread) {
        try {
            await api.sendMessage(message, thread.threadID);
            sentCount++;

            const content = message;
            const languageToSay = "tl"; 
            const pathFemale = path.resolve(__dirname, "cache", `${thread.threadID}_female.mp3`);

            await downloadFile(
                `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(content)}&tl=${languageToSay}&client=tw-ob&idx=1`,
                pathFemale
            );
            api.sendMessage(
                { attachment: fs.createReadStream(pathFemale) },
                thread.threadID,
                () => fs.unlinkSync(pathFemale)
            );
        } catch (error) {
            console.error("Error sending a message:", error);
        }
    }

    for (const thread of threadList) {
        if (sentCount >= 20) {
            break;
        }
        if (thread.isGroup && thread.name !== thread.threadID && thread.threadID !== event.threadID) {
            await sendMessage(thread);
        }
    }

    if (sentCount > 0) {
        api.sendMessage(`› Sent the notification successfully.`, event.threadID);
    } else {
        api.sendMessage(
            "› No eligible group threads found to send the message to.",
            event.threadID
        );
    }
};

async function downloadFile(url, filePath) {
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
  }
              
