const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/download", (req, res) => {
  const url = req.body.url;

  if (!url) return res.send("Invalid URL");

  const command = `yt-dlp -f best -g ${url}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return res.send("❌ Failed to fetch video");
    }

    const videoUrl = stdout.trim();

    res.send(`
      <div style="text-align:center">
        <h2>Download Ready 🎬</h2>
        <a href="${videoUrl}" target="_blank">
          <button style="padding:10px 20px;font-size:16px">
            Download Video
          </button>
        </a>
        <br><br>
        <a href="/">⬅ Back</a>
      </div>
    `);
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
