const axios = require('axios');

module.exports.config = {
		name: "Ai",
		version: 1.0,
		credits: "OtinXSandip",
		description: "AI",
		hasPrefix: false,
		usages: "{pn} [prompt]",
		aliases: ["gpt4","ai","gab","megan"],
		cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
		try {
				const prompt = args.join(" ");
				if (!prompt) {
						await api.sendMessage("🧋✨ | 𝒄𝒉𝒂𝒕-𝒈𝒑𝒕
━━━━━━━━━━━━━━━━
𝙥𝙤𝙨𝙚𝙧 𝙢𝙤𝙞 𝙫𝙤𝙩𝙧𝙚 𝙦𝙪𝙚𝙨𝙩𝙞𝙤𝙣			
━━━━━━━━━━━━━━━━", event.threadID);
						return;
				}

				const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
				const answer = response.data.answer;

				await api.sendMessage(answer, event.threadID);
		} catch (error) {
				console.error("Error:", error.message);
		}
};
