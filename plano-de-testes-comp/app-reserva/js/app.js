const CHAVE = 'lermais_dados';

let dados = carregar();

function estadoInicial() {
  return {
    hoje: 0,
    livros: JSON.parse(JSON.stringify(LIVROS_INICIAIS)),
    usuarios: {},
    sessao: null
  };
}

function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? JSON.parse(salvo) : estadoInicial();
  } catch (erro) {
    return estadoInicial();
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch (erro) {
    return;
  }
}

function usuarioAtual() {
  return dados.sessao ? dados.usuarios[dados.sessao] : null;
}

function livroPorId(id) {
  return dados.livros.find(function (livro) {
    return livro.id === id;
  });
}

function mostrar(id, texto, tipo) {
  const area = document.getElementById(id);
  area.textContent = texto;
  area.className = 'mensagem' + (tipo ? ' ' + tipo : '');
}

function entrar() {
  const matricula = document.getElementById('matricula').value.trim();
  const nome = document.getElementById('nome').value.trim();
  if (!validarMatricula(matricula)) {
    mostrar('msgLogin', 'A matrícula tem exatamente 6 números.', 'erro');
    return;
  }
  if (!validarNome(nome)) {
    mostrar('msgLogin', 'Informe o nome com pelo menos 3 letras.', 'erro');
    return;
  }
  if (!dados.usuarios[matricula]) {
    dados.usuarios[matricula] = { matricula: matricula, nome: nome, itens: [], multa: 0, historico: [] };
  }
  dados.sessao = matricula;
  salvar();
  mostrar('msgLogin', '');
  renderizar();
}

function sair() {
  dados.sessao = null;
  salvar();
  renderizar();
}

function liberarExemplar(livro) {
  const filaDoLeitor = encontrarFilaDoLivro(livro.id);
  if (livro.filaOutros > 0) {
    livro.filaOutros -= 1;
    return 'O exemplar foi para o próximo leitor da fila.';
  }
  if (filaDoLeitor) {
    filaDoLeitor.item.tipo = 'reserva';
    filaDoLeitor.item.prazoDia = dados.hoje + DIAS_RETIRADA;
    filaDoLeitor.usuario.historico.unshift(formatarData(dados.hoje) + ' · Chegou sua vez: ' + livro.titulo + ' reservado');
    return 'O exemplar foi reservado para ' + filaDoLeitor.usuario.nome + ', que estava na fila.';
  }
  livro.disponiveis += 1;
  return 'O exemplar voltou para a estante.';
}

function encontrarFilaDoLivro(livroId) {
  let encontrado = null;
  Object.keys(dados.usuarios).forEach(function (matricula) {
    const usuario = dados.usuarios[matricula];
    usuario.itens.forEach(function (item) {
      if (!encontrado && item.tipo === 'fila' && item.livroId === livroId) {
        encontrado = { usuario: usuario, item: item };
      }
    });
  });
  return encontrado;
}

function reservar(livroId) {
  const usuario = usuarioAtual();
  if (!usuario) {
    mostrar('msgCatalogo', 'Entre com sua matrícula para reservar.', 'erro');
    return;
  }
  const livro = livroPorId(livroId);
  const resultado = podeReservar(livro, usuario.itens, usuario.multa);
  if (!resultado.ok) {
    mostrar('msgCatalogo', resultado.motivo, 'erro');
    return;
  }
  if (resultado.acao === 'reserva') {
    livro.disponiveis -= 1;
    usuario.itens.push({ livroId: livro.id, tipo: 'reserva', prazoDia: dados.hoje + DIAS_RETIRADA, renovado: false });
    usuario.historico.unshift(formatarData(dados.hoje) + ' · Reservou ' + livro.titulo);
    mostrar('msgCatalogo', 'Reserva feita. Retire o livro no balcão até ' + formatarData(dados.hoje + DIAS_RETIRADA) + '.', 'ok');
  } else {
    usuario.itens.push({ livroId: livro.id, tipo: 'fila', prazoDia: null, renovado: false });
    usuario.historico.unshift(formatarData(dados.hoje) + ' · Entrou na fila de ' + livro.titulo);
    mostrar('msgCatalogo', 'Você entrou na fila de espera. Posição: ' + (livro.filaOutros + 1) + 'º.', 'ok');
  }
  salvar();
  renderizar();
}

function removerItem(usuario, item) {
  usuario.itens.splice(usuario.itens.indexOf(item), 1);
}

function cancelar(indice) {
  const usuario = usuarioAtual();
  const item = usuario.itens[indice];
  const livro = livroPorId(item.livroId);
  removerItem(usuario, item);
  if (item.tipo === 'reserva') {
    liberarExemplar(livro);
    usuario.historico.unshift(formatarData(dados.hoje) + ' · Cancelou a reserva de ' + livro.titulo);
  } else {
    usuario.historico.unshift(formatarData(dados.hoje) + ' · Saiu da fila de ' + livro.titulo);
  }
  salvar();
  renderizar();
}

function renovar(indice) {
  const usuario = usuarioAtual();
  const item = usuario.itens[indice];
  const livro = livroPorId(item.livroId);
  const resultado = podeRenovar(item, livro, dados.hoje, usuario.multa);
  if (!resultado.ok) {
    mostrar('msgCatalogo', resultado.motivo, 'erro');
    return;
  }
  item.prazoDia += DIAS_RENOVACAO;
  item.renovado = true;
  usuario.historico.unshift(formatarData(dados.hoje) + ' · Renovou ' + livro.titulo);
  mostrar('msgCatalogo', 'Empréstimo renovado até ' + formatarData(item.prazoDia) + '.', 'ok');
  salvar();
  renderizar();
}

function registrarRetirada(indice) {
  const usuario = usuarioAtual();
  const item = usuario.itens[indice];
  item.tipo = 'emprestimo';
  item.prazoDia = dados.hoje + DIAS_EMPRESTIMO;
  usuario.historico.unshift(formatarData(dados.hoje) + ' · Retirou ' + livroPorId(item.livroId).titulo);
  mostrar('msgBib', 'Retirada registrada. Devolução até ' + formatarData(item.prazoDia) + '.', 'ok');
  salvar();
  renderizar();
}

function registrarDevolucao(indice) {
  const usuario = usuarioAtual();
  const item = usuario.itens[indice];
  const livro = livroPorId(item.livroId);
  const multa = calcularMulta(item.prazoDia, dados.hoje);
  removerItem(usuario, item);
  usuario.multa += multa;
  const destino = liberarExemplar(livro);
  usuario.historico.unshift(formatarData(dados.hoje) + ' · Devolveu ' + livro.titulo + (multa > 0 ? ' com multa de ' + formatarMoeda(multa) : ''));
  mostrar('msgBib', 'Devolução registrada' + (multa > 0 ? ', multa de ' + formatarMoeda(multa) : ', sem multa') + '. ' + destino, 'ok');
  salvar();
  renderizar();
}

function pagarMulta() {
  const usuario = usuarioAtual();
  if (!usuario || usuario.multa === 0) {
    mostrar('msgBib', 'Não há multa pendente para o leitor conectado.', 'erro');
    return;
  }
  usuario.historico.unshift(formatarData(dados.hoje) + ' · Pagou multa de ' + formatarMoeda(usuario.multa));
  usuario.multa = 0;
  mostrar('msgBib', 'Pagamento registrado.', 'ok');
  salvar();
  renderizar();
}

function devolucaoOutroLeitor() {
  const livro = livroPorId(document.getElementById('livroOutro').value);
  const emprestadosOutros = livro.total - livro.disponiveis - exemplaresDoSistema(livro.id);
  if (emprestadosOutros <= 0) {
    mostrar('msgBib', 'Nenhum exemplar deste livro está com outro leitor.', 'erro');
    return;
  }
  const destino = liberarExemplar(livro);
  mostrar('msgBib', 'Devolução registrada. ' + destino, 'ok');
  salvar();
  renderizar();
}

function exemplaresDoSistema(livroId) {
  let total = 0;
  Object.keys(dados.usuarios).forEach(function (matricula) {
    dados.usuarios[matricula].itens.forEach(function (item) {
      if (item.livroId === livroId && (item.tipo === 'reserva' || item.tipo === 'emprestimo')) {
        total += 1;
      }
    });
  });
  return total;
}

function avancarDia() {
  dados.hoje += 1;
  Object.keys(dados.usuarios).forEach(function (matricula) {
    const usuario = dados.usuarios[matricula];
    usuario.itens.slice().forEach(function (item) {
      if (item.tipo === 'reserva' && dados.hoje > item.prazoDia) {
        const livro = livroPorId(item.livroId);
        removerItem(usuario, item);
        liberarExemplar(livro);
        usuario.historico.unshift(formatarData(dados.hoje) + ' · Reserva de ' + livro.titulo + ' expirou');
      }
    });
  });
  mostrar('msgBib', 'Agora é ' + formatarData(dados.hoje) + '.', 'ok');
  salvar();
  renderizar();
}

function reiniciar() {
  dados = estadoInicial();
  salvar();
  mostrar('msgBib', 'Dados reiniciados.', 'ok');
  mostrar('msgCatalogo', '');
  renderizar();
}

function rotuloItem(item) {
  const livro = livroPorId(item.livroId);
  if (item.tipo === 'reserva') {
    return livro.titulo + ' · Reservado, retirar até ' + formatarData(item.prazoDia);
  }
  if (item.tipo === 'fila') {
    return livro.titulo + ' · Na fila de espera, posição ' + (livro.filaOutros + 1) + 'º';
  }
  const atraso = dados.hoje - item.prazoDia;
  if (atraso > 0) {
    return livro.titulo + ' · Atrasado ' + atraso + (atraso === 1 ? ' dia' : ' dias') + ', multa prevista ' + formatarMoeda(calcularMulta(item.prazoDia, dados.hoje));
  }
  return livro.titulo + ' · Emprestado, devolver até ' + formatarData(item.prazoDia) + (item.renovado ? ' (renovado)' : '');
}

function botao(texto, acao) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'botao-secundario';
  b.textContent = texto;
  b.addEventListener('click', acao);
  return b;
}

function renderizarConta() {
  const usuario = usuarioAtual();
  document.getElementById('areaLogin').hidden = !!usuario;
  document.getElementById('areaConta').hidden = !usuario;
  const lista = document.getElementById('itensConta');
  lista.innerHTML = '';
  if (!usuario) {
    return;
  }
  document.getElementById('saudacao').textContent = 'Olá, ' + usuario.nome;
  document.getElementById('resumoConta').textContent = contarAtivos(usuario.itens) + ' de ' + LIMITE_ITENS + ' livros entre reservas e empréstimos · ' + contarFilas(usuario.itens) + ' de ' + LIMITE_FILAS + ' filas de espera';
  const multa = document.getElementById('multa');
  multa.hidden = usuario.multa === 0;
  multa.textContent = 'Multa pendente: ' + formatarMoeda(usuario.multa) + '. Pague no balcão para voltar a reservar.';
  if (usuario.itens.length === 0) {
    const vazio = document.createElement('li');
    vazio.textContent = 'Nenhum livro na sua conta.';
    lista.appendChild(vazio);
  }
  usuario.itens.forEach(function (item, indice) {
    const li = document.createElement('li');
    const texto = document.createElement('span');
    texto.textContent = rotuloItem(item);
    li.appendChild(texto);
    if (item.tipo === 'reserva') {
      li.appendChild(botao('Cancelar reserva', function () { cancelar(indice); }));
    }
    if (item.tipo === 'fila') {
      li.appendChild(botao('Sair da fila', function () { cancelar(indice); }));
    }
    if (item.tipo === 'emprestimo') {
      li.appendChild(botao('Renovar', function () { renovar(indice); }));
    }
    lista.appendChild(li);
  });
}

function renderizarCatalogo() {
  const busca = document.getElementById('busca').value.trim().toLowerCase();
  const genero = document.getElementById('genero').value;
  const area = document.getElementById('livros');
  area.innerHTML = '';
  const visiveis = dados.livros.filter(function (livro) {
    const texto = (livro.titulo + ' ' + livro.autor).toLowerCase();
    return texto.indexOf(busca) !== -1 && (!genero || livro.genero === genero);
  });
  if (visiveis.length === 0) {
    const vazio = document.createElement('p');
    vazio.textContent = 'Nenhum livro encontrado.';
    area.appendChild(vazio);
  }
  visiveis.forEach(function (livro) {
    const cartao = document.createElement('article');
    cartao.className = 'livro';
    const titulo = document.createElement('h3');
    titulo.textContent = livro.titulo;
    const info = document.createElement('p');
    info.className = 'info';
    info.textContent = livro.autor + ' · ' + livro.genero + ' · ' + livro.ano;
    const situacao = document.createElement('p');
    situacao.className = 'situacao';
    let acao = 'Reservar';
    if (livro.consulta) {
      situacao.textContent = 'Consulta local · ' + livro.total + (livro.total === 1 ? ' exemplar' : ' exemplares');
      acao = 'Só consulta';
    } else if (livro.disponiveis > 0) {
      situacao.textContent = livro.disponiveis + ' de ' + livro.total + ' disponíveis';
    } else {
      situacao.textContent = 'Indisponível · ' + livro.filaOutros + (livro.filaOutros === 1 ? ' leitor' : ' leitores') + ' na fila';
      acao = 'Entrar na fila';
    }
    const b = botao(acao, function () { reservar(livro.id); });
    b.className = 'botao';
    b.disabled = livro.consulta;
    cartao.appendChild(titulo);
    cartao.appendChild(info);
    cartao.appendChild(situacao);
    cartao.appendChild(b);
    area.appendChild(cartao);
  });
}

function renderizarBibliotecario() {
  const usuario = usuarioAtual();
  const lista = document.getElementById('pedidosBib');
  lista.innerHTML = '';
  const pedidos = usuario ? usuario.itens.filter(function (item) { return item.tipo !== 'fila'; }) : [];
  if (pedidos.length === 0) {
    const vazio = document.createElement('li');
    vazio.textContent = usuario ? 'Nenhuma reserva ou empréstimo.' : 'Nenhum leitor conectado.';
    lista.appendChild(vazio);
  }
  if (usuario) {
    usuario.itens.forEach(function (item, indice) {
      if (item.tipo === 'fila') {
        return;
      }
      const li = document.createElement('li');
      const texto = document.createElement('span');
      texto.textContent = rotuloItem(item);
      li.appendChild(texto);
      if (item.tipo === 'reserva') {
        li.appendChild(botao('Registrar retirada', function () { registrarRetirada(indice); }));
      } else {
        li.appendChild(botao('Registrar devolução', function () { registrarDevolucao(indice); }));
      }
      lista.appendChild(li);
    });
  }
  const seletor = document.getElementById('livroOutro');
  const escolhido = seletor.value;
  seletor.innerHTML = '';
  dados.livros.filter(function (livro) { return !livro.consulta; }).forEach(function (livro) {
    const opcao = document.createElement('option');
    opcao.value = livro.id;
    opcao.textContent = livro.titulo;
    seletor.appendChild(opcao);
  });
  if (escolhido) {
    seletor.value = escolhido;
  }
}

function renderizar() {
  document.getElementById('hoje').textContent = formatarData(dados.hoje);
  renderizarConta();
  renderizarCatalogo();
  renderizarBibliotecario();
}

function iniciar() {
  const generos = [];
  LIVROS_INICIAIS.forEach(function (livro) {
    if (generos.indexOf(livro.genero) === -1) {
      generos.push(livro.genero);
    }
  });
  const seletor = document.getElementById('genero');
  generos.forEach(function (genero) {
    const opcao = document.createElement('option');
    opcao.value = genero;
    opcao.textContent = genero;
    seletor.appendChild(opcao);
  });
  document.getElementById('entrar').addEventListener('click', entrar);
  document.getElementById('sair').addEventListener('click', sair);
  document.getElementById('busca').addEventListener('input', renderizarCatalogo);
  document.getElementById('genero').addEventListener('change', renderizarCatalogo);
  document.getElementById('avancarDia').addEventListener('click', avancarDia);
  document.getElementById('pagarMulta').addEventListener('click', pagarMulta);
  document.getElementById('reiniciar').addEventListener('click', reiniciar);
  document.getElementById('devolucaoOutro').addEventListener('click', devolucaoOutroLeitor);
  renderizar();
}

iniciar();
