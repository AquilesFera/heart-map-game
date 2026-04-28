-- Tabela de salas online
CREATE TABLE public.room (
  code text PRIMARY KEY,
  player_a uuid,
  player_g uuid,
  scene text NOT NULL DEFAULT 'jardim',
  ax real NOT NULL DEFAULT 120,
  ay real NOT NULL DEFAULT 360,
  adir text NOT NULL DEFAULT 'down',
  amov boolean NOT NULL DEFAULT false,
  gx real NOT NULL DEFAULT 760,
  gy real NOT NULL DEFAULT 360,
  gdir text NOT NULL DEFAULT 'down',
  gmov boolean NOT NULL DEFAULT false,
  hearts jsonb NOT NULL DEFAULT '[]'::jsonb,
  money_a numeric NOT NULL DEFAULT 0,
  coins_g integer NOT NULL DEFAULT 0,
  inv_a jsonb NOT NULL DEFAULT '{}'::jsonb,
  inv_g jsonb NOT NULL DEFAULT '{}'::jsonb,
  form_g text,
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.room ENABLE ROW LEVEL SECURITY;

CREATE POLICY "room read all" ON public.room FOR SELECT USING (true);
CREATE POLICY "room insert all" ON public.room FOR INSERT WITH CHECK (true);
CREATE POLICY "room update all" ON public.room FOR UPDATE USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.room;
ALTER TABLE public.room REPLICA IDENTITY FULL;

-- Vincular jogo da memoria a uma sala
ALTER TABLE public.mem_session ADD COLUMN IF NOT EXISTS room_code text;
CREATE INDEX IF NOT EXISTS idx_mem_session_room_code ON public.mem_session(room_code);
