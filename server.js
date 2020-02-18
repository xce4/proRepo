const express = require("express"),
  app = express(),
  fs = require("fs"),
  cheerio = require("cheerio"),
  exec = require("child_process").exec,
  puppeteer = require("puppeteer");
function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}
app.get("/",(req,res)=>{
  res.send("yeah")
})
app.get("/do", async (req, res) => {
  var time=Number(fs.readFileSync("last.txt"));
  if((time+86400000)>Date.now())
    {
      res.redirect("/second")
      return;
    }
  fs.writeFileSync("last.txt",Date.now()); 

  var firstUrl = null;
  async function doIt(change = false, url = null) {
    try {
      var stop = false;
      var fetchData = html => {
        var $ = cheerio.load(html.replace("\n", ""));
        var datas = [];
        $(".ip").each((i, e) => {
          datas.push(
            $(e)
              .text()
              .trim()
          );
        });
        fs.appendFileSync("data.txt", datas.join("\n") + "\n");
      };

      const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
        // headless: false
      });
      var x = String(fs.readFileSync("ids.txt")).split("\n");
      if (change) {
        x.push(x[0]);
        x = x.slice(1, x.length);
        fs.writeFileSync("ids.txt", x.join("\n"));
      }
      var first = x[0].split(":");
      const page = await browser.newPage();
      await page.goto("https://account.shodan.io/login");
      await page.click("#username");
      await page.keyboard.type(first[0]);
      await page.click("#password");
      await page.keyboard.type(first[1]);
      await page.keyboard.press("Enter");
      await delay(3000);
      var loop = async url => {
        console.log(url);
        await page.goto(url);
        var content = await page.content();
        if (
          content.includes(
            "Daily search usage limit reached. Please wait a bit before doing more searches or use the API."
          )
        ) {
          doIt(true, url);
          stop = true;
          return;
        }
        fs.writeFileSync("parse.html", content);
        await fetchData(content);
        await delay(4000);
      };
      var getUrl = () => {
        var x1 = String(fs.readFileSync("urls.txt")).split("\n");
        var temp = x1[0];
        x1.push(temp);
        x1 = x1.slice(1, x.length);
        fs.writeFileSync("urls.txt", x1.join("\n"));
        return temp;
      };
      if (firstUrl == null) {
        firstUrl = getUrl();
        await loop(firstUrl);
        if (stop) return;
      }
      if (url == null) var url1 = getUrl();
      else url1 = url;
      while (url1 != firstUrl) {
        await loop(url1);
        url1 = getUrl();
        if (stop) return;
      }
      await browser.close();
    } catch (err) {
      console.log(err);
    }
  }
  await doIt();
  res.redirect("/second");
});

app.get("/hi", (req, res, next) => {
  res.send("hi !");
});
app.get("/log",(req,res,next)=>{
  res.send(String(fs.readFileSync("log.txt")))
})

app.get("/second", async (req, res, next) => {
  fs.writeFileSync("log.txt",`TIME : ${Date.now()} \n\n\n`);  
  exec("python3 install.py>>log.txt", (err, stdout, stderr) => {});
  res.json({ success: true });
});

var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().PORT);
});
