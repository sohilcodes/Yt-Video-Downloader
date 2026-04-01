from flask import Flask, request, jsonify, send_file
import yt_dlp
import os

app = Flask(__name__)

# ===== HOME =====
@app.route("/")
def home():
    return send_file("index.html")

# ===== DOWNLOAD API =====
@app.route("/download", methods=["POST"])
def download():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"})

    try:
        ydl_opts = {
            "format": "best",
            "quiet": True,
            "js_runtime": "node"
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return jsonify({
            "title": info.get("title"),
            "url": info.get("url")
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# ===== RUN =====
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
