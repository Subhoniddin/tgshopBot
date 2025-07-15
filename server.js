const express = require("express");
const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// JSON formatdagi so‘rovlarni qabul qilish
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Bot buyruqlari
bot.start((ctx) => {
  ctx.reply("Xush kelibsiz!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Web Appni ochish",
            web_app: {
              url: "https://tg-shop-uz.vercel.app/",
            },
          },
        ],
      ],
    },
  });
});

// Inline tugma bosilganda
bot.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery();
  if (ctx.callbackQuery.data === "open_webapp") {
    ctx.reply("Web App ochilmoqda...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Web Appni ochish",
              web_app: {
                url: "https://tg-shop-uz.vercel.app/",
              },
            },
          ],
        ],
      },
    });
  }
});

// Webhook yo‘li
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Oddiy sahifa
app.get("/", (req, res) => {
  res.send("Telegram Bot ishlamoqda!");
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
const startBot = async () => {
  try {
    const webhookUrl = `${process.env.WEBHOOK_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`;
    const webhookInfo = await bot.telegram.getWebhookInfo();
    if (!webhookInfo.url) {
      await bot.telegram.setWebhook(webhookUrl);
      console.log(`Webhook o‘rnatildi: ${webhookUrl}`);
    }
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portda ishlamoqda`);
    });
  } catch (error) {
    console.error("Webhook o‘rnatishda xato:", error);
  }
};

startBot();

module.exports = app;
