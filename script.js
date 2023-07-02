// Array para armazenar as transações
let transacoes = [];
  
// Referências aos elementos HTML
const form = document.getElementById('form');
const tipoInput = document.getElementById('tipo');
const descricaoInput = document.getElementById('descricao');
const valorInput = document.getElementById('valor');
const dataInput = document.getElementById('data');
const listaTransacoes = document.getElementById('lista-transacoes');
const saldoReceita = document.getElementById('saldo-receita');
const saldoGasto = document.getElementById('saldo-gasto');
const mensagem = document.getElementById('mensagem');
const total = document.getElementById('total');

// Função para formatar o valor em moeda
function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para formatar a data
function formatarData(data) {
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const [ano, mes, dia] = data.split('-');
const dataFormatada = new Date(`${ano}-${mes}-${dia}T00:00:00`);
return dataFormatada.toLocaleDateString('pt-BR', options);
}


// Função para atualizar o saldo
function atualizarSaldo() {
  let totalReceita = 0;
  let totalGasto = 0;

  for (let transacao of transacoes) {
    if (transacao.tipo === 'receita') {
      totalReceita += transacao.valor;
    } else if (transacao.tipo === 'gasto') {
      totalGasto += transacao.valor;
    }
  }

  const saldo = totalReceita - totalGasto;

  saldoReceita.textContent = formatarValor(totalReceita);
  saldoGasto.textContent = formatarValor(totalGasto);

  if (saldo >= 0) {
    total.textContent = formatarValor(0);
    total.textContent = formatarValor(saldo);
    total.style.color = 'green'
  } else {
    total.textContent = formatarValor(0);
    total.textContent = formatarValor(saldo);
    total.style.color = 'red'
  }
}


// Função para exibir as transações na lista
function exibirTransacoes() {
  transacoes.sort((a, b) => new Date(a.data) - new Date(b.data));
  listaTransacoes.innerHTML = '';

  for (let transacao of transacoes) {
    const item = document.createElement('li');
    item.className = 'transacao';

    const descricao = document.createElement('span');
    descricao.className = 'descricao';
    descricao.textContent = transacao.descricao;

    const valor = document.createElement('span');
    valor.className = 'valor';
    valor.textContent = formatarValor(transacao.valor);

    const data = document.createElement('span');
    data.className = 'data';
    data.textContent = formatarData(transacao.data);

    const acoes = document.createElement('div');
    acoes.className = 'acoes';

    const editarBotao = document.createElement('button');
    editarBotao.textContent = 'Editar';
    editarBotao.addEventListener('click', () => editarTransacao(transacao.id));

    const excluirBotao = document.createElement('button');
    excluirBotao.textContent = 'Excluir';
    excluirBotao.addEventListener('click', () => excluirTransacao(transacao.id));

    acoes.appendChild(editarBotao);
    acoes.appendChild(excluirBotao);

    item.appendChild(descricao);
    item.appendChild(valor);
    item.appendChild(data);
    item.appendChild(acoes);

    listaTransacoes.appendChild(item);
  }
}

// Função para adicionar uma nova transação
function adicionarTransacao(event) {
  event.preventDefault();

  const tipo = tipoInput.value;
  const descricao = descricaoInput.value;
  const valor = parseFloat(valorInput.value);
  const data = dataInput.value;

  if (descricao.trim() === '' || isNaN(valor) || data.trim() === '') {
    exibirMensagem('Preencha todos os campos', 'error');
    return;
  }

  const transacao = {
    id: Date.now(),
    tipo,
    descricao,
    valor,
    data
  };

  transacoes.push(transacao);
  localStorage.setItem('transacoes', JSON.stringify(transacoes));

  exibirMensagem('Transação adicionada com sucesso', 'success');

  form.reset();
  atualizarSaldo();
  exibirTransacoes();
}

// Função para editar uma transação
function editarTransacao(id) {
  const transacao = transacoes.find(transacao => transacao.id === id);

  tipoInput.value = transacao.tipo;
  descricaoInput.value = transacao.descricao;
  valorInput.value = transacao.valor;
  dataInput.value = transacao.data;

  excluirTransacao(id);
}

// Função para excluir uma transação
function excluirTransacao(id) {
  transacoes = transacoes.filter(transacao => transacao.id !== id);
  localStorage.setItem('transacoes', JSON.stringify(transacoes));

  exibirMensagem('Transação excluída com sucesso', 'success');

  atualizarSaldo();
  exibirTransacoes();
}

// Função para exibir mensagem de sucesso ou erro
function exibirMensagem(mensagemTexto, tipo) {
  mensagem.textContent = mensagemTexto;
  mensagem.className = `mensagem ${tipo}`;

  setTimeout(() => {
    mensagem.textContent = '';
    mensagem.className = 'mensagem';
  }, 3000);
}

// Evento de envio do formulário
form.addEventListener('submit', adicionarTransacao);

// Verificar se há transações salvas no localStorage
const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes'));

if (transacoesSalvas) {
  transacoes = transacoesSalvas;
  exibirTransacoes();
  atualizarSaldo();
}
