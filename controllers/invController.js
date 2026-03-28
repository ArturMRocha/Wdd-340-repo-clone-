const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * TAREFA 1: Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management1", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 * TAREFA 1 (Semana Passada): Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  
  // Proteção: Se o ID não existir no banco
  if (!data) {
    return next({status: 404, message: 'Vehicle not found.'})
  }

  const grid = await utilities.buildItemDetails(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  
  // Correção: Proteção para categorias vazias
  let className = "Vehicle"
  if (data && data.length > 0) {
    className = data[0].classification_name
  } else {
    className = "Empty Category" 
  }

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * TAREFA 3: Forçar erro 500
 * ************************** */
invCont.triggerError = function (req, res, next) {
  throw new Error("Oh no! This is a deliberate 500 error for Task 3.")
}

/* ***************************
 * TAREFA 2: Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 * TAREFA 2: Processar a nova classificação
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  // Pega o que o usuário digitou no formulário
  const { classification_name } = req.body

  // Manda para o banco de dados
  const classResult = await invModel.addClassification(classification_name)

  if (classResult) {
    // Se deu certo, recria o menu (nav) para a nova categoria aparecer imediatamente
    let nav = await utilities.getNav() 
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.status(201).render("./inventory/management1", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    // Se deu erro no banco, volta para o formulário
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the insertion failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}
/* ***************************
 * TAREFA 3: Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  // Aqui nós chamamos a função que você acabou de criar no passo anterior!
  let classificationSelect = await utilities.buildClassificationList()
  
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 * TAREFA 3: Processar o novo veículo
 * ************************** */
invCont.processAddInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const insertResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  if (insertResult) {
    let nav = await utilities.getNav()
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("./inventory/management1", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    })
  }
}

module.exports = invCont