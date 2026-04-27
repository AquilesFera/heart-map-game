# Plano atual

Site único `public/site.html` com:

1. **Login com senha "Florsinha"** (lembra no localStorage)
2. **🌷 Jardim do Nosso Amor** — jogo 2D online (canvas + Realtime), substituiu a Visual Novel
3. **🃏 Memória online** turn-based (Realtime)

## Jogo 2D — Jardim do Nosso Amor

- Canvas 880x495 com gramado, caminhos, árvore, banco, laguinho e flores.
- Cada celular controla 1 personagem (🤴 Aquiles azul / 👑 Giovana rosa-vinho), desenhados em pixel art simples com coroinha.
- Controles: setinhas/WASD no teclado + d-pad touch na tela.
- 8 corações 💗 espalhados em pontos fofinhos; **só são coletados quando os DOIS personagens estão pertinho do mesmo coração** (incentiva ficar junto 💕).
- Quando os dois se encostam, balão fofo aparece ("te achei, meu amor 💕" etc).
- Coletando todos → tela final com declaração do Aquiles.
- Botões: "Recomeçar jardim" e "Trocar de personagem".

## Banco

- `game_session` (id='couple'): `ax,ay,adir,amov`, `gx,gy,gdir,gmov`, `hearts` (jsonb), `collected` (jsonb), `messages` (jsonb), `finished`. Realtime ativo, RLS aberto.
- `mem_session` igual antes.
- `vn_session` removida.

## Sincronização

- Posição enviada com throttle ~12 Hz (`update` na tabela).
- Subscribe via `sb.channel('g2').on('postgres_changes', ...)`.
