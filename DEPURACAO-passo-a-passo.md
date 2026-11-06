# Depuração passo a passo — Ler+ v1.1

Ontem você encontrou os **sintomas**: o que o Ler+ faz de errado. Hoje você encontra a **causa**: a linha do código que faz isso acontecer. Depois corrige, confirma e fecha a Issue.

> Testar mostra **que** existe um defeito. Depurar mostra **onde** e **por quê**.

---

## 1. O método em 6 passos

| # | Passo | O que fazer |
| --- | --- | --- |
| 1 | Reproduzir | Siga os passos da Issue e veja o defeito acontecer de novo |
| 2 | Isolar | Descubra qual ação dispara o defeito e qual função cuida dela |
| 3 | Levantar hipótese | “Acho que o erro está na conta da multa” |
| 4 | Inspecionar | Pause o código com um breakpoint e olhe os valores das variáveis |
| 5 | Corrigir | Mude **só** a linha errada |
| 6 | Confirmar | Refaça os passos da Issue (confirmação) e teste o que está em volta (regressão) |

---

## 2. O DevTools em 5 minutos

### Abrir o código no navegador

1. Abra `app/index.html` com o **Live Server**.
2. Aperte **F12** (Mac: **Cmd + Option + I**).
3. Clique na aba **Sources** (em português: **Fontes**).
4. Aperte **Ctrl + P** (Mac: **Cmd + P**), digite `regras.js` e aperte Enter.

### Colocar um breakpoint

- Clique no **número da linha**, à esquerda do código. Aparece uma marca azul.
- Agora use o app normalmente. Quando o código passar por essa linha, **tudo para** e a linha fica destacada.
- Para tirar o breakpoint, clique de novo no número.

### Os botões de controle (canto superior direito do DevTools)

| Botão | Atalho | O que faz |
| --- | --- | --- |
| ▶ Resume | **F8** | Continua até o próximo breakpoint |
| ⤼ Step over | **F10** | Executa a linha atual e para na próxima |
| ↓ Step into | **F11** | Entra dentro da função chamada nesta linha |
| ↑ Step out | **Shift + F11** | Termina a função atual e volta para quem chamou |

### Os painéis da direita

| Painel | Para que serve |
| --- | --- |
| **Scope** | Mostra todas as variáveis e seus valores **agora** |
| **Watch** | Clique em **+** e digite uma variável ou expressão para acompanhar |
| **Call Stack** | Mostra o caminho: qual função chamou qual |
| **Breakpoints** | Lista todos os breakpoints; dá para desligar sem apagar |

**Dica:** com o código pausado, passe o mouse sobre uma variável para ver o valor.

**Breakpoint condicional:** botão direito no número da linha → **Add conditional breakpoint** → escreva uma condição, por exemplo `livro.id === 'L06'`. Só para quando a condição for verdadeira.

### Atalhos úteis no Console

Com o app aberto, na aba **Console**:

```js
for (let i = 0; i < 14; i++) avancarDia()
```

Avança 14 dias de uma vez, sem clicar 14 vezes.

---

## 3. Antes de começar: regras importantes

1. **Uma Issue por bug.** Se você ainda não tem a Issue do bug que vai depurar, abra agora (aula de ontem).
2. **Depois de cada correção:** salve o arquivo (**Ctrl + S**), espere a página recarregar e clique em **Reiniciar todos os dados** no Painel do bibliotecário. Os dados salvos no navegador foram criados pelo código antigo.
3. **Mude só o necessário.** Corrigir não é reescrever.
4. **Um commit por bug**, com o número da Issue:
   ```
   git add .
   git commit -m "fix: multa cobrada no ultimo dia do prazo (closes #3)"
   git push
   ```
   A palavra `closes #3` fecha a Issue 3 sozinha quando o push chega ao GitHub.

---

## 4. Bug guiado A — Multa cobrada no último dia do prazo (RN12)

**Regra:** a devolução feita até o último dia do prazo não gera multa.

**Reproduzir:**

1. Entre com `123456` e `Ana Lima`.
2. Reserve **Dom Casmurro**.
3. No Painel do bibliotecário, clique em **Registrar retirada**. Anote a data de devolução.
4. No Console, avance 14 dias: `for (let i = 0; i < 14; i++) avancarDia()`
5. Confira em “Agora é” que hoje é a data de devolução.

**Inspecionar:**

1. Em **Sources**, abra `regras.js` e procure a função `calcularMulta` (linha 66).
2. Coloque o breakpoint na linha 66.
3. No Painel do bibliotecário, clique em **Registrar devolução**. O código para.
4. Em **Scope**, anote os valores de `prazoDia` e `diaDevolucao`.
5. Aperte **F10** uma vez e anote o valor de `atraso`.

**Pense:**

- A devolução foi no último dia. Quantos dias de atraso existem de verdade?
- Quantos o código calculou?
- Qual pedaço da conta sobra?

**Confirmar depois de corrigir:**

- Devolver no último dia → **sem multa**.
- Regressão: devolver 1 dia depois → **R$ 1,50**.
- Regressão: devolver 30 dias depois → **R$ 30,00** (o máximo).

---

## 5. Bug guiado B — Limite de 3 livros ignora os empréstimos (RN06)

**Regra:** cada leitor pode ter no máximo 3 livros **somando reservas e empréstimos**.

**Reproduzir:**

1. Clique em **Reiniciar todos os dados** e entre com `123456` e `Ana Lima`.
2. Reserve **Dom Casmurro**, **O Cortiço** e **A Hora da Estrela**.
3. No Painel do bibliotecário, clique em **Registrar retirada** do Dom Casmurro.
4. Reserve **Sagarana**. O app aceita, mas você já tinha 3 livros.

**Inspecionar:**

1. Clique em **Reiniciar todos os dados** e repita os passos 1 a 3.
2. Em `regras.js`, coloque o breakpoint na linha 38: `if (contarAtivos(itens) >= LIMITE_ITENS)`.
3. Em **Watch**, clique em **+** e adicione `contarAtivos(itens)`.
4. Clique em **Reservar** no Sagarana. O código para.
5. Em **Scope**, abra `itens` e veja o `tipo` de cada um.
6. Compare: quantos itens existem e quanto `contarAtivos(itens)` devolve?
7. Aperte **F11** para entrar na função `contarAtivos`.

**Pense:**

- Quais tipos de item a função conta?
- Quais deveria contar, segundo a RN06?
- Fila de espera conta no limite de livros?

**Confirmar depois de corrigir:**

- Com 1 empréstimo e 2 reservas, a 4ª reserva é **recusada**.
- Regressão: com 2 livros, a 3ª reserva ainda é **aceita**.
- Regressão: entrar numa fila não conta no limite de livros.

---

## 6. Bug guiado C — Empréstimo renovado duas vezes (RN11)

**Regra:** o empréstimo pode ser renovado **uma única vez**.

**Reproduzir:**

1. Clique em **Reiniciar todos os dados** e entre com `123456` e `Ana Lima`.
2. Reserve **Sagarana** e clique em **Registrar retirada** no painel.
3. Na sua conta, clique em **Renovar**. Depois clique em **Renovar** de novo. O app aceita.

**Inspecionar:**

1. Clique em **Reiniciar todos os dados** e faça até a primeira renovação.
2. Em `regras.js`, coloque o breakpoint na linha 50, a primeira da função `podeRenovar`.
3. Clique em **Renovar** pela segunda vez. O código para.
4. Em **Scope**, abra `item` e veja o valor de `renovado`.
5. Aperte **F10** linha por linha e observe cada `if`.

**Pense:**

- O app sabe que o empréstimo já foi renovado? Onde está essa informação?
- Algum `if` olha para ela?
- O que precisa ser acrescentado, e em que lugar da função?

**Confirmar depois de corrigir:**

- A 2ª renovação é **recusada**, com mensagem.
- Regressão: a 1ª renovação ainda funciona e soma 7 dias.
- Regressão: empréstimo atrasado continua sem poder renovar.

---

## 7. Desafio — os outros bugs

Agora com menos dica. Use o mesmo método.

| Bug | Regra | Onde procurar | Dica |
| --- | --- | --- | --- |
| Reserva guardada por 3 dias | RN04 | `js/dados.js` | O professor mostrou este no começo da aula |
| Matrícula de 5 números aceita | RN01 | `regras.js` · `validarMatricula` | No Console, teste `validarMatricula('12345')` |
| Entra numa 3ª fila | RN07 | `regras.js` · `podeReservar` | Compare com a linha do limite de livros |
| Com multa, ainda entra em fila | RN13 | `regras.js` · `podeReservar` | Use F10 com um livro **indisponível**. Por qual caminho o código passa? |
| Busca por autor não acha nada | RN02 | `app.js` · `renderizarCatalogo` | O que é comparado com o texto da busca? |
| Nome com HTML vira negrito | RNF03 | `app.js` · `renderizarConta` | Lembra do `innerHTML` e do `textContent`? |

---

## 8. Entrega

1. Copie `modelos/DEPURACAO-modelo.md` para `entregas/DEPURACAO-LerMais.md`.
2. Preencha uma ficha para cada bug que você depurou (pelo menos os 3 guiados).
3. Cada correção num commit com `closes #N`.
4. Confira no GitHub: as Issues corrigidas aparecem como **Closed**.
