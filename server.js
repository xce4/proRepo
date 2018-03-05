const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
        waitUntil: 'networkidle2',
        ignoreHTTPSErrors: true,
        args: ['--disable-setuid-sandbox', '--no-sandbox'],
        headless: true
     // setRequestInterceptionEnabled: true,
      //ignoreHTTPSErrors: true
    });
    console.log('1')
    const page = await browser.newPage();
    console.log('2')
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    console.log('2a')
    await page.evaluate(() => console.log(`url is ${location.href}`));
    console.log('2b')
    await page.goto('https://www.glitch.com/');
    console.log('3')
    await page.evaluate(() => console.log(`url is ${location.href}`));
    console.log('3a')
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