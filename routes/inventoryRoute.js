const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Rota para a página de gerenciamento (Tarefa 1)
router.get("/", utilities.handleErrors(invController.buildManagement));

// Rota para exibir o formulário de nova classificação (Tarefa 2)
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Rota POST para processar o formulário de classificação COM VALIDAÇÃO
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.processAddClassification)
)

// Rota para exibir o formulário de novo veículo (Tarefa 3)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Rota POST para processar o formulário de novo veículo COM VALIDAÇÃO
router.post(
  "/add-inventory", 
  invValidate.vehicleRules(), 
  invValidate.checkVehicleData, 
  utilities.handleErrors(invController.processAddInventory)
);

// Rota para a lista de carros de uma categoria (Os botões lá de cima)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Rota para os detalhes de um carro específico (Tarefa 1)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Rota para provocar o erro 500 (Tarefa 3)
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;


