-- Drop unused vn_session (Visual Novel) and create new 2D game session
DROP TABLE IF EXISTS public.vn_session;

CREATE TABLE public.game_session (
  id text NOT NULL PRIMARY KEY DEFAULT 'couple',
  ax real NOT NULL DEFAULT 120,
  ay real NOT NULL DEFAULT 360,
  adir text NOT NULL DEFAULT 'down',
  amov boolean NOT NULL DEFAULT false,
  gx real NOT NULL DEFAULT 760,
  gy real NOT NULL DEFAULT 360,
  gdir text NOT NULL DEFAULT 'down',
  gmov boolean NOT NULL DEFAULT false,
  hearts jsonb NOT NULL DEFAULT '[]'::jsonb,
  collected jsonb NOT NULL DEFAULT '[]'::jsonb,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  finished boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.game_session ENABLE ROW LEVEL SECURITY;

CREATE POLICY "game_session read all" ON public.game_session FOR SELECT USING (true);
CREATE POLICY "game_session insert all" ON public.game_session FOR INSERT WITH CHECK (true);
CREATE POLICY "game_session update all" ON public.game_session FOR UPDATE USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.game_session;
ALTER TABLE public.game_session REPLICA IDENTITY FULL;

INSERT INTO public.game_session (id) VALUES ('couple') ON CONFLICT (id) DO NOTHING;