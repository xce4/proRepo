const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
     // headless: true
     // setRequestInterceptionEnabled: true,
      //ignoreHTTPSErrors: true
    });
    console.log('1')
    const page = await browser.newPage();
    console.log('2')
    await page.goto('https://www.glitch.com/');
    console.log('3')
    await page.screenshot({path: __dirname+'/public/puppeteer.png'});
    console.log('4')
    await browser.close();
    console.log('5')
    response.sendFile(__dirname+'/public/puppeteer.png');
  } catch (error) {
    console.log(error);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});