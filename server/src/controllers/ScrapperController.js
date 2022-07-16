const cheerio = require("cheerio");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  scrapTitle: (req, res) => {
    const info = [];
    try {
      axios(process.env.SCRAPPER_URL).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $(".box-breadcrumb-sub", html).each(function () {
          const title = $(this).find("h1 > a").attr('title');
          const url = $(this).find("h1 > a").attr('href');
          info.push({
            title: title,
            url: process.env.URL+url
          })
        });
        res.status(200).json(info);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error!!!",
      });
    }
  },
};