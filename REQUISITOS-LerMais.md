# Ler+ — Documento de Requisitos (oficial)

**Produto:** Ler+, sistema de reserva de livros da Biblioteca Municipal
**Plataforma:** web (navegadores atuais)
**Versão em teste:** 1.1
**Autor:** Equipe de desenvolvimento da Biblioteca Municipal

> A versão 1.1 foi entregue pela equipe de desenvolvimento para os testes de aceitação. Este é o documento oficial, que serve de referência para dizer se um comportamento é correto ou é um defeito.

---

## 1. Contexto

O Ler+ permite que o leitor da Biblioteca Municipal consulte o catálogo, reserve livros, entre em fila de espera e acompanhe seus empréstimos. O bibliotecário usa o mesmo sistema para registrar retiradas, devoluções e pagamentos de multa.

## 2. Parâmetros

| Parâmetro | Valor |
| --- | --- |
| Prazo para retirar uma reserva | 2 dias |
| Prazo do empréstimo | 14 dias |
| Renovação | 1 vez, por mais 7 dias |
| Limite de livros entre reservas e empréstimos | 3 |
| Limite de filas de espera por leitor | 2 |
| Multa por dia de atraso | R$ 1,50 |
| Multa máxima por devolução | R$ 30,00 |

## 3. Regras de negócio

**RN01 — Acesso.** O leitor entra com a matrícula da carteirinha, que tem exatamente 6 números, e com o nome, com pelo menos 3 letras. A conta é criada no primeiro acesso.

**RN02 — Busca.** O catálogo pode ser filtrado por gênero e pesquisado por título **ou** por autor, sem diferenciar maiúsculas de minúsculas.

**RN03 — Consulta local.** Obras de referência (dicionários e atlas) são de consulta local e não podem ser reservadas.

**RN04 — Reserva.** Se houver exemplar disponível, o leitor pode reservar. A reserva fica guardada por **2 dias** para retirada no balcão.

**RN05 — Expiração.** A reserva que não for retirada em 2 dias expira, e o exemplar volta para a estante ou para o próximo da fila.

**RN06 — Limite de livros.** Cada leitor pode ter no máximo **3 livros somando reservas e empréstimos**.

**RN07 — Fila de espera.** Sem exemplar disponível, o leitor pode entrar na fila de espera e vê sua posição. Cada leitor pode estar em no máximo **2 filas**.

**RN08 — Sem duplicidade.** O mesmo livro não pode aparecer duas vezes na conta do leitor (reserva, empréstimo ou fila).

**RN09 — Chegou a vez.** Quando um exemplar é devolvido e o leitor é o primeiro da fila, a fila vira uma reserva de 2 dias.

**RN10 — Empréstimo.** Na retirada, o empréstimo vale 14 dias.

**RN11 — Renovação.** O empréstimo pode ser renovado **uma única vez**, por mais 7 dias, desde que não esteja atrasado, que o leitor não tenha multa pendente e que ninguém esteja na fila do livro.

**RN12 — Multa.** A devolução feita depois do prazo gera multa de R$ 1,50 por dia de atraso, com máximo de R$ 30,00. **A devolução feita até o último dia do prazo não gera multa.**

**RN13 — Bloqueio por multa.** Com multa pendente, o leitor não pode reservar, entrar em fila de espera nem renovar, até pagar no balcão.

**RN14 — Cancelamento.** O leitor pode cancelar uma reserva ou sair de uma fila. O exemplar ou a vaga é liberado na hora.

## 4. Requisitos não-funcionais

**RNF01 — Persistência.** Os dados do leitor continuam salvos depois de sair do sistema ou recarregar a página.

**RNF02 — Acessibilidade.** Todos os controles podem ser usados só com o teclado.

**RNF03 — Segurança.** Tudo o que o leitor digita é exibido como texto. Código HTML ou JavaScript digitado nunca é executado.

## 5. Critério de aceitação da versão 1.1

A versão 1.1 pode ir para produção se não houver nenhum defeito de severidade crítica ou alta aberto.
