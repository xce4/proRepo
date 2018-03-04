const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');

app.get("/", (request, response) => {
  puppeteer.launch({args: ['--no-sandbox']})
    .then(browser => response.status(200).type('html').send(`<p>Puppeteer worked: ${browser}</p>`))
    .catch(error => {
      const message = error.message.split('\n').join('</br>')
      response.status(500).type('html').send(`<code>${message}</code>`)
    })
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});