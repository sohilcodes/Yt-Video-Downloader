const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/download", async (req, res) => {
  const url = req.body.url;

  if (!url) return res.send("Invalid URL");

  try {
    // NEW WORKING API
    const api = `https://api.cobalt.tools/api/json`;

    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url
      })
    });

    const data = await response.json();

    if (!data || !data.url) {
      return res.send("❌ Failed to fetch video");
    }

    res.send(`
      <div style="text-align:center">
        <h2>Download Ready 🎬</h2>
        <a href="${data.url}" target="_blank">
          <button style="padding:10px 20px;font-size:16px">Download Video</button>
        </a>
        <br><br>
        <a href="/">⬅ Back</a>
      </div>
    `);

  } catch (err) {
    console.log(err);
    res.send("❌ Error fetching video");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
