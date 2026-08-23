const fs = require("fs");
const axios = require("axios");
const path = require("path");

let lastPlayed = -1;

module.exports = {
  config: {
    name: "gan",
    version: "5.2.0",
    role: 0,
    author: "MJ HAMIM",
    shortDescription: "Play songs by serial number 🎵",
    longDescription: "gan 1, gan 2, gan 3... দিয়ে serial অনুযায়ী গান play করবে।",
    category: "media",
    guide: "{p}gan 1 | {p}gan 2 | {p}gan list"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const songs = [
      { title: "Aru Medam Special 01", url: "https://files.catbox.moe/rtoz0p.mp4" },
      { title: "Aru Medam Special 02", url: "https://files.catbox.moe/48nava.mp4" },
      { title: "Aru Medam Special 03", url: "https://files.catbox.moe/nd2ntd.mp4" },
      { title: "Aru Medam Special 04", url: "https://files.catbox.moe/btrcbf.mp4" },
      { title: "Aru Medam Special 05", url: "https://files.catbox.moe/ty6y15.mp4" },
      { title: "Aru Medam Special 06", url: "https://files.catbox.moe/h3rdkw.mp4" },
      { title: "Aru Medam Special 07", url: "https://files.catbox.moe/97sw1j.mp4" },
      { title: "Aru Medam Special 08", url: "https://files.catbox.moe/wusj7g.mp4" },
      { title: "Aru Medam Special 09", url: "https://files.catbox.moe/ebxbai.mp4" },
      { title: "Aru Medam Special 10", url: "https://files.catbox.moe/9zmvop.mp4" },
      { title: "Aru Medam Special 11", url: "https://files.catbox.moe/g0mqs2.mp4" },
      { title: "Aru Medam Special 12", url: "https://files.catbox.moe/r3flyo.mp4" },
      { title: "Aru Medam Special 13", url: "https://files.catbox.moe/vlfahp.mp4" },
      { title: "Aru Medam Special 14", url: "https://files.catbox.moe/r09q3y.mp4" },
      { title: "Aru Medam Special 15", url: "https://files.catbox.moe/wusj7g.mp4" },

      { title: "Random Song 16", url: "https://files.catbox.moe/qmpvpt.mp3" },
      { title: "Random Song 17", url: "https://files.catbox.moe/v0twt3.mp3" },
      { title: "Random Song 18", url: "https://files.catbox.moe/avlqok.mp3" },
      { title: "Random Song 19", url: "https://files.catbox.moe/avlqok.mp3" },
      { title: "Random Song 20", url: "https://files.catbox.moe/x5f56o.mp3" },
      { title: "Random Song 21", url: "https://files.catbox.moe/euq7fo.mp3" },
      { title: "Random Song 22", url: "https://files.catbox.moe/q61co1.mp3" },
      { title: "Random Song 23", url: "https://files.catbox.moe/y8bg4r.mp3" },
      { title: "Random Song 24", url: "https://files.catbox.moe/q4m2ad.mp3" },
      { title: "Random Song 25", url: "https://files.catbox.moe/0xscc8.mp3" },
      { title: "Random Song 26", url: "https://files.catbox.moe/23e8u1.mp3" },
      { title: "Random Song 27", url: "https://files.catbox.moe/z9d2e6.mp3" },
      { title: "Random Song 28", url: "https://files.catbox.moe/y8dzik.mp3" },
      { title: "Random Song 29", url: "https://files.catbox.moe/nry1qv.mp3" },
      { title: "Random Song 30", url: "https://files.catbox.moe/k3acvx.mp3" },
      { title: "Random Song 31", url: "https://files.catbox.moe/aaqddo.mp3" },
      { title: "Random Song 32", url: "https://files.catbox.moe/12grz0.mp3" },
      { title: "Random Song 33", url: "https://files.catbox.moe/xtpf61.mp3" },
      { title: "Random Song 34", url: "https://files.catbox.moe/oaecnx.mp3" },
      { title: "Random Song 35", url: "https://files.catbox.moe/ayepdz.mp3" },
      { title: "Random Song 36", url: "https://files.catbox.moe/etsdn9.mp3" },
      { title: "Random Song 37", url: "https://files.catbox.moe/avlqok.mp3" },
      { title: "Random Song 38", url: "https://files.catbox.moe/v0twt3.mp3" },
      { title: "Random Song 39", url: "https://files.catbox.moe/x5f56o.mp3" },
      { title: "Random Song 40", url: "https://files.catbox.moe/q4m2ad.mp3" }
    ];

    // 📜 GAN LIST
    if (args[0] && args[0].toLowerCase() === "list") {
      let msg = "🌷━━━━━━━━━━━━━━━━━━🌷\n";
      msg += "        🎵 Gᴀɴ Lɪsᴛ 🎵\n";
      msg += "🌷━━━━━━━━━━━━━━━━━━🌷\n\n";

      msg += "🌷 Aʀᴜ Mᴇᴅᴀᴍ Sᴘᴇᴄɪᴀʟ Sᴏɴɢ 🌷\n";
      msg += "━━━━━━━━━━━━━━━━━━━━\n";

      for (let i = 0; i < 15; i++) {
        msg += `🌷 [ ${i + 1} ] ➜ ${songs[i].title}\n`;
      }

      msg += "\n🎧 Rᴀɴᴅᴏᴍ Sᴏɴɢ 🎧\n";
      msg += "━━━━━━━━━━━━━━━━━━━━\n";

      for (let i = 15; i < songs.length; i++) {
        msg += `🎵 [ ${i + 1} ] ➜ ${songs[i].title}\n`;
      }

      msg += "\n━━━━━━━━━━━━━━━━━━━━\n";
      msg += "📌 Example: gan 1 | gan 2 | gan 3\n";
      msg += "🎲 gan = Random Song\n\n";
      msg += "🌷 Hᴀʏ ᴇᴛᴏ ᴄᴜᴛᴇ ᴠᴏɪᴄᴇ 🌷";

      return api.sendMessage(msg, threadID, messageID);
    }

    let index;

    // 🎯 SERIAL COMMAND
    if (args[0]) {
      const choice = Number(args[0]);

      if (!Number.isInteger(choice)) {
        return api.sendMessage(
          "❌ Sʜᴜᴅʜᴜ sᴇʀɪᴀʟ ɴᴜᴍʙᴇʀ ᴅᴀᴡ!\n\n" +
          "📌 Example: gan 1, gan 2, gan 3\n" +
          "📜 List: gan list",
          threadID,
          messageID
        );
      }

      if (choice < 1 || choice > songs.length) {
        return api.sendMessage(
          `❌ Sᴇʀɪᴀʟ ᴍᴀᴛᴄʜ ᴋᴏʀᴇɴɪ!\n\n✅ Vᴀʟɪᴅ sᴇʀɪᴀʟ: 1-${songs.length}\n📜 List: gan list`,
          threadID,
          messageID
        );
      }

      index = choice - 1;
    } else {
      // 🎲 gan লিখলে random প্লে করবে
      do {
        index = Math.floor(Math.random() * songs.length);
      } while (index === lastPlayed && songs.length > 1);
    }

    lastPlayed = index;

    const song = songs[index];
    const ext = path.extname(song.url) || ".mp3";
    const cacheDir = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `gan_${index + 1}_${Date.now()}${ext}`);

    const responseText =
      `🌷 Hᴀʏ ᴇᴛᴏ ᴄᴜᴛᴇ ᴠᴏɪᴄᴇ 🌷\n\n` +
      `🎵 Sᴏɴɢ: ${song.title}\n` +
      `🔢 Sᴇʀɪᴀʟ: ${index + 1}\n\n` +
      `📌 Nᴇxᴛ Sᴏɴɢ Tʀʏ: gan 1, gan 2, gan 3\n` +
      `🎧 Eɴᴊᴏʏ Tʜᴇ Sᴏɴɢ 💗`;

    api.setMessageReaction("🎵", messageID, () => {}, true);

    try {
      const response = await axios({
        method: "GET",
        url: song.url,
        responseType: "stream",
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: responseText,
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          () => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          },
          messageID
        );
      });

      writer.on("error", (err) => {
        console.error("Write Error:", err);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        api.sendMessage("❌ Sᴏɴɢ sᴇɴᴅ ᴋᴏʀᴛᴇ ᴘᴀʀɪɴɪ!", threadID, messageID);
      });

    } catch (err) {
      console.error("Download Error:", err);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      api.sendMessage("⚠️ Sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅ ʜᴏʏɴɪ!", threadID, messageID);
    }
  }
};
