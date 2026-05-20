const prisma = require("../data/prisma");


const listarEstadias = async (req, res) => {
  const estadias = await prisma.estadia.findMany({
    include: { automovel: true },
  });

  return res.status(200).json(estadias);
};


const buscarEstadia = async (req, res) => {
  const { id } = req.params;

  const estadia = await prisma.estadia.findUnique({
    where: { id: Number(id) },
    include: { automovel: true },
  });

  if (!estadia) {
    return res.status(404).json({ error: "Estadia não encontrada." });
  }

  return res.status(200).json(estadia);
};


const criarEstadia = async (req, res) => {
  try {
    const { placa, valorHora } = req.body;

    if (!placa || !valorHora) {
      return res.status(400).json({ error: "placa e valorHora são obrigatórios." });
    }

    const estadia = await prisma.estadia.create({
      data: {
        placa,
        valorHora,
      },
    });

    return res.status(201).json(estadia);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar estadia." });
  }
};


const atualizarEstadia = async (req, res) => {
  try {
    const { id } = req.params;
    const { saida } = req.body;

    const estadiaAtual = await prisma.estadia.findUnique({
      where: { id: Number(id) },
    });

    if (!estadiaAtual) {
      return res.status(404).json({ error: "Estadia não encontrada." });
    }

    const dados = {};

    if (saida) {
      const entrada = new Date(estadiaAtual.entrada);
      const dataSaida = new Date(saida);

      if (dataSaida < entrada) {
        return res.status(400).json({
          error: "Saída não pode ser menor que a entrada.",
        });
      }

      const diffHoras = (dataSaida - entrada) / (1000 * 60 * 60);

      const valorHora = Number(estadiaAtual.valorHora);
      const valorTotal = Number((valorHora * diffHoras).toFixed(2));

      dados.saida = dataSaida;
      dados.valorTotal = valorTotal;
    }

    const estadia = await prisma.estadia.update({
      where: { id: Number(id) },
      data: dados,
    });

    return res.status(200).json(estadia);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar estadia." });
  }
};


const deletarEstadia = async (req, res) => {
  try {
    const { id } = req.params;

    const estadia = await prisma.estadia.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json(estadia);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar estadia." });
  }
};

module.exports = {
  listarEstadias,
  buscarEstadia,
  criarEstadia,
  atualizarEstadia,
  deletarEstadia,
};