const express = require("express");

const router = express.Router();

const {
 listarAutomoveis,
  buscarAutomovel,
  criarAutomovel,
  atualizarAutomovel,
  deletarAutomovel,
} = require("../controllers/automovel.controller");


router.get("/listar", listarAutomoveis);
router.get("/buscar/:placa", buscarAutomovel); 
router.post("/cadastrar", criarAutomovel);
router.put("/atualizar/:placa", atualizarAutomovel);
router.delete("/excluir/:placa", deletarAutomovel);

module.exports = router;