const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 8081

// Import
  // Rotas
  const categoriesController = require("./categories/CategoryController");
  const articlesController = require("./articles/ArticleController");
  const usersController = require("./users/UsersController");

  // DB
  const Articles = require("./articles/Article");
  const Categories = require("./categories/Category");
  const Users = require("./users/User");

// Configs
  // View Engine
  app.set('view engine', 'ejs');

  // Sessions
  app.use(session({
    secret: process.env.SESSION_SECRET,
    cookies: {
      maxAge: 3600000 // 12h
    },
    resave: false,
    saveUninitialized: false
  }))

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
  Articles.find().sort({_id: -1})
    .then(articles => {
      Categories.find().sort({articles: 1})
        .then(categories => {
          res.render("index", {
            articles: articles,
            categories: categories
          })
        })
        .catch(err => {
          console.error("Erro ao carregar categorias");
          res.redirect("/404");
        })
    })
    .catch(err => {
      console.error("Erro ao carregar artigos");
      res.redirect("/404");
    })
})

// Blog
app.get("/blog", (req, res) => {
  res.redirect("/")
})

// Exibição de artigo
app.get("/blog/:slug", (req, res) => {
  const slug = req.params.slug;

  // Pesquisa no DB
  Articles.findOne({slug: slug}).populate("category")
    .then(article => {
      if(article == null){
        console.error("Artigo não encontrado");
        res.redirect("/");
      }else{
        Categories.findById(article.category._id).populate("articles")
          .then(category => {
            // Todas as categorias
            Categories.find().sort({articles: 1})
              .then(categories => {
                res.render("article", {
                  article: article,
                  category: category,
                  categories: categories
                })
              })
              .catch(err => {
                console.error("Erro ao consultar categorias");
                res.redirect("/");
              })
          })
          .catch(err => {
            console.error("Erro ao consultar categoria");
            res.redirect("/");
          })
      }
    })
    .catch(err => {
      console.error("Erro ao consultar artigo");
      res.redirect("/");
    })
})

// Categorias
app.get("/categoria/:slug", (req, res) => {
  const slug = req.params.slug

  Categories.findOne({ slug: slug }).populate("articles").sort({_id: -1})
    .then(category => {
      res.render("categories", {
        category: category
      })
    })
    .catch(err => {
      console.error("Erro ao consultar categoria");
      res.redirect("/");
    })
})

app.get("/categoria", (req, res) => {
  res.redirect("/");
})

// ADMIN
  // Categories
  app.use("/categories", categoriesController);

  // Articles
  app.use("/articles", articlesController);

  // Users
  app.use("/users", usersController);

app.listen(port, () => {
  console.log(`No ar! Porta: ${port}`)
})
