const express = require("express");

const router = express.Router();

const {
  listarEstadias,
  buscarEstadia,
  criarEstadia,
  atualizarEstadia,
  deletarEstadia,
} = require("../controllers/estadia.controller");


router.get("/listar", listarEstadias);
router.get("/buscar/:id", buscarEstadia); 
router.post("/cadastrar", criarEstadia);
router.put("/atualizar/:id", atualizarEstadia);
router.delete("/excluir/:id", deletarEstadia);

module.exports = router;