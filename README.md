# Ler+ — Testes de aceitação da versão 1.1

A equipe de desenvolvimento da Biblioteca Municipal entregou a **versão 1.1 do Ler+**, o sistema de reserva de livros. Ela vai para produção na semana que vem **se não houver nenhum defeito crítico ou alto aberto**.

Você faz parte do time de teste. Sua missão:

1. Testar a versão 1.1 comparando com o documento oficial de requisitos.
2. Registrar cada defeito como uma **Issue** neste repositório.
3. Escrever o relatório de execução e dizer se a versão pode ir para produção.

## O que tem neste repositório

```
lermais-testes/
├── README.md                          ← este arquivo
├── REQUISITOS-LerMais.md              ← documento oficial: a fonte da verdade
├── DEPURACAO-passo-a-passo.md         ← guia da aula de depuração (06/11)
├── app/                               ← o Ler+ versão 1.1 (abra app/index.html)
├── modelos/
│   ├── RELATORIO-EXECUCAO-modelo.md   ← modelo do relatório de execução
│   └── DEPURACAO-modelo.md            ← modelo do registro de depuração (06/11)
├── entregas/                          ← seu relatório final vai aqui
└── .github/ISSUE_TEMPLATE/            ← modelo do relatório de defeito (Issue)
```

## Passo 1 — Criar o seu repositório

1. No topo desta página, clique em **Use this template → Create a new repository**.
2. Nome: `lermais-testes-nome-sobrenome`.
3. Escolha **Public**. Se escolher Private, adicione o professor como colaborador em **Settings → Collaborators**.
4. Clique em **Create repository**.
5. Clone e abra no VS Code:
   ```
   git clone <link-do-seu-repositorio>
   ```

## Passo 2 — Preparar o bugtracker (uma vez)

1. No **seu** repositório, no site do GitHub, clique na aba **Issues**.
   - Sem a aba? **Settings → General → Features** → marque **Issues**.
2. Clique em **Labels → New label** e crie estas quatro etiquetas:
   - `severidade: crítica`
   - `severidade: alta`
   - `severidade: média`
   - `severidade: baixa`
3. Teste: **Issues → New issue**. Deve aparecer **Relatório de defeito**.

A etiqueta `bug` já existe por padrão.

## Passo 3 — Testar

1. Leia o `REQUISITOS-LerMais.md` inteiro. No VS Code, **Ctrl + Shift + V** mostra o arquivo formatado.
2. Abra `app/index.html` com o **Live Server** (ou com duplo clique, ele funciona sem servidor).
3. Teste uma regra por vez. Use valor limite: o número da regra, um abaixo e um acima.
4. O que aconteceu é diferente do que a regra diz? É defeito: registre na hora.

**Painel do bibliotecário** (no fim da página do app): serve para testar prazos e multas sem esperar os dias passarem.

- **Registrar retirada**: transforma a reserva em empréstimo.
- **Avançar 1 dia**: passa o tempo. A data atual aparece em “Agora é”.
- **Registrar devolução**: devolve o livro e calcula a multa.
- **Registrar pagamento de multa**: zera a multa do leitor.
- **Reiniciar todos os dados**: volta tudo ao começo.

## Passo 4 — Registrar um defeito

1. Tire o print da tela com o erro (Windows: **Win + Shift + S** · Mac: **Cmd + Shift + 4**).
2. **Issues → New issue → Relatório de defeito**.
3. Título depois de `[BUG]`: o problema em uma frase, com o número. Exemplo: `[BUG] Matrícula com 7 números é aceita`.
4. Preencha todas as seções. Os textos cinza do modelo são dicas e não aparecem na Issue publicada.
5. Arraste o print para a seção **Evidência**.
6. À direita, em **Labels**, marque `bug` e a etiqueta de severidade.
7. Clique em **Submit new issue** e anote o número (#1, #2…).

**Um defeito por Issue.** Achou três defeitos na mesma tela? São três Issues.

## Passo 5 — Relatório de execução

1. Copie `modelos/RELATORIO-EXECUCAO-modelo.md` para `entregas/RELATORIO-EXECUCAO-LerMais.md`.
2. Preencha todas as seções. Na seção 1, coloque o número da Issue de cada regra que falhou.
3. Na seção 5, responda: a versão 1.1 pode ir para produção? Justifique com o critério de aceitação do `REQUISITOS-LerMais.md`.
4. Envie:
   ```
   git add .
   git commit -m "docs: relatorio de execucao LerMais"
   git push
   ```

## Aula 2 (06/11) — Depuração: da Issue à correção

Hoje você acha a **causa** de cada defeito no código, corrige e fecha a Issue. O guia completo, com os 3 bugs guiados, está em [`DEPURACAO-passo-a-passo.md`](DEPURACAO-passo-a-passo.md).

**Seu repositório foi criado antes destes arquivos?** Não precisa criar outro:

1. Leia o guia direto aqui, no repositório modelo.
2. Abra `modelos/DEPURACAO-modelo.md` aqui no repositório modelo e clique no botão **Copy raw file** (ícone de copiar, acima do texto).
3. No VS Code, no **seu** repositório, crie o arquivo `entregas/DEPURACAO-LerMais.md` e cole.

**Resumo do dia:**

1. Ferramenta: DevTools (F12) → aba **Sources** → Ctrl + P → `regras.js` → clique no número da linha.
2. Depure os 3 bugs guiados: multa no último dia, limite de 3 livros e renovação dupla.
3. Corrija, salve, clique em **Reiniciar todos os dados** e refaça os passos da Issue.
4. Um commit por bug: `git commit -m "fix: descricao curta (closes #N)"` e `git push`.
5. Preencha `entregas/DEPURACAO-LerMais.md`.

**Checklist da Aula 2:**

- [ ] 3 bugs guiados corrigidos, cada um com o seu commit `closes #N`
- [ ] As Issues corrigidas aparecem como **Closed** no GitHub
- [ ] `entregas/DEPURACAO-LerMais.md` com as 3 fichas e os prints do DevTools
- [ ] Desafio (opcional): mais bugs corrigidos

## Severidade

| Severidade | Quando usar |
| --- | --- |
| Crítica | Segurança, perda de dados, sistema inutilizável |
| Alta | Regra principal errada: limite, multa, bloqueio |
| Média | Regra errada com contorno ou impacto menor |
| Baixa | Texto, visual, detalhe que não muda o resultado |

## Checklist de entrega

- [ ] Etiquetas de severidade criadas
- [ ] Pelo menos 5 Issues de defeito, cada uma com `bug` e severidade
- [ ] `entregas/RELATORIO-EXECUCAO-LerMais.md` preenchido
- [ ] Commit e push feitos (confira no site do GitHub)

## Regras

- O `REQUISITOS-LerMais.md` é a fonte da verdade. Comportamento diferente do documento é defeito.
- Algo que o documento não fala e você acha que poderia ser melhor é **sugestão de melhoria**, não defeito.
- Use apenas dados fictícios.
