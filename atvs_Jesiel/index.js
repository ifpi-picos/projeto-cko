const fs = require("fs");
const readline = require("readline-sync");

function verificarRecorde(pontuacao) {
  const recordeAtual = fs.readFileSync("recorde.txt", "utf-8");

  if (recordeAtual === "" || pontuacao > parseInt(recordeAtual)) {
    fs.writeFileSync("recorde.txt", pontuacao.toString(), "utf-8");
    return true;
  }

  return false;
}

function exibirOpcoes() {
  console.log("***********************************************************");
  console.log("***********************************************************");
  console.log("0 - Sair");
  console.log("1 - Jogar novamente");
}

let jogarNovamente = true;

while (jogarNovamente) {
  console.log("************************************");
  console.log("** ADS 2023.1 - IFPI Campus Picos **");
  console.log("****** Aluno: <Nome do aluno> ******");
  console.log("* Bem vindo ao Jogo de Adivinhação *");
  console.log("************************************");

  const jogador = readline.question("Qual o seu nome? ");

  console.log("Qual o nível de dificuldade?");
  console.log("(1) Fácil (2) Médio (3) Difícil");
  const nivelDificuldade = readline.question("Informe o nível: ");

  let numChutes;
  let pontosPorChute;

  switch (parseInt(nivelDificuldade)) {
    case 1:
      numChutes = 10;
      pontosPorChute = 10;
      break;
    case 2:
      numChutes = 5;
      pontosPorChute = 20;
      break;
    case 3:
      numChutes = 4;
      pontosPorChute = 25;
      break;
    default:
      console.log("Nível de dificuldade inválido. Definindo como Fácil.");
      numChutes = 10;
      pontosPorChute = 10;
      break;
  }

  console.log("Nível de dificuldade escolhido: " + nivelDificuldade);

  const numeroSecreto = Math.floor(Math.random() * 99) + 1;

  let acertou = false;
  let numTentativas = 0;
  let pontuacao = 100;

  while (!acertou && numTentativas < numChutes) {
    numTentativas++;

    console.log("Tentativa " + numTentativas);
    const palpite = readline.question("Qual é o seu chute, " + jogador + "? ");

    if (parseInt(palpite) < 0) {
      console.log(jogador + ", você não pode chutar números negativos.");
      numTentativas--;
      continue;
    }

    console.log(jogador + ", seu chute foi " + palpite);

    if (parseInt(palpite) === numeroSecreto) {
      console.log("Parabéns, " + jogador + "! Você acertou em " + numTentativas + " tentativas!");

      if (verificarRecorde(pontuacao)) {
        console.log("Você é o novo recordista de pontos com " + pontuacao + " pontos!");
      } else {
        const recordeAtual = fs.readFileSync("recorde.txt", "utf-8");
        console.log("Sua pontuação foi " + pontuacao + " ficando abaixo do recorde atual que é de " + recordeAtual + " pontos.");
      }

      acertou = true;
    } else if (parseInt(palpite) < numeroSecreto) {
      console.log(jogador + ", você errou! Seu chute foi menor que o número secreto.");
      pontuacao -= pontosPorChute;
    } else {
      console.log(jogador + ", você errou! Seu chute foi maior que o número secreto.");
      pontuacao -= pontosPorChute;
    }
  }

  if (!acertou) {
    pontuacao = 0;
    console.log("Você perdeu! Tente novamente!");
  }

  console.log("Pontuação final: " + pontuacao);

  exibirOpcoes();
  const opcao = readline.question("Escolha uma opção: ");

  if (opcao === "0") {
    jogarNovamente = false;
    console.log("Obrigado por jogar! Até a próxima!");
  } else if (opcao === "1") {
    console.log("Iniciando novo jogo...");
  } else {
    console.log("Opção inválida. Encerrando o jogo.");
    jogarNovamente = false;
  }
}