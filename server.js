/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const session = require("express-session")
const pool = require('./database/')

/* ***********************
 * Middleware (Sessões, Mensagens e Body Parser)
 *************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser Middleware (Essencial para as Tarefas 2 e 3)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* ***********************
 * View Engine e Templates
 *************************/
app.set("view engine", "ejs")

/* ***********************
 * Routes
 *************************/
app.use(static)
// Arquivos estáticos (CSS, imagens)
app.use(express.static('public')) 

const inventoryRoute = require("./routes/inventoryRoute")
app.use("/inv", inventoryRoute)

// ROTA PRINCIPAL
app.get("/", function(req, res) {
  res.render("index")
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App rodando com sucesso em http://${host}:${port}`)
})