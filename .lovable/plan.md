## O que vamos construir

Um site único `index.html` (mantendo todo o conteúdo lindo que já existe — hero, história, galeria, carta, razões, frases, músicas, quiz, memória) com **3 adições**:

1. **Tela de login com senha "Florsinha"** (lembra no navegador)
2. **Visual Novel sincronizada online** — vocês dois decidem juntos, cada um no seu celular
3. **Memória online turn-based** — sala compartilhada, jogadas alternadas em tempo real

Tudo num só `index.html`, usando **Supabase Realtime** para sincronizar.

---

## 1. Tela de login (senha Florsinha)

- Antes do site aparecer, mostra uma tela cheia (mesmo estilo dourado/rosa/vinho do site) com:
  - Coração 🌹 animado
  - Campo de senha
  - Botão "Entrar"
  - Mensagem fofa: *"Só pra nós dois 💕"*
- Senha correta (`Florsinha`, case-insensitive): salva flag em `localStorage`, fade-in do site.
- Senha errada: tremidinha + mensagem *"Hmm… não é essa, meu amor 🌹"*.
- Quem já entrou uma vez naquele celular, não precisa digitar de novo.
- Pequeno link discreto "sair" no rodapé pra limpar a flag se quiserem.

> Observação: senha no front-end não é segurança real — é uma "cortesia" pra manter curiosos de fora. Tá ok pro propósito (site privado de vocês dois).

---

## 2. Visual Novel sincronizada (nova seção 💫 Nossa Aventura)

Aparece no menu como **"💫 Aventura"**, vira uma nova `<section>` no estilo das outras.

**Como funciona:**
- Tela inicial: dois botões — "Sou o Aquiles 🤴" / "Sou a Giovana 👑"
- Depois de escolher quem é, entra numa "sala fixa" do casal (mesma sala sempre, via Supabase Realtime — não precisa código).
- A história tem ~8–10 cenas. Cada cena tem:
  - Imagem/emoji ambiente + texto narrativo (Português, romântico, no clima do site)
  - Pergunta (ex: *"Onde a gente vai hoje?"*)
  - Cada pessoa vê 2 opções e escolhe a sua
- Indicador em tempo real: *"Aquiles já escolheu ✓ — esperando Giovana…"*
- Quando os dois escolheram, a próxima cena aparece para ambos simultaneamente, baseada na combinação das escolhas.
- Final: cena especial com declaração + botão "Reviver nossa aventura".

**Cenas planejadas** (todas românticas, no tom do site):
1. Acordamos juntos — *café na cama* ou *passeio de manhã*
2. Plano do dia — *praia*, *cinema*, *piquenique*, *ficar em casa*
3. Música do momento — escolhe a trilha sonora da cena
4. Surpresa do Aquiles — *flor*, *cartinha*, *música*
5. Pedido da Giovana — *abraço apertado*, *dança lenta*, *só me olha*
6. Imprevisto — *chuva*, *apagão* (vira algo fofo)
7. Jantar — *cozinhar juntos* ou *delivery no sofá*
8. Final — declaração final personalizada com base nas escolhas combinadas

Cada combinação de escolhas leva a um texto final levemente diferente (umas 3–4 variações de epílogo).

**Sincronização (Supabase Realtime):**
- Tabela `vn_session` com 1 linha (a sala do casal): `scene_index`, `aquiles_choice`, `giovana_choice`, `history` (jsonb), `updated_at`.
- Cada cliente faz `subscribe` em mudanças dessa linha.
- Ao escolher, faz `update` da própria coluna. Quando ambas estiverem preenchidas → calcula próxima cena, incrementa `scene_index`, limpa as escolhas. Os dois recebem o evento e renderizam a cena nova.
- Botão "Reiniciar aventura" reseta a linha.

---

## 3. Memória online turn-based (substitui a memória atual)

Mantém o visual atual do jogo da memória, mas agora online.

**Fluxo:**
- Tela inicial do jogo: dois botões — "Sou o Aquiles" / "Sou a Giovana"
- Sala fixa do casal (igual à VN — não precisa código).
- Tabuleiro 4x4 (8 pares, mesmas fotos que já tem) embaralhado de forma sincronizada (semente guardada no Supabase).
- Estado compartilhado: cartas viradas, cartas casadas, de quem é a vez, placar.
- Quem está na vez clica → vira carta → atualiza Supabase → o outro vê em tempo real.
- Casou par: ganha ponto, joga de novo. Errou: passa a vez.
- Cada par casado mostra a mensagem fofa que já existe no jogo atual.
- Final: mostra placar — *"Aquiles 5 × 3 Giovana 💕"* + mensagem carinhosa pro vencedor (e pro outro também 🌹).
- Botão "Jogar de novo" reembaralha.

**Sincronização:**
- Tabela `mem_session`: `seed` (int, pra embaralhar igual nos dois), `flipped` (jsonb array dos índices virados na rodada), `matched` (jsonb array), `turn` (`'aquiles'|'giovana'`), `score_a`, `score_g`, `updated_at`.
- Realtime subscribe igual à VN.

---

## 4. Banco de dados (Supabase / Lovable Cloud)

Duas tabelas simples, ambas com RLS aberto (é site privado e os dados são triviais — só estado de jogo do casal):

```text
vn_session
  id (uuid, pk, default 'couple-singleton')
  scene_index (int, default 0)
  aquiles_choice (text, nullable)
  giovana_choice (text, nullable)
  history (jsonb, default '[]')
  updated_at (timestamptz)

mem_session
  id (uuid, pk, default 'couple-singleton')
  seed (int)
  flipped (jsonb, default '[]')
  matched (jsonb, default '[]')
  turn (text, default 'aquiles')
  score_a (int, default 0)
  score_g (int, default 0)
  updated_at (timestamptz)
```

Realtime ativado nas duas tabelas. Políticas RLS: select/update/insert liberados para `anon` (justificado: senha no front filtra acesso, e o conteúdo é só estado de joguinho).

---

## 5. Como tudo é entregue

- **Um único arquivo `index.html`** na raiz pública, exatamente como o que você mandou — todo o CSS e JS embutidos, mantendo o tema dourado/rosa/vinho.
- Carrega o cliente Supabase via CDN (`<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js">`) com URL e anon key embutidos.
- Estrutura do JS dividida em blocos comentados: `// === LOGIN ===`, `// === VISUAL NOVEL ===`, `// === MEMORIA ONLINE ===`, etc. — fácil de editar depois.
- Menu de navegação ganha 1 item novo: **💫 Aventura** (a memória já existe no menu, só vamos atualizar a seção).

---

## Detalhes técnicos (pode pular se não for técnico 💕)

- Projeto atual no Lovable é TanStack Start, mas o pedido é "tudo no mesmo `index.html`" — então vou colocar o `index.html` em `public/index.html` e também criar uma rota `/` que serve esse mesmo HTML estático (ou simplesmente apontar a raiz pra ele). O conteúdo fica integralmente num único arquivo HTML como pedido.
- Criação das tabelas via migration SQL.
- Realtime: `supabase.channel('vn').on('postgres_changes', …)` e idem pra memória.
- Embaralhar com semente: usar PRNG simples (`mulberry32`) com `seed` da tabela pra garantir tabuleiro idêntico nos dois celulares.
- Senha "Florsinha" comparada com `.toLowerCase().trim() === 'florsinha'`. Flag salva como `localStorage.setItem('gl_unlocked','1')`.

---

## O que NÃO vou mexer

- Hero, contador de dias, história/timeline, galeria, 5 coisinhas, carta, razões, frases, músicas, quiz — **tudo permanece igualzinho**, só ganha a tela de login na frente e a nova seção da aventura, e a memória vira online.