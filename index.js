const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

app.get("/", (req, res) => {
  res.send("🦫 Capy Shop Welcome API Online");
});

app.get("/welcome", async (req, res) => {
  try {
    const avatarURL = req.query.avatar;

    if (!avatarURL) {
      return res.status(400).send("Missing avatar parameter");
    }

    const username = decodeURIComponent(
      req.query.username || "Member"
    );

    const count = req.query.count || "0";

    const canvas = Canvas.createCanvas(1000, 600);
    const ctx = canvas.getContext("2d");

    // ===== BACKGROUND =====
    try {
      const background = await Canvas.loadImage(
        "https://cdn.discordapp.com/attachments/1344720407953150004/1516849661363752970/Capy_20260605_232214_0000.png?ex=6a3423d4&is=6a32d254&hm=34267ff4fdeeab25129a300bf8ff63d1d2565ab86bfe7fbaa9cdaa218a6b4369&"
      );

      ctx.drawImage(
        background,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } catch {
      // Nếu ảnh lỗi thì dùng nền màu
      ctx.fillStyle = "#5E4A36";
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    // Overlay tối
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // ===== AVATAR =====
    const avatar = await Canvas.loadImage(
      avatarURL
    );

    // Glow
    ctx.beginPath();
    ctx.arc(
      500,
      220,
      125,
      0,
      Math.PI * 2
    );
    ctx.fillStyle =
      "rgba(141,220,101,0.35)";
    ctx.fill();

    // Viền trắng
    ctx.beginPath();
    ctx.arc(
      500,
      220,
      115,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Avatar tròn
    ctx.save();

    ctx.beginPath();
    ctx.arc(
      500,
      220,
      108,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      avatar,
      392,
      112,
      216,
      216
    );

    ctx.restore();

    // Viền xanh
    ctx.beginPath();
    ctx.arc(
      500,
      220,
      110,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke();

    // ===== TEXT =====
    ctx.textAlign = "center";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px Sans";
    ctx.fillText(
      "WELCOME",
      500,
      400
    );

    let displayName = username;

    if (displayName.length > 20) {
      displayName =
        displayName.slice(0, 20) + "...";
    }

    ctx.font = "bold 42px Sans";
    ctx.fillText(
      displayName,
      500,
      460
    );

    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 30px Sans";
    ctx.fillText(
      `Member #${count}`,
      500,
      510
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Sans";
    ctx.fillText(
      "🦫 CAPY SHOP",
      500,
      560
    );

    const buffer =
      canvas.toBuffer("image/png");

    res.setHeader(
      "Content-Type",
      "image/png"
    );

    res.end(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send(
      "Error: " + err.message
    );
  }
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `🦫 Server running on port ${PORT}`
  );
}); 
