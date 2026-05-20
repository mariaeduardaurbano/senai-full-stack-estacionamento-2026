const prisma = require("../data/prisma");

const listarAutomoveis = async (req, res) => {
  try {
    const automoveis = await prisma.automovel.findMany({
      include: { estadias: true },
    });
    return res.status(200).json(automoveis);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao listar veículos.", detalhe: error.message });
  }
};

const buscarAutomovel = async (req, res) => {
  const { placa } = req.params;
  try {
    const automovel = await prisma.automovel.findUnique({
      where: { placa },
      include: { estadias: true },
    });

    if (!automovel) {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }

    return res.status(200).json(automovel);
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao buscar veículo.", detalhe: error.message });
  }
};


const criarAutomovel = async (req, res) => {
  const { placa, proprietario, tipo, modelo, marca, cor, ano, telefone } = req.body;

  if (!placa || !proprietario || !tipo || !modelo || !marca) {
    return res.status(400).json({
      erro: "Campos obrigatorios: placa, proprietario, tipo, modelo e marca.",
    });
  }

  const tiposValidos = ["CARRO", "MOTO", "VAN", "CAMINHAO", "ONIBUS"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      erro: `Tipo inválido. Use: ${tiposValidos.join(", ")}`,
    });
  }

  try {
    const automovel = await prisma.automovel.create({
      data: {
        placa,
        proprietario,
        tipo,
        modelo,
        marca,
        cor: cor || null,       
        ano: ano || null,      
        telefone: telefone || null,
      },
    });
    return res.status(201).json(automovel);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ erro: "ja existe um veículo com essa placa." });
    }
    return res.status(400).json({ erro: "Erro ao cadastrar Veículo.", detalhe: error.message });
  }
};

const atualizarAutomovel = async (req, res) => {
  const { placa } = req.params;
  const { proprietario, tipo, modelo, marca, cor, ano, telefone } = req.body;

  if (tipo) {
    const tiposValidos = ["CARRO", "MOTO", "VAN", "CAMINHAO", "ONIBUS"];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        erro: `Tipo inválido, use: ${tiposValidos.join(", ")}`,
      });
    }
  }

  try {
    const automovel = await prisma.automovel.update({
      where: { placa },
      data: { proprietario, tipo, modelo, marca, cor, ano, telefone },
    });
    return res.status(200).json(automovel);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }
    return res.status(400).json({ erro: "Erro ao atualizar veículo.", detalhe: error.message });
  }
};


const deletarAutomovel = async (req, res) => {
  const { placa } = req.params;
  try {
    await prisma.automovel.delete({ where: { placa } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Veículo não encontrado." });
    }
    return res.status(400).json({ erro: "Erro ao deletar veículo.", detalhe: error.message });
  }
};

module.exports = {
  listarAutomoveis,
  buscarAutomovel,
  criarAutomovel,
  atualizarAutomovel,
  deletarAutomovel,
};