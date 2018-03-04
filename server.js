const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", async (request, response) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    executablePath: 'node_modules/puppeteer/.local-chromium/linux-536395/chrome-linux/chrome'
  });
  const page = await browser.newPage();
  await page.goto('https://www.nasdaq.com/symbol/goog');
  await page.screenshot({path: 'goog.png'});
  await browser.close();
  response.sendFile('goog.png');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});