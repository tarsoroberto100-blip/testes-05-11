function validarMatricula(matricula) {
  return /^\d{6}$/.test(matricula.trim());
}

function validarNome(nome) {
  return nome.trim().length >= 3;
}

function contarAtivos(itens) {
  return itens.filter(function (item) {
    return item.tipo === 'reserva' || item.tipo === 'emprestimo';
  }).length;
}

function contarFilas(itens) {
  return itens.filter(function (item) {
    return item.tipo === 'fila';
  }).length;
}

function temItemDoLivro(itens, livroId) {
  return itens.some(function (item) {
    return item.livroId === livroId;
  });
}

function podeReservar(livro, itens, multa) {
  if (livro.consulta) {
    return { ok: false, motivo: 'Obra de consulta local: não pode sair da biblioteca.' };
  }
  if (multa > 0) {
    return { ok: false, motivo: 'Você tem multa pendente. Regularize no balcão antes de reservar.' };
  }
  if (temItemDoLivro(itens, livro.id)) {
    return { ok: false, motivo: 'Você já tem este livro na sua conta.' };
  }
  if (livro.disponiveis > 0) {
    if (contarAtivos(itens) >= LIMITE_ITENS) {
      return { ok: false, motivo: 'Limite de ' + LIMITE_ITENS + ' livros entre reservas e empréstimos atingido.' };
    }
    return { ok: true, acao: 'reserva' };
  }
  if (contarFilas(itens) >= LIMITE_FILAS) {
    return { ok: false, motivo: 'Você já está em ' + LIMITE_FILAS + ' filas de espera.' };
  }
  return { ok: true, acao: 'fila' };
}

function podeRenovar(item, livro, hoje, multa) {
  if (item.tipo !== 'emprestimo') {
    return { ok: false, motivo: 'Só empréstimos podem ser renovados.' };
  }
  if (item.renovado) {
    return { ok: false, motivo: 'Este empréstimo já foi renovado uma vez.' };
  }
  if (hoje > item.prazoDia) {
    return { ok: false, motivo: 'Empréstimo atrasado não pode ser renovado.' };
  }
  if (multa > 0) {
    return { ok: false, motivo: 'Você tem multa pendente.' };
  }
  if (livro.filaOutros > 0) {
    return { ok: false, motivo: 'Há leitores na fila de espera deste livro.' };
  }
  return { ok: true };
}

function calcularMulta(prazoDia, diaDevolucao) {
  const atraso = Math.max(0, diaDevolucao - prazoDia);
  return Math.min(atraso * MULTA_POR_DIA, MULTA_MAXIMA);
}

function dataDoDia(dia) {
  const data = new Date(DATA_INICIAL.getTime());
  data.setDate(data.getDate() + dia);
  return data;
}

function formatarData(dia) {
  const nomes = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const data = dataDoDia(dia);
  const dd = String(data.getDate()).padStart(2, '0');
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  return nomes[data.getDay()] + ', ' + dd + '/' + mm + '/' + data.getFullYear();
}

function formatarMoeda(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

if (typeof module !== 'undefined') {
  module.exports = { validarMatricula, validarNome, contarAtivos, contarFilas, temItemDoLivro, podeReservar, podeRenovar, calcularMulta, formatarData, formatarMoeda };
}
