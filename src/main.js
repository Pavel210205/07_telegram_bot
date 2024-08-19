require("dotenv").config();
const axios = require("axios");

const { Bot, Keyboard } = require("grammy");
const AllCommands = [
  { command: "start", description: "Запуск" },
  { command: "weather", description: "Прогноз погоды утинки" },
];
const url =
  "http://api.weatherapi.com/v1/forecast.json?key=9585b645020d45d1b75175503241508&q=56.222715, 43.417822&days=1&aqi=no&alerts=no";

let WeatherForecast = "";
async function getResponse() {
  try {
    const res = await fetch(url).then((response) => {
      return response.json();
    });
    getTextWeater(res.forecast.forecastday[0].hour);
  } catch (error) {}
}
getResponse();
function getTextWeater(res) {
  res.map((obj) => {
    const temperature = obj.temp_c;
    const speedWind = obj.wind_kph;
    const humidity = obj.humidity;
    const timeFull = obj.time.split("");
    const time = timeFull
      .slice(timeFull.length - 5, timeFull.length)
      .join()
      .replace(/[\s.,%]/g, "");

    WeatherForecast += `${time} - ${temperature}°С, скорость ветра ${speedWind}, влажность ${humidity}!\n`;
  });
}

const bot = new Bot("7239065587:AAFG6cyIlaQyiHXy7e_qgwPThXS4Jdz7C4Y");

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

const moodKeyboard = new Keyboard()
  .text("прогноз погоды на утинке")
  .row()
  .text("подписаться на меня")
  .resized();

bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Я - Бот !", {
    reply_markup: moodKeyboard,
  });
});

bot.command("weather", async (ctx) => {
  await ctx.reply(WeatherForecast);
});
bot.hears("прогноз погоды на утинке", (ctx) => {
  ctx.reply(WeatherForecast);
});
bot.hears("подписаться на меня", (ctx) => {
  ctx.reply(
    'Привет! Подпишись на <a href="https://vk.com/gdekysokpizi">мой вк!</a>',
    {
      parse_mode: "HTML",
    }
  );
});

// отвечает при вводе текста
bot.on("message:text", async (ctx) => {
  await ctx.reply("У меня лучше ничего не спрашивай...");
});
// отвечает при вводе фото
bot.on("message:photo", async (ctx) => {
  await ctx.reply("Я тебе что, GPT4 что ли");
});
//отвечает при вводе голосового сообщения
bot.on("message:voice", async (ctx) => {
  await ctx.reply("Иди нахуй, мне не придумали уши!");
});
bot.start();
bot.api.setMyCommands(AllCommands);
