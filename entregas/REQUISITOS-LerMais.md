# [Nome do app] — Documento de Requisitos v1.0

> **Como usar este modelo:** copie este arquivo para `entregas/REQUISITOS-<nome-do-app>.md` e preencha. Você vai descobrir os requisitos usando o app e lendo o código, como um analista faria com um sistema sem documentação. As **perguntas-guia** em cada seção ajudam a encontrar as regras. Apague as perguntas quando terminar.
>
> Use o `agendafacil/REQUISITOS-AgendaFacil.md` como exemplo de formato.

---

**Produto:** [Nome e uma frase sobre o que faz]
**Plataformas:** [Web, Android, iOS, desktop]
**Versão analisada:** [Versão, data ou hash do commit]
**Autor deste documento:** [Seu nome]
**Como os requisitos foram levantados:** [Uso do app, leitura do código, conversa com quem desenvolveu]

## 1. Contexto

[Para quem é o app, que problema resolve e quem usa cada parte.]

> **Perguntas-guia:** Quem são os usuários? Existem perfis diferentes (cliente, administrador, atendente)? O que a pessoa consegue fazer hoje que não conseguia sem o app?

## 2. Dados e tabelas de referência

[Listas fixas que o app usa: produtos, preços, categorias, planos, horários.]

> **Perguntas-guia:** Existe algum preço, prazo, limite ou lista fixa no código (por exemplo, em um arquivo de dados ou em constantes no topo de um arquivo)? Quais valores aparecem na tela sempre iguais?

## 3. Regras de negócio

Escreva uma regra por item, numerada, com valores exatos. Uma boa regra dá para testar: diz o que acontece, em qual condição e com qual limite.

**RN01 — [Nome curto].** [Descrição da regra, com os números.]

**RN02 — [Nome curto].** [...]

> **Perguntas-guia para achar regras:**
> - Que campos o app pede? Algum é obrigatório? Tem tamanho mínimo, máximo ou formato?
> - Que botões existem? O que acontece em cada um? Algum fica desabilitado em alguma situação?
> - Que mensagens de erro aparecem? Cada mensagem de erro esconde uma regra.
> - Existe algum limite de quantidade, valor, tempo ou tentativas?
> - O que muda com o tempo (prazos, expiração, datas)?
> - O que acontece quando algo acaba (estoque, vagas, saldo)?
> - No código: procure `if`, números soltos e nomes como `LIMITE`, `MAX`, `MIN`, `PRAZO`, `TAXA`.

## 4. Requisitos não-funcionais

**RNF01 — [Desempenho, segurança, privacidade, compatibilidade, acessibilidade...].** [Descrição verificável.]

> **Perguntas-guia:** Em que navegadores ou aparelhos o app precisa funcionar? Ele guarda dados pessoais? Onde? O app funciona só com teclado? Quanto tempo ele pode levar para carregar? Quantos usuários ao mesmo tempo?

## 5. Fora do escopo

[O que o app não faz nesta versão, mesmo que pareça que deveria.]

## 6. Dúvidas e comportamentos estranhos

| # | O que foi observado | Por que é uma dúvida | Pergunta para quem desenvolveu |
| --- | --- | --- | --- |
| 1 | | | |

> **Atenção:** quando você descobre uma regra usando o app, você descobre o que o app **faz**, que nem sempre é o que ele **deveria** fazer. Se algo parecer errado, não transforme em regra: registre aqui como dúvida.

## 7. Critério de aceitação do produto

[Em que condição o app pode ser considerado pronto para uso? Ex.: "nenhum defeito impede o cadastro e o pagamento".]
