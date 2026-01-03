const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require("body-parser");
const port = process.env.PORT || 8081

// Import
  // Rotas
  const categoriesController = require("./categories/CategoryController");
  const articlesController = require("./articles/ArticleController");

  // DB
  const Articles = require("./articles/Article");
  const Categories = require("./categories/Category");

// Configs
  // View Engine
  app.set('view engine', 'ejs');

  // Static
  app.use(express.static('public'));

  // Body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }))

  // Redirect
  // app.use((req, res, next) => {
  //   if (req.hostname === 'taaleng.com.br') {
  //     return res.redirect(301, 'https://www.taaleng.com.br' + req.originalUrl);
  //   }
  //   next();
  // });

app.get('/', (req, res) => {
  res.render("index")
})

// Categories
app.use("/categories", categoriesController);

// Articles
app.use("/articles", articlesController);

app.listen(port, () => {
  console.log(`No ar! Porta: ${port}`)
})
