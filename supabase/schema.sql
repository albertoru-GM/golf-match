-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  handicap numeric,
  golf_rating numeric default 0,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for golf courses
create table courses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  location text not null,
  image_url text,
  rating numeric default 0,
  par integer default 72,
  holes integer default 18,
  description text,
  amenities text[],
  lat numeric,
  lng numeric,
  booking_url text,
  address text
);

-- RLS for courses
alter table courses enable row level security;

create policy "Courses are viewable by everyone." on courses
  for select using (true);

-- Create a table for bookings
create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) not null,
  course_id uuid references courses(id) not null,
  date date not null,
  time time not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  players integer default 1
);

-- RLS for bookings
alter table bookings enable row level security;

create policy "Users can view their own bookings." on bookings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookings." on bookings
  for insert with check (auth.uid() = user_id);

-- Create a table for rounds (stats)
create table rounds (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references profiles(id) not null,
  course_id uuid references courses(id) not null,
  date date not null,
  score integer not null,
  stableford_points integer,
  notes text
);

-- RLS for rounds
alter table rounds enable row level security;

create policy "Users can view their own rounds." on rounds
  for select using (auth.uid() = user_id);

create policy "Users can insert their own rounds." on rounds
  for insert with check (auth.uid() = user_id);

-- Function to handle new user creation
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed data for courses
insert into courses (name, location, image_url, rating, description) values
('Real Club de Golf El Prat', 'Barcelona, España', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop', 4.5, 'Uno de los campos más prestigiosos de España.'),
('Golf Santander', 'Santander, España', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop', 4.2, 'Campo desafiante con vistas espectaculares.'),
('Valderrama Golf Club', 'Sotogrande, España', 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop', 4.8, 'Sede de la Ryder Cup y uno de los mejores de Europa.');
