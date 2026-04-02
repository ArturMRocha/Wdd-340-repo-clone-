const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 * ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* TAREFA 1: Build the HTML for the specific vehicle
* ************************************ */
Util.buildItemDetails = async function(vehicle) {
  let price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price);
  let miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

  // Adicionamos classes específicas para você estilizar no CSS
  let grid = `<div class="detail-container">`;
  grid += `<div class="detail-image"><img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"></div>`;
  grid += `<div class="detail-info">`;
  grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
  grid += `<p class="price"><strong>Price:</strong> ${price}</p>`;
  grid += `<p class="description"><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  grid += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  grid += `<p><strong>Miles:</strong> ${miles}</p>`;
  grid += `</div></div>`;
  
  return grid;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  // 1. SEMPRE inicie a variável como uma string vazia para evitar "undefined"
  let grid = "" 
  
  if(data && data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      // O link usando "/" está correto para evitar erros de subpastas
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +'" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ****************************************
 * Middleware For Handling Errors
 * **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification select list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
 * Middleware to check account type for Authorization
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  // Verifica se a pessoa está logada E se o tipo de conta é Funcionário ou Admin
  if (res.locals.loggedin && 
      (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
    next() // Pode passar!
  } else {
    // Se for um 'Client' comum ou não estiver logado, manda de volta pro login
    req.flash("notice", "Please log in with appropriate credentials.")
    return res.redirect("/account/login")
  }
}

module.exports = Util