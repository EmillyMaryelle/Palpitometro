# Palpitometro

Mini-jogo de adivinhação com dino. O dino dá feedback na caixa de diálogo (alto/baixo, perto/longe, vitória/derrota) e mostra uma dica de intervalo. Inclui níveis de dificuldade, tentativa extra no modo difícil, sons, animações e uma barra lateral com nome do jogador e estatísticas persistidas em `localStorage`.

## Estrutura
- `index.html`: layout principal (topbar dentro do jogo com dificuldade e reinício; sidebar com formulário de nome e área do patinho)
- `style.css`: estilos do jogo, HUD, balões, animações e layout lateral
- `game.js`: lógica do jogo, dificuldades, tentativa extra, dicas, estatísticas e armazenamento do nome
- `img/`
  - `fundo.jpg`: fundo do jogo
  - `dino.gif`: dino animado
  - `gatinho.gif`: gato do formulário de nome
  - `patinho.png`: pato das estatísticas

## Como jogar
1. Abra `index.html` em um navegador.
2. Digite seu nome na barra lateral e clique em **Salvar** (o nome fica salvo até limpar o cache).
3. Escolha a dificuldade na barra superior do jogo.
4. Digite um palpite e clique em **Chutar** (ou pressione Enter).
5. Leia o balão do dino para saber se está alto/baixo e veja uma dica: "Tente um número entre L–U".
6. Use **Reiniciar** para uma nova rodada. (Essa função nao apaga seu score/estatisticas no jogo).

## Dificuldades e tentativas
- Fácil: intervalo 1–20, 10 palpites
- Normal: intervalo 1–20, 5 palpites
- Difícil: intervalo 1–50, 3 palpites
  - Se gastar as 3 tentativas, aparece **Tentativa extra** (mais 1 palpite)

## Estatísticas (patinho)
- Mensagem de boas vindas
- Botões:
  - **Modos jogados**: mostra quantas tentativas foram enviadas em cada modo
  - **Acertos**: total de vitórias
  - **Erros**: total de derrotas
- Observação: o contador de modos só aumenta quando um palpite é enviado (não ao iniciar a rodada).

## Atalhos
- Enter envia o palpite
- Tentativa extra no difícil quando aplicável

## Imagens
Use apenas `fundo.jpg` e `dino.gif` no jogo principal; o formulário e estatísticas usam `gatinho.gif` e `patinho.png` na sidebar.
