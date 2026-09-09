
alter table reports add column if not exists audit_report jsonb;
alter table reports add column if not exists user_votes jsonb default '{}'::jsonb;
alter table reports add column if not exists comments jsonb default '[]'::jsonb;
alter table reports add column if not exists downvotes integer default 0;
