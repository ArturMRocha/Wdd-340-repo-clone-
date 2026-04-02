const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// controllers/accountController.js
const utilities = require('../utilities/')

/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
* Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}
/* ****************************************
* Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Criptografa a senha antes de salvar no banco
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

  // Envia os dados para o Model
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    // Compara a senha digitada com a criptografada no banco
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password // Tira a senha dos dados por segurança

      // Fabrica o Crachá (Token JWT)
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      
      // Guarda o crachá no Cookie do navegador
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      
      // Redireciona para a página de gerenciamento (que vamos criar na Fase 3)
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

/* ****************************************
 * Deliver Account Management View
 * ************************************ */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}
/* ****************************************
 * Process Logout
 * ************************************ */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  res.redirect("/")
}
/* ****************************************
 * Deliver Account Update View
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  // Pega o ID que veio na URL
  const account_id = parseInt(req.params.accountId)
  
  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    // Passamos os dados atuais do usuário para preencher o formulário
    account_id: account_id,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email,
  })
}
/* ****************************************
* Process Account Update (Formulário 1)
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname, account_lastname, account_email, account_id
  )

  if (updateResult) {
    req.flash("notice", `Congratulations, your information has been updated.`)
    
    // O SEGREDO DO JWT: Se o nome ou email mudou, o nosso crachá antigo ficou desatualizado!
    // Precisamos buscar os dados novos no banco e fabricar um crachá (token) novinho:
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
* Process Password Update (Formulário 2)
* *************************************** */
async function updatePassword(req, res) {
  const { account_password, account_id } = req.body

  // Criptografa a nova senha
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    return res.redirect(`/account/update/${account_id}`)
  }

  // Manda pro banco
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("notice", `Congratulations, your password has been updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildAccountUpdate, updateAccount, updatePassword }