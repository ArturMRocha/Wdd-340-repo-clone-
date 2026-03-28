const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
  * Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.") // A regra de ouro do professor!
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name, // Stickiness: devolve o que o usuário digitou
    })
    return
  }
  next()
}

/* **********************************
 * Vehicle Data Validation Rules
 * ********************************* */
validate.vehicleRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Please select a classification."),
    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").trim().escape().notEmpty().isNumeric().withMessage("Price must be a number."),
    body("inv_year").trim().escape().notEmpty().isNumeric().isLength({ min: 4, max: 4 }).withMessage("Year must be a 4-digit number."),
    body("inv_miles").trim().escape().notEmpty().isNumeric().withMessage("Miles must be a number."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required.")
  ]
}

/* ******************************
 * Check vehicle data and return errors or continue
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Passamos o classification_id para o Select continuar marcando a categoria escolhida
    let classificationSelect = await utilities.buildClassificationList(classification_id) 
    
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      // Abaixo estão as variáveis que fazem o form ser "Sticky"
      classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    })
    return
  }
  next()
}

module.exports = validate