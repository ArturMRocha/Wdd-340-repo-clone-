// routes/accountRoute.js
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const actValidate = require('../utilities/account-validation')

// Rota para entregar a tela de Login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Rota para fazer logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Rota para entregar a tela de Atualização
router.get("/update/:accountId", utilities.checkJWTToken, utilities.handleErrors(accountController.buildAccountUpdate))

// Rota para entregar a tela de Registro
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Rota da Tela Principal da Conta
router.get("/", utilities.handleErrors(accountController.buildManagement))

// Rota para processar o formulário de registro
router.post("/register", utilities.handleErrors(accountController.registerAccount))

// Processa o Login
router.post("/login", utilities.handleErrors(accountController.accountLogin))

// Rota POST para atualizar dados da conta COM VALIDAÇÃO
router.post("/update", 
  utilities.checkJWTToken, 
  actValidate.accountUpdateRules(),
  actValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Rota POST para atualizar a senha COM VALIDAÇÃO
router.post("/update-password", 
  utilities.checkJWTToken, 
  actValidate.passwordRules(),
  actValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router