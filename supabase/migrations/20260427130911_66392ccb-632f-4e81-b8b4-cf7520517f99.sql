-- Visual Novel session (single shared room for the couple)
CREATE TABLE public.vn_session (
  id TEXT PRIMARY KEY DEFAULT 'couple',
  scene_index INT NOT NULL DEFAULT 0,
  aquiles_choice TEXT,
  giovana_choice TEXT,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vn_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vn_session read all" ON public.vn_session FOR SELECT USING (true);
CREATE POLICY "vn_session insert all" ON public.vn_session FOR INSERT WITH CHECK (true);
CREATE POLICY "vn_session update all" ON public.vn_session FOR UPDATE USING (true) WITH CHECK (true);

INSERT INTO public.vn_session (id) VALUES ('couple') ON CONFLICT DO NOTHING;

-- Memory game session (single shared room for the couple)
CREATE TABLE public.mem_session (
  id TEXT PRIMARY KEY DEFAULT 'couple',
  seed BIGINT NOT NULL DEFAULT 1,
  flipped JSONB NOT NULL DEFAULT '[]'::jsonb,
  matched JSONB NOT NULL DEFAULT '[]'::jsonb,
  turn TEXT NOT NULL DEFAULT 'aquiles',
  score_a INT NOT NULL DEFAULT 0,
  score_g INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mem_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mem_session read all" ON public.mem_session FOR SELECT USING (true);
CREATE POLICY "mem_session insert all" ON public.mem_session FOR INSERT WITH CHECK (true);
CREATE POLICY "mem_session update all" ON public.mem_session FOR UPDATE USING (true) WITH CHECK (true);

INSERT INTO public.mem_session (id, seed) VALUES ('couple', floor(random()*1000000)::bigint) ON CONFLICT DO NOTHING;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.vn_session;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mem_session;