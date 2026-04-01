const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/download", async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.send("Invalid URL");
  }

  try {
    const api = `https://api.vevioz.com/api/button/mp4?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const html = await response.text();

    res.send(`
      <div style="text-align:center">
        <h2>Download Options</h2>
        ${html}
        <br><br>
        <a href="/">⬅ Back</a>
      </div>
    `);

  } catch (err) {
    res.send("Error fetching video");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
