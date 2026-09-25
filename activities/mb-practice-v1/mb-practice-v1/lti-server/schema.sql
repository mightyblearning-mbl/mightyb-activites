-- Mighty B Practice: deck attempts + best Canvas scores
-- Run once in the mighty-b-practice Supabase project (SQL Editor > New query > Run).
-- Only the passback server (service role key) reads/writes these tables. Row Level Security
-- is ON with no policies, so the public anon key cannot see student data.

create table if not exists public.deck_attempts (
  attempt_id        uuid primary key,              -- from the deck's result object; repeats are ignored
  deck_id           text not null,                 -- e.g. phys-3-1-momentum (never changed or reused)
  lti_user_sub      text not null,                 -- Canvas LTI user id (from the validated launch only)
  canvas_user_id    text,                          -- Canvas numeric user id (from the launch, if Canvas sends it)
  canvas_course_id  text,
  context_id        text,                          -- LTI course context id
  resource_link_id  text,                          -- the Canvas assignment link
  lineitem_url      text,                          -- Canvas gradebook column (AGS line item)
  score_given       integer not null,              -- first-try correct answers
  score_maximum     integer not null,              -- questions in the deck
  score_ratio       numeric generated always as (case when score_maximum > 0 then score_given::numeric / score_maximum end) stored,
  mastered          boolean not null,              -- score_ratio >= deck masteryThreshold (default 0.85)
  items             jsonb not null,                -- [{id, skill?, firstTryCorrect, tries}, ...]
  started_at        timestamptz,
  completed_at      timestamptz,
  received_at       timestamptz not null default now(),
  is_instructor     boolean not null default false,
  passback_status   text not null default 'pending'  -- sent | not_higher | pending | instructor | no_lineitem
                    check (passback_status in ('sent','not_higher','pending','instructor','no_lineitem')),
  passback_error    text,
  session           jsonb                          -- kept only while a Canvas post is pending, for the retry job
);
create index if not exists deck_attempts_user_deck on public.deck_attempts (lti_user_sub, deck_id);
create index if not exists deck_attempts_pending on public.deck_attempts (received_at) where passback_status = 'pending';
create index if not exists deck_attempts_course on public.deck_attempts (canvas_course_id, deck_id);

create table if not exists public.deck_best_scores (
  lti_user_sub        text not null,
  lineitem_url        text not null,
  deck_id             text not null,
  canvas_user_id      text,
  canvas_course_id    text,
  best_ratio          numeric not null,           -- the best score already sent to Canvas
  best_score_given    integer not null,
  best_score_maximum  integer not null,
  best_attempt_id     uuid references public.deck_attempts (attempt_id),
  sent_at             timestamptz not null default now(),
  primary key (lti_user_sub, lineitem_url)
);

alter table public.deck_attempts    enable row level security;
alter table public.deck_best_scores enable row level security;
