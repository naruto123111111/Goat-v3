const fs = require("fs");
const axios = require("axios");
const path = require("path");

let lastPlayed = -1;

module.exports = {
  config: {
    name: "gan",
    version: "2.2.0",
    role: 0,
    author: "MJ HAMIM",
    shortDescription: "Play specific song by serial number or random 🎶",
    longDescription: "Sends song by serial number (1-40) or random song.",
    category: "media",
    guide: "{p}gan [1-40] or {p}gan list"
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;

    // 🎵 ৪০টি গানের সিরিয়াল, নাম এবং লিংক তালিকা
    const songs = [
      { title: "Song 1", url: "https://files.catbox.moe/rtoz0p.mp4" },
      { title: "Song 2", url: "https://files.catbox.moe/48nava.mp4" },
      { title: "Song 3", url: "https://files.catbox.moe/nd2ntd.mp4" },
      { title: "Song 4", url: "https://files.catbox.moe/btrcbf.mp4" },
      { title: "Song 5", url: "https://files.catbox.moe/ty6y15.mp4" },
      { title: "Song 6", url: "https://files.catbox.moe/h3rdkw.mp4" },
      { title: "Song 7", url: "https://files.catbox.moe/97sw1j.mp4" },
      { title: "Song 8", url: "https://files.catbox.moe/wusj7g.mp4" },
      { title: "Song 9", url: "https://files.catbox.moe/ebxbai.mp4" },
      { title: "Song 10", url: "https://files.catbox.moe/9zmvop.mp4" },
      { title: "Song 11", url: "https://files.catbox.moe/g0mqs2.mp4" },
      { title: "Song 12", url: "https://files.catbox.moe/r3flyo.mp4" },
      { title: "Song 13", url: "https://files.catbox.moe/vlfahp.mp4" },
      { title: "Song 14", url: "https://files.catbox.moe/r09q3y.mp4" },
      { title: "Song 15", url: "https://files.catbox.moe/wusj7g.mp4" },
      { title: "Song 16", url: "https://files.catbox.moe/qmpvpt.mp3" },
      { title: "Song 17", url: "https://files.catbox.moe/v0twt3.mp3" },
      { title: "Song 18", url: "https://files.catbox.moe/avlqok.mp3" },
      { title: "Song 19", url: "https://files.catbox.moe/avlqok.mp3" },
      { title: "Song 20", url: "https://files.catbox.moe/x5f56o.mp3" },
      { title: "Song 21", url: "https://files.catbox.moe/euq7fo.mp3" },
      { title: "Song 22", url: "https://files.catbox.moe/q61co1.mp3" },
      { title: "Song 23", url: "https://files.catbox.moe/y8bg4r.mp3" },
      { title: "Song 24", url: "https://files.catbox.moe/q4m2ad.mp3" },
      { title: "Song 25", url: "https://files.catbox.moe/0xscc8.mp3" },
      { title: "Song 26", url: "https://files.catbox.moe/23e8u1.mp3" },
      { title: "Song 27", url: "https://files.catbox.moe/z9d2e6.mp3" },
      { title: "Song 28", url: "https://files.catbox.moe/y8dzik.mp3" },
      { title: "Song 29", url: "https://files.catbox.moe/nry1qv.mp3" },
      { title: "Song 30", url: "https://files.catbox.moe/k3acvx.mp3" },
      { title: "Song 31", url: "https://files.catbox.moe/aaqddo.mp3" },
      { title: "Song 32", url: "https://files.catbox.moe/12grz0.mp3" },
      { title: "Song 33", url: "https://files.catbox.moe/xtpf61.mp3" },
      { title: "Song 34", url: "https://files.catbox.moe/oaecnx.mp3" },
      { title: "Song 35", url: "https://files.catbox.moe/ayepdz.mp3" },
      { title: "Song 36", url: "https://files.catbox.moe/etsdn9.mp3" },
      { title: "Song 37", url: "https://files.catbox.moe/avlqok.mp3" },
      { title: "Song 38", url: "https://files.catbox.moe/v0twt3.mp3" },
      { title: "Song 39", url: "https://files.catbox.moe/x5f56o.mp3" },
      { title: "Song 40", url: "https://files.catbox.moe/q4m2ad.mp3" }
    ];

    if (songs.length === 0) {
      return api.sendMessage("❌ Nᴏ sᴏɴɢs ᴄᴏᴜʟᴅ ʙᴇ ғᴏᴜɴᴅ!", threadID, messageID);
    }

    // 📜 'gan list' লিখলে ৪০টি গানের তালিকা পাঠাবে
    if (args[0] && args[0].toLowerCase() === "list") {
      let msg = "🎧 🎵 **Sᴏɴɢ Sᴇʀɪᴀʟ Lɪsᴛ (1-40)** 🎵 🎧\n\n";
      songs.forEach((song, index) => {
        msg += `[ ${index + 1} ] » ${song.title}\n`;
      });
      msg += `\n📌 Example: gan 1\n💡 Jodi Aru Medam er Song Shunte chaw tahole gan (1-15) try koro`;
      return api.sendMessage(msg, threadID, messageID);
    }

    let index;
    const choice = parseInt(args[0]);
    let responseText = "";

    // 🔢 যদি ব্যবহারকারী সিরিয়াল নম্বর দেয়
    if (!isNaN(choice)) {
      if (choice < 1 || choice > songs.length) {
        return api.sendMessage(`❌ দয়া করে ১ থেকে ${songs.length} এর মধ্যে যেকোনো সিরিয়াল নম্বর দিন!\nলিস্ট দেখতে লিখুন: gan list`, threadID, messageID);
      }
      index = choice - 1;
      responseText = `🎶 Playing Serial [ ${index + 1} ]: ${songs[index].title} 🎧`;
    } else {
      // 🎲 নম্বর না দিলে র্যান্ডম প্লে করবে এবং নোটিশ দেখাবে
      do {
        index = Math.floor(Math.random() * songs.length);
      } while (index === lastPlayed && songs.length > 1);

      responseText = `🎶 Playing Serial [ ${index + 1} ]: ${songs[index].title} 🎧\n\n💡 Jodi Aru Medam er Song Shunte chaw tahole gan (1-15) try koro`;
    }

    lastPlayed = index;

    // ⏳ React for loading
    api.setMessageReaction("🎵", messageID, () => {}, true);

    const song = songs[index];
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const filePath = path.join(cacheDir, `song_${index + 1}.mp3`);

    try {
      const response = await axios({
        url: song.url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        api.sendMessage(
          {
            body: responseText,
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          async () => {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          },
          messageID
        );
      });

      writer.on("error", (err) => {
        console.error("Error writing file:", err);
        api.sendMessage("❌ Fᴀɪʟᴇᴅ ᴛᴏ sᴇɴᴅ sᴏɴɢ!", threadID, messageID);
      });

    } catch (err) {
      console.error("Download error:", err);
      api.sendMessage("⚠️ Fᴀɪʟᴇᴅ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ sᴏɴɢ!", threadID, messageID);
    }
  }
};
