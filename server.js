const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");

const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

// ⚠️ Replace with your NEW bot token & chat ID
const TELEGRAM_BOT_TOKEN = "8484380079:AAFHETJGXNnvoeyTLFl4NQyl7J48NOJvGa4";
const CHAT_ID = "-1003035085003"; // e.g. your group "My Vids"

app.post("/upload-to-telegram", upload.single("video"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("video", fs.createReadStream(filePath));

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVideo`,
      {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      }
    );

    fs.unlinkSync(filePath); // cleanup uploaded file

    const resultText = await response.text();
    console.log("Telegram response:", resultText);

    if (!response.ok) {
      return res.status(500).send("❌ Telegram upload failed: " + resultText);
    }

    res.send("✅ Video sent successfully!");
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("❌ Server error");
  }
});

// Serve frontend
app.use(express.static("public"));

app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
