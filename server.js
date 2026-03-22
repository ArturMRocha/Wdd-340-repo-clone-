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

/* ***********************
 * View Engine e Templates (Adicionado)
 *************************/
// Diz ao Express para usar o EJS para montar as telas
app.set("view engine", "ejs")

/* ***********************
 * Routes
 *************************/
app.use(static)
const inventoryRoute = require("./routes/inventoryRoute")
app.use("/inv", inventoryRoute)

// ROTA PRINCIPAL: Quando o usuário entrar no site, renderiza o index.ejs
app.get("/", function(req, res) {
  res.render("index")
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
// Adicionei um fallback (|| 3000) caso o seu arquivo .env não esteja configurado
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App rodando com sucesso em http://${host}:${port}`)
})

// Procure por esta linha no seu server.js
app.use(express.static('public'))