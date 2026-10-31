-- Recipe Book schema. Canonical; docs/schema.sql is a pointer here, not a second definition.

-- Curated navigation set. Closed: adding a row is a deliberate act. Keyed by slug so a join
-- returns the string Recipe.categories already expects, with no identifier mapping layer.
create table categories (
  slug        text primary key,
  name        text not null,
  sort_order  smallint not null,
  tile_bg     text not null
);

-- Open discovery set. Slug is the lowercase canonical form; name is display, written as said,
-- and nullable because tagDisplayName() derives a fallback for a Tag row carrying none.
create table tags (
  slug  text primary key,
  name  text
);

-- The only unit of content.
create table recipes (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null check (length(trim(title)) > 0),
  ingredients   text[] not null check (array_length(ingredients, 1) >= 1),
  steps         text[] not null check (array_length(steps, 1) >= 1),
  prep_minutes  smallint check (prep_minutes >= 0),
  cook_minutes  smallint check (cook_minutes >= 0),
  servings      smallint check (servings > 0),
  notes         text,
  hero_path     text,                                    -- storage path, sans size suffix
  status        text not null default 'draft' check (status in ('draft', 'published')),
  archived_at   timestamptz,                             -- soft delete; null = live
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- A recipe may sit in several categories; at least one is enforced in the app. Slug reference,
-- not id: renaming a Category slug cascades its join rows and, deliberately, its public URL.
create table recipe_categories (
  recipe_id     uuid not null references recipes(id) on delete cascade,
  category_slug text not null references categories(slug) on update cascade on delete restrict,
  primary key (recipe_id, category_slug)
);

create table recipe_tags (
  recipe_id uuid not null references recipes(id) on delete cascade,
  tag_slug  text not null references tags(slug) on update cascade on delete cascade,
  primary key (recipe_id, tag_slug)
);

-- What the nightly build selects, and the ordering every list uses.
create index recipes_public_idx on recipes (created_at desc)
  where status = 'published' and archived_at is null;

-- updated_at maintenance.
create function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger recipes_touch before update on recipes
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security. Anonymous reads exactly what the public site may show;
-- every write requires a session. The anon key is therefore safe to publish.
-- ---------------------------------------------------------------------------

alter table recipes           enable row level security;
alter table categories        enable row level security;
alter table tags              enable row level security;
alter table recipe_categories enable row level security;
alter table recipe_tags       enable row level security;

create policy read_public_recipes on recipes for select to anon
  using (status = 'published' and archived_at is null);

create policy admin_all_recipes on recipes for all to authenticated
  using (true) with check (true);

create policy read_categories on categories for select to anon using (true);
create policy read_tags       on tags       for select to anon using (true);

create policy admin_categories on categories for all to authenticated
  using (true) with check (true);
create policy admin_tags on tags for all to authenticated
  using (true) with check (true);

-- Join rows are visible only for recipes the reader may already see, so drafts
-- leak nothing -- not even their tag list.
create policy read_recipe_categories on recipe_categories for select to anon
  using (exists (select 1 from recipes r where r.id = recipe_id
                 and r.status = 'published' and r.archived_at is null));

create policy read_recipe_tags on recipe_tags for select to anon
  using (exists (select 1 from recipes r where r.id = recipe_id
                 and r.status = 'published' and r.archived_at is null));

create policy admin_recipe_categories on recipe_categories for all to authenticated
  using (true) with check (true);
create policy admin_recipe_tags on recipe_tags for all to authenticated
  using (true) with check (true);

-- Storage: bucket 'recipe-photos', public read, authenticated write.
-- Objects land at recipes/{recipe_id}/hero-1200.webp and hero-400.webp.
