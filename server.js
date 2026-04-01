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
  const videoUrl = req.body.url;

  if (!videoUrl) return res.send("Invalid URL");

  try {
    // STEP 1: Parse with real headers
    const parseRes = await fetch(
      "https://api.vidssave.com/api/contentsite_api/media/parse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
          "Origin": "https://vidssave.com",
          "Referer": "https://vidssave.com/"
        },
        body: JSON.stringify({
          url: videoUrl
        })
      }
    );

    const parseData = await parseRes.json();

    // DEBUG (important)
    console.log(parseData);

    if (!parseData || !parseData.data || !parseData.data.request) {
      return res.send("❌ Failed to parse video (API blocked)");
    }

    const token = parseData.data.request;

    // STEP 2: Redirect
    const redirectUrl = `https://api.vidssave.com/api/contentsite_api/media/download_redirect?request=${token}`;

    const finalRes = await fetch(redirectUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://vidssave.com/"
      },
      redirect: "follow"
    });

    const finalVideo = finalRes.url;

    res.send(`
      <div style="text-align:center">
        <h2>Download Ready 🎬</h2>
        <a href="${finalVideo}" target="_blank">
          <button style="padding:12px 20px;background:red;color:white;border:none;border-radius:8px">
            Download Video
          </button>
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
