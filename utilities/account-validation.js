const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/* **********************************
* Regras de Validação: Atualizar Dados
* ********************************* */
validate.accountUpdateRules = () => {
  return [
    body("account_firstname").trim().escape().notEmpty().withMessage("Please provide a first name."),
    body("account_lastname").trim().escape().notEmpty().withMessage("Please provide a last name."),
    body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.")
    // A REGRA DE OURO: Verifica se o email já existe, MAS só se ele for diferente do email atual!
    .custom(async (account_email, { req }) => {
      const account_id = req.body.account_id
      const account = await accountModel.getAccountById(account_id)
      
      // Se o email digitado for diferente do email que já está no banco...
      if (account_email != account.account_email) {
        // ...então a gente verifica se já existe outro usuário usando ele
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please use a different email")
        }
      }
    })
  ]
}

/* ******************************
* Checa os erros e devolve pra tela (Dados)
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
}

/* **********************************
* Regras de Validação: Nova Senha
* ********************************* */
validate.passwordRules = () => {
  return [
    body("account_password").trim().notEmpty()
      .isStrongPassword({ minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
      .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
* Checa os erros e devolve pra tela (Senha)
* ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Precisamos buscar os dados de novo para as caixinhas de cima não sumirem quando der erro de senha
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id
    })
    return
  }
  next()
}

module.exports = validate