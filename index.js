const token = '5544295654:AAE_nuO4sA5UqwMaEfA3IZ2XKvjQjglcHz0'
const telegramApi = require('node-telegram-bot-api');
const bot = new telegramApi(token, {polling: true});
const puppeteer = require('puppeteer');

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}

const StartPars = async (chatID, city) => {
    console.log("Opening the browser......");
    browser = await puppeteer.launch({
        dumpio: false,
        headless: true,
        args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
        ],
        waitForInitialPage: true,
    });
    let page = await browser.newPage();
    await page.goto("https://norland77.github.io/Weather/", {timeout: 0});
    await page.waitForSelector('.weather__right-input');
    await page.focus('.weather__right-input');
    await page.type('.weather__right-input', city);
    await page.click('.weather__right-btn');
    sleep(5000);
    await page.waitForSelector('.weather__right-forecast');
    await bot.sendPhoto(chatID, await page.screenshot({
        path: "./screenshot.png",
        fullPage: true
    }))
    await browser.close();
    console.log("Closing the browser......");
} 

//! на текущее время
//*https://api.openweathermap.org/data/2.5/weather?q=Kiev&units=metric&appid=ec748d764642a636a5e61260d5043a2b
//!на несколько дней
//*https://api.openweathermap.org/data/2.5/forecast?q=Kiev&units=metric&type=hour&appid=ec748d764642a636a5e61260d5043a2b
bot.on('message', msg => {
    let city = msg.text;
    const chatID = msg.chat.id;
    if (city != "/start"){
        bot.sendMessage(chatID, "Loading...");
        StartPars(chatID, city);
    }
})


