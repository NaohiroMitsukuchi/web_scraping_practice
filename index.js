const PORT = 3000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require("path");
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "views")));

// スクレイピングの処理
const itemLists = [];
for(let i = 1; i <= 3; i++ ){
  axios(`https://search.rakuten.co.jp/search/mall/keybord/?p=${i}`)
  .then((response) => {
    const htmlParser = response.data;
    const $ = cheerio.load(htmlParser);
    $('.searchresultitem', htmlParser).each(function(){
      const title = $(this).find('.title').text();
      const price = $(this).find('.important').text();
      itemLists.push({title, price});
    })
  })
  .catch( error => console.log(error));
}


app.get('/', (req, res) => {
  res.render('./index.ejs', {itemLists: itemLists});
})

app.listen(PORT, console.log('server is running'));