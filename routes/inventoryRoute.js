const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Rota para a lista de carros de uma categoria (Os botões lá de cima)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Rota para os detalhes de um carro específico (Tarefa 1)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Rota para provocar o erro 500 (Tarefa 3)
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))
module.exports = router;


