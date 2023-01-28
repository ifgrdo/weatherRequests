
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

var appid = require(__dirname + "/config.js").appid;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    console.log("post received");
    const query = req.body.city;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appid + "&units=" + units;

    https.get(url, (response) => {

        response.on("data", (data) => {
            const weatherData = JSON.parse(data); 

            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const city = weatherData.name;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.write("<p>The weather is currently " + description + "</p>");
            res.write("<h2>The temperature in " + city + " is " + temp + " degrees</h2>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        })
    })
})

app.listen(3000, () => {
    console.log("server is listening on port 3000");
})