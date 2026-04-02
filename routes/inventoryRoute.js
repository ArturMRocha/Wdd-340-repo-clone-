const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Rota para a página de gerenciamento (Tarefa 1) - PROTEGIDA
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Rota para exibir o formulário de nova classificação (Tarefa 2) - PROTEGIDA
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Rota POST para processar o formulário de classificação COM VALIDAÇÃO - PROTEGIDA
router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.processAddClassification)
)

// Rota para exibir o formulário de novo veículo (Tarefa 3) - PROTEGIDA
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Rota POST para processar o formulário de novo veículo COM VALIDAÇÃO - PROTEGIDA
router.post(
  "/add-inventory", 
  utilities.checkAccountType,
  invValidate.vehicleRules(), 
  invValidate.checkVehicleData, 
  utilities.handleErrors(invController.processAddInventory)
);

// ==========================================
// ROTAS PÚBLICAS (Visitantes podem acessar)
// ==========================================

// Rota para a lista de carros de uma categoria (Os botões lá de cima)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Rota para os detalhes de um carro específico (Tarefa 1)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Rota para provocar o erro 500 (Tarefa 3)
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;