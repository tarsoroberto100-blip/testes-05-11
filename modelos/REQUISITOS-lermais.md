# [Nome do app] — Documento de Requisitos v1.0

> **Como usar este modelo:** copie este arquivo para `entregas/REQUISITOS-<nome-do-app>.md` e preencha. Você vai descobrir os requisitos usando o app e lendo o código, como um analista faria com um sistema sem documentação. As **perguntas-guia** em cada seção ajudam a encontrar as regras. Apague as perguntas quando terminar.
>
> Use o `agendafacil/REQUISITOS-AgendaFacil.md` como exemplo de formato.

---

**Produto:** [Ler+ reserva de livro]
**Plataformas:** [Web]
**Versão analisada:** [a03bdd48a9a98e65a0faff7f98f9a550d9647c70]
**Autor deste documento:** [Tarso]
**Como os requisitos foram levantados:** [Uso do app, leitura do código, conversa com quem desenvolveu]

## 1. Contexto

[Para quem é o app, que problema resolve e quem usa cada parte.]
o app é destinado para pessoas que gostam de ler, o app disponibiliza de forma pratica a reserva de livros facilitando o dia dia de quem gosta de ler.

> **Perguntas-guia:** Quem são os usuários? Existem perfis diferentes (cliente, administrador, atendente)? O que a pessoa consegue fazer hoje que não conseguia sem o app?
Usuarios: cliente, administrador.
ela pode ler livros da sua casa sem se descolar a uma biblioteca.

## 2. Dados e tabelas de referência

[Listas fixas que o app usa: produtos, preços, categorias, planos, horários.]
identificação do leitor, filtros do catalogo, controles administrativos.

> **Perguntas-guia:** Existe algum preço, prazo, limite ou lista fixa no código (por exemplo, em um arquivo de dados ou em constantes no topo de um arquivo)? Quais valores aparecem na tela sempre iguais?

## 3. Regras de negócio

Escreva uma regra por item, numerada, com valores exatos. Uma boa regra dá para testar: diz o que acontece, em qual condição e com qual limite.

RN01 — Formato da matrícula do leitor. O campo de matrícula do leitor na área de login exige obrigatoriamente um identificador textual com o formato de 6 números.

RN02 — Autenticação de acesso. Para entrar no sistema e visualizar a área da conta, o usuário deve preencher tanto o campo de matrícula (6 números) quanto o campo de nome.

RN03 — Filtragem e busca no catálogo. O catálogo de livros deve permitir refinar os resultados simultaneamente por meio de uma barra de busca textual (título ou autor) e de um seletor suspenso de gêneros literários.

RN04 — Restrição de visualização de multas e pedidos. A seção de multas do usuário deve permanecer oculta por padrão (hidden) e só é exibida caso haja alguma penalidade ativa vinculada à conta.

RN05 — Controle operacional diário pelo bibliotecário. O painel do bibliotecário deve disponibilizar uma função explícita de "Avançar 1 dia" para simular a passagem do tempo e o vencimento de prazos/multas no sistema.

RN06 — Gestão financeira de penalidades. O bibliotecário possui permissão exclusiva para registrar o pagamento de multas aplicadas aos leitores através de um botão de ação rápida dedicado.

RN07 — Registro de devoluções externas. O sistema permite que o bibliotecário registre devoluções de livros feitas por outros leitores selecionando o item correspondente em um menu suspenso de devolução.

RN08 — Reinicialização geral dos dados. O painel do bibliotecário deve conter um mecanismo de reinicialização total ("Reiniciar todos os dados") capaz de restaurar o sistema ao estado inicial de fábrica.

> **Perguntas-guia para achar regras:**
> - Que campos o app pede? Algum é obrigatório? Tem tamanho mínimo, máximo ou formato?
> - Que botões existem? O que acontece em cada um? Algum fica desabilitado em alguma situação?
> - Que mensagens de erro aparecem? Cada mensagem de erro esconde uma regra.
> - Existe algum limite de quantidade, valor, tempo ou tentativas?
> - O que muda com o tempo (prazos, expiração, datas)?
> - O que acontece quando algo acaba (estoque, vagas, saldo)?
> - No código: procure `if`, números soltos e nomes como `LIMITE`, `MAX`, `MIN`, `PRAZO`, `TAXA`.

## 4. Requisitos não-funcionais

RNF01 — Compatibilidade web moderna. O sistema deve ser estruturado em HTML5 semântico com suporte a atributos modernos de acessibilidade e ocultação de elementos (hidden, role="alert"), rodando em qualquer navegador web padrão atualizado.

RNF02 — Separação modular de código (Arquitetura). A aplicação deve manter separação estrita entre estrutura visual (index.html), estilização externa (css/estilo.css) e lógica de scripts desacoplada (js/dados.js, js/regras.js, js/app.js).

RNF03 — Usabilidade responsiva e dinâmica. O layout principal deve ser adaptado para diferentes tamanhos de tela (dispositivos móveis e desktops), suportando campos de busca em tempo real e atualização dinâmica de mensagens de alerta sem recarregamento da página.

> **Perguntas-guia:** Em que navegadores ou aparelhos o app precisa funcionar? Ele guarda dados pessoais? Onde? O app funciona só com teclado? Quanto tempo ele pode levar para carregar? Quantos usuários ao mesmo tempo?

## 5. Fora do escopo

[O que o app não faz nesta versão, mesmo que pareça que deveria.]
Processamento de pagamentos de multas via gateway de pagamento online integrado (nesta versão, o pagamento é registrado manualmente pelo bibliotecário).

Sistema de cadastro de novos leitores diretamente pela interface pública web (pressupõe-se que a matrícula seja emitida previamente pela prefeitura/biblioteca).

## 6. Dúvidas e comportamentos estranhos

| # | O que foi observado | Por que é uma dúvida | Pergunta para quem desenvolveu |
| --- | --- | --- | --- |
| 1 | | O campo de matrícula aceita type="text" com placeholder "6 números", mas sem validação estrita em HTML nativo.|O usuário pode digitar letras ou menos de 6 dígitos antes de acionar o script.| A validação dos 6 números é feita inteiramente via JavaScript (regras.js) ou deveria ter restrição de tipo/pattern no HTML?.|

| 2 | | O painel do bibliotecário utiliza a tag <details>.| Qualquer usuário físico no terminal da biblioteca pode expandir a tag se ela não estiver protegida por senha.| Existe alguma camada de autenticação ou nível de acesso (senha) para o painel do bibliotecário ou ele fica visível publicamente?|

> **Atenção:** quando você descobre uma regra usando o app, você descobre o que o app **faz**, que nem sempre é o que ele **deveria** fazer. Se algo parecer errado, não transforme em regra: registre aqui como dúvida.

## 7. Critério de aceitação do produto

[Em que condição o app pode ser considerado pronto para uso? Ex.: "nenhum defeito impede o cadastro e o pagamento".]

O sistema será considerado pronto para homologação e uso na Biblioteca Municipal quando um leitor conseguir realizar seu login com matrícula válida de 6 dígitos, consultar e filtrar livros no catálogo sem falhas, e quando o bibliotecário conseguir gerenciar o avanço dos dias, registrar devoluções e limpar dados operacionais por meio do painel dedicado sem corromper o estado dos dados.
