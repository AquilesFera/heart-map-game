
# Plano — Site Giovana com sistema de salas online

Tudo continua em `public/site.html` (single file, mais fácil de iterar). O site atual já roda nesse arquivo com Supabase via CDN — vou manter essa base e reescrever as partes necessárias sem quebrar Hero, História, Coisinhas, Carta, Razões, Frases, Músicas e Quiz.

## 1. Login (ajuste leve)

- Aceitar `Florsinha` e `florsinha` (case-insensitive — já é, manter).
- Trocar textos:
  - Título do gate e da aba: "Site Giovana" no lugar de qualquer "Site do nosso amor".
  - Remover "amor" das frases do gate e dos botões de UI principais (mantendo o tom carinhoso só nas seções pessoais já existentes — Carta, Razões, etc., porque foram escritas pelo usuário).
- Persistir no `localStorage` como hoje.
- Após entrar, em vez de cair direto no jardim, mostrar a **tela de Sala**.

Nota: "login real com banco" — usar autenticação anônima do Supabase pra ter um `user_id` por dispositivo (sem email/senha, mantendo a senha "Florsinha" como gate). Isso dá um id estável que vira `player_id` na sala.

## 2. Sistema de Salas (core novo)

Substitui a área que hoje vai direto pro Jardim/Memória.

Tela de sala (depois do gate):
- Botão **Criar sala** → gera código de 6 dígitos numéricos, mostra grande na tela com botão "copiar".
- Botão **Entrar em sala** → input de 6 dígitos, valida, conecta.
- Botão "sair da sala" sempre visível depois de entrar.

Comportamento:
- Ao entrar/criar: esconde tela de sala e mostra **HUD do jogo** (Jardim + Memória + Loja).
- Sala aceita até 2 jogadores. O primeiro a entrar escolhe lado (🤴 Aquiles / 👑 Giovana); o segundo recebe o lado restante automaticamente.
- Estado da sala (posições, corações, dinheiro, transformações, cenário atual, inventário) sincronizado por Realtime.

Tabela nova `room`:
- `code` (text, PK, 6 dígitos)
- `player_a` (uuid, nullable) — Aquiles
- `player_g` (uuid, nullable) — Giovana
- `scene` (text, default `jardim`) — `jardim | praia | cinema | zoo | trabalho`
- `ax, ay, adir, amov` / `gx, gy, gdir, gmov` — posições
- `hearts` (jsonb) — corações spawnados ativos `[{id,x,y}]`
- `money_a` (numeric, default 0) — dinheiro do Aquiles
- `coins_g` (numeric, default 0) — corações coletados pela Giovana
- `inv_g` (jsonb) — itens dela `{flor:n, choco:n, nescau:n, japa:n, bebe:n, beicinho:n, ...}`
- `form_g` (text, nullable) — transformação ativa: `bebe | beicinho | null`
- `actions` (jsonb) — fila curta de eventos efêmeros (beijo, entrega, balão), com timestamp pra animar nos dois lados
- `updated_at` (timestamptz)
- RLS: aberto (mesmo padrão das tabelas atuais — quem tem o código entra). Realtime ativado.

## 3. Jogo do Jardim — rework

Mantém o canvas e os controles touch/teclado de hoje, mas:
- Personagens com sprites mais expressivos (ainda pixel-art simples desenhada no canvas).
- **Botão "Beijo 💋"** na HUD: quando os dois estão próximos, faz animação de coraçõezinhos saindo dos dois e som leve (opcional). Sincronizado via `actions`.
- Outras interações leves: "Acenar 👋", "Abraçar 🤗" (animação curta).
- **Cenários** (botões no topo do canvas):
  - 🌷 Jardim (atual, com gramado/flor/banco)
  - 🏖️ Praia (areia, mar, sol, guarda-sol)
  - 🎬 Cinema (poltronas, telão escuro, pipoca)
  - 🦁 Zoológico (jaulas estilizadas, árvores)
  - 💻 Trabalho do Aquiles (mesa + PC) — **acessível só pelo Aquiles** (botão escondido pra Giovana)
- Mudança de cenário sincroniza pra os dois (`scene` na tabela). Cenário escolhido reseta posições pra pontos iniciais coerentes com o cenário.

## 4. Sistema de Corações (Giovana)

- Em todos os cenários **exceto Trabalho**: spawn automático de 1 coração 💗 a cada 3s em posição aleatória (limite 12 simultâneos pra não poluir).
- **Só a Giovana** coleta (encostou → soma em `coins_g`, remove o coração da lista).
- HUD da Giovana mostra `💗 saldo`.
- Spawn é controlado pelo "host" (jogador A) num `setInterval` que faz `update` na coluna `hearts`. Coleta também é `update` (otimista local + persiste).

## 5. Sistema de Dinheiro (Aquiles)

- Cenário **💻 Trabalho**: ambiente com mesa e PC.
- Quando o personagem do Aquiles está encostado no PC: a cada segundo acumula `+0.40` em `money_a` (loop local + flush a cada 2s no banco pra não martelar).
- HUD do Aquiles mostra `💵 saldo`.

## 6. Loja

Botão **🛒 Loja** sempre visível na HUD após entrar na sala. Abre modal.

Aba "Para Giovana" (compras pelo Aquiles, paga com `money_a`):
- 🌹 Flor — R$ 5
- 🍫 Chocolate — R$ 8
- 🥛 NescauBoll — R$ 6
- 🍣 Comida japonesa — R$ 20

Comprar não entrega direto: vira **item no inventário do Aquiles** (estado local da sala) e ele precisa **encostar na Giovana** + clicar **"Entregar 🎁"** pra transferir pro `inv_g` dela. Isso aparece como balãozinho ("Aquiles te deu um chocolate 🍫") via `actions`.

Aba "Itens especiais (Giovana)" — paga com `coins_g`, **só ela vê o botão de compra**:
- 5 itens da seção Coisinhas (vou pegar 5 dos itens já listados em `#coisinhas` pra manter coerência com o site).
- 👶 Forma Bebezinha — 30 💗
- 🥺 Forma Beicinho — 30 💗
- + outros 3 cosméticos (ex.: 👑 coroa extra, 🎀 lacinho, ✨ brilho) — 15-25 💗

Comprou forma → vira botão de **"Poder ✨"** na HUD dela: ativa/desativa a transformação. No canvas, troca a aparência do sprite (cor/acessório/escala). Se sprite-swap não rolar bem em algum item, aplico filtro/efeito visual (escala menor pra "bebezinha", boquinha caída desenhada pra "beicinho").

## 7. Sincronização online

Tudo via Supabase Realtime na tabela `room`:
- Movimentos: throttle ~12 Hz (igual hoje).
- Coleta de coração / compra / entrega / transformação / troca de cenário: `update` imediato.
- Ações efêmeras (beijo, abraço, entrega, balão) num array `actions` com `id+ts`; cliente toca animação se `ts` é novo.
- A Memória online continua usando `mem_session` como hoje, mas associada à sala (filtra por `room_code`). Vou adicionar coluna `room_code` em `mem_session` (ou recriar com PK = código da sala) pra cada sala ter o seu jogo.

## 8. Galeria — correção (Netlify)

Hoje as fotos apontam pra `fotos/01-55-52.jpeg` (caminho relativo) que não existem em `public/`. Fix: prefixar todas as URLs com `https://giolimaminhavida.netlify.app/fotos/...` direto na lista de `photos`. Mantém os mesmos nomes de arquivo. Lazy loading e lightbox continuam funcionando.

## 9. Polimento

- Hover/click feedback nos botões de loja, sala, HUD.
- Toast curto pra feedbacks ("Coração coletado!", "Item entregue!").
- Layout responsivo da HUD (vertical no mobile).
- Sons leves opcionais (beijo, coleta, compra) via `Audio()` com data URLs curtas — desligáveis num botão 🔇.

## Ordem de implementação

1. Migração: criar tabela `room`, ajustar `mem_session` com `room_code`, ativar Realtime.
2. Login: textos + auth anônimo.
3. Tela de sala: criar/entrar, escolha de lado.
4. Galeria: trocar URLs pro Netlify.
5. Jardim refeito + cenários + interações.
6. Corações (spawn + coleta).
7. Trabalho + dinheiro.
8. Loja + inventário + entrega + transformações.
9. Sincronizar Memória por sala.
10. Polimento (toasts, responsivo, sons).

## Detalhes técnicos

- Continua tudo em `public/site.html` (HTML + CSS + JS inline + Supabase via CDN). Já está funcionando assim e simplifica iteração.
- `src/routes/index.tsx` continua redirecionando `/` → `/site.html`.
- Estado da sala em memória local + assinatura Realtime; toda mutação faz `update` otimista e o subscribe reconcilia.
- Throttles: posição 12 Hz, dinheiro flush 0.5 Hz, spawn de coração 0.33 Hz.
- Auth anônimo: `supabase.auth.signInAnonymously()` chamado depois do gate; o `user.id` vira `player_a`/`player_g` na sala.
- RLS: políticas abertas pras tabelas (mesmo padrão atual), já que o "segredo" é o código de 6 dígitos + senha do gate.
- Galeria: array `photos` recebe um prefixo `const NETLIFY='https://giolimaminhavida.netlify.app/';` e o `src` vira `NETLIFY+ph.u`.

Aprovando isso, eu já mando a migração + a reescrita do `site.html`.
