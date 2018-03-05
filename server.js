const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://developers.google.com/web/tools/puppeteer');
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    await browser.close();
    response.sendFile(__dirname+'/public/puppeteer.png');
  } catch (error) {
    console.log(error);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});