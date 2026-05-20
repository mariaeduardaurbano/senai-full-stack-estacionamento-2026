const urlAut = "http://localhost:3000/aut";
const urlEstad = "http://localhost:3000/estad";

let automoveis = [];
let estadias = [];

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("listaVeiculos")) carregarAutomoveis();
  if (document.getElementById("listaEstadias")) carregarEstadias();
});

function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("active");
}

function fecharModal(id) {
  if (id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
  } else {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
  }
  limparCampos();
}

function limparCampos() {
  document.querySelectorAll("input").forEach(i => i.value = "");
}

async function carregarAutomoveis() {
  try {
    const res = await fetch(`${urlAut}/listar`);
    if (!res.ok) throw new Error();

    automoveis = await res.json();
    renderizarAutomoveis();
  } catch {
    alert("Erro ao carregar veículos");
  }
}

function renderizarAutomoveis() {
  const tbody = document.getElementById("listaVeiculos");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!automoveis.length) {
    tbody.innerHTML = `<tr><td colspan="8">Nenhum veículo</td></tr>`;
    return;
  }

  automoveis.forEach(v => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${v.placa}</td>
      <td>${v.proprietario}</td>
      <td>${v.tipo}</td>
      <td>${v.modelo}</td>
      <td>${v.marca}</td>
      <td>${v.cor || "-"}</td>
      <td>${v.ano || "-"}</td>
      <td>
        <button onclick="deletarAutomovel('${v.placa}')">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function salvarAutomovel() {
  const automovel = {
    placa: get("placa"),
    proprietario: get("proprietario"),
    tipo: get("tipo")?.toUpperCase(),
    modelo: get("modelo"),
    marca: get("marca"),
    cor: get("cor") || null,
    ano: get("ano") ? parseInt(get("ano")) : null
  };

  if (!automovel.placa || !automovel.proprietario || !automovel.tipo || !automovel.modelo || !automovel.marca) {
    alert("Preencha os campos obrigatórios");
    return;
  }

  try {
    const res = await fetch(`${urlAut}/cadastrar`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(automovel)
    });

    if (!res.ok) throw new Error();

    fecharModal("modalVeiculo");
    carregarAutomoveis();
  } catch {
    alert("Erro ao salvar veículo");
  }
}

async function deletarAutomovel(placa) {
  if (!confirm("Excluir veículo?")) return;

  try {
    const res = await fetch(`${urlAut}/excluir/${placa}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    carregarAutomoveis();
  } catch {
    alert("Erro ao excluir veículo");
  }
}

async function carregarEstadias() {
  try {
    const res = await fetch(`${urlEstad}/listar`);
    if (!res.ok) throw new Error();

    estadias = await res.json();
    renderizarEstadias();
  } catch {
    alert("Erro ao carregar estadias");
  }
}

function renderizarEstadias() {
  const tbody = document.getElementById("listaEstadias");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!estadias.length) {
    tbody.innerHTML = `<tr><td colspan="5">Nenhuma estadia</td></tr>`;
    return;
  }

  estadias.forEach(e => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.placa}</td>
      <td>${e.entrada ? formatarData(e.entrada) : "-"}</td>
      <td>${e.saida ? formatarData(e.saida) : "-"}</td>
      <td>${e.valorTotal !== null && e.valorTotal !== undefined ? "R$ " + Number(e.valorTotal).toFixed(2) : "-"}</td>
      <td>
        ${
          !e.saida
            ? `<button onclick="finalizarEstadia(${e.id})">Finalizar</button>`
            : `<span>Finalizada</span>`
        }
      </td>
      <td><button onclick="deletarEstadia(${e.id})">Excluir</button></td>
    `;

    tbody.appendChild(tr);
  });
}

async function salvarEstadia() {
  const estadia = {
    placa: get("placaEstadia"),
    valorHora: parseFloat(get("valorHora"))
  };

  if (!estadia.placa || !estadia.valorHora) {
    alert("Preencha tudo");
    return;
  }

  try {
    const res = await fetch(`${urlEstad}/cadastrar`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(estadia)
    });

    if (!res.ok) throw new Error();

    fecharModal("modalEstadia");
    carregarEstadias();
  } catch {
    alert("Erro ao salvar estadia");
  }
}

async function finalizarEstadia(id) {
  try {
    const res = await fetch(`${urlEstad}/atualizar/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ saida: new Date() })
    });

    if (!res.ok) throw new Error();

    carregarEstadias();
  } catch {
    alert("Erro ao finalizar estadia");
  }
}

async function deletarEstadia(id) {
  if (!confirm("Excluir estadia?")) return;

  try {
    const res = await fetch(`${urlEstad}/excluir/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    carregarEstadias();
  } catch {
    alert("Erro ao excluir estadia");
  }
}

function get(id) {
  return document.getElementById(id)?.value.trim();
}

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR");
}
