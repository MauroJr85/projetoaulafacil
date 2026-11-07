create type public.app_role as enum ('admin');
create type public.teacher_status as enum ('pendente','aprovado','rejeitado');
create type public.request_status as enum ('novo','contatado','concluido');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  subject text not null check (subject in ('Matemática','Português','Inglês')),
  modality text not null check (modality in ('online','presencial')),
  bio text not null check (char_length(bio) between 20 and 600),
  status teacher_status not null default 'pendente',
  created_at timestamptz not null default now()
);
grant select on public.teachers to anon, authenticated;
grant update, delete on public.teachers to authenticated;
grant all on public.teachers to service_role;
alter table public.teachers enable row level security;
create policy "public reads approved" on public.teachers for select to anon, authenticated using (status = 'aprovado');
create policy "admin reads all" on public.teachers for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin updates" on public.teachers for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin deletes" on public.teachers for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.teacher_contacts (
  teacher_id uuid primary key references public.teachers(id) on delete cascade,
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  consent_at timestamptz not null default now()
);
grant select on public.teacher_contacts to authenticated;
grant all on public.teacher_contacts to service_role;
alter table public.teacher_contacts enable row level security;
create policy "admin reads contacts" on public.teacher_contacts for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.lesson_requests (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  requester_name text not null check (char_length(requester_name) between 2 and 100),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  message text check (message is null or char_length(message) <= 500),
  status request_status not null default 'novo',
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
grant select, update on public.lesson_requests to authenticated;
grant all on public.lesson_requests to service_role;
alter table public.lesson_requests enable row level security;
create policy "admin reads requests" on public.lesson_requests for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin updates requests" on public.lesson_requests for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.submit_teacher(_name text, _subject text, _modality text, _bio text, _whatsapp text, _consent boolean, _adult boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare _id uuid;
begin
  if not coalesce(_consent,false) or not coalesce(_adult,false) then raise exception 'Consentimento e maioridade são obrigatórios'; end if;
  insert into public.teachers(name, subject, modality, bio) values (trim(_name), _subject, _modality, trim(_bio)) returning id into _id;
  insert into public.teacher_contacts(teacher_id, whatsapp) values (_id, regexp_replace(_whatsapp,'\D','','g'));
  return _id;
end $$;

create or replace function public.submit_lesson_request(_teacher_id uuid, _name text, _whatsapp text, _message text, _consent boolean, _adult boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare _id uuid;
begin
  if not coalesce(_consent,false) or not coalesce(_adult,false) then raise exception 'Consentimento e maioridade são obrigatórios'; end if;
  if not exists (select 1 from public.teachers where id = _teacher_id and status = 'aprovado') then raise exception 'Professor indisponível'; end if;
  insert into public.lesson_requests(teacher_id, requester_name, whatsapp, message)
  values (_teacher_id, trim(_name), regexp_replace(_whatsapp,'\D','','g'), nullif(trim(coalesce(_message,'')),''))
  returning id into _id;
  return _id;
end $$;

revoke all on function public.submit_teacher(text,text,text,text,text,boolean,boolean) from public;
revoke all on function public.submit_lesson_request(uuid,text,text,text,boolean,boolean) from public;
grant execute on function public.submit_teacher(text,text,text,text,text,boolean,boolean) to anon, authenticated;
grant execute on function public.submit_lesson_request(uuid,text,text,text,boolean,boolean) to anon, authenticated;