create table if not exists product_categories (
  id text primary key,
  name text not null,
  blurb text not null,
  tint text not null check (tint in ('fucsia', 'naranja', 'cielo', 'lima')),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  slug text primary key,
  name text not null,
  category_id text not null references product_categories(id),
  tagline text not null,
  description text not null,
  includes jsonb not null default '[]'::jsonb,
  base_price_nio integer not null check (base_price_nio >= 0),
  lead_days integer not null check (lead_days >= 0),
  min_qty integer not null default 1 check (min_qty > 0),
  image text not null,
  featured boolean not null default false,
  sku text unique,
  publication_status text not null default 'PUBLISHED' check (publication_status in ('PUBLISHED', 'DRAFT')),
  availability_status text not null default 'AVAILABLE' check (availability_status in ('AVAILABLE', 'UNAVAILABLE')),
  inventory_mode text not null default 'MADE_TO_ORDER' check (inventory_mode in ('STOCK_TRACKED', 'MADE_TO_ORDER', 'NOT_TRACKED')),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  minimum_stock integer not null default 0 check (minimum_stock >= 0),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  user_id text primary key,
  role text not null default 'ADMIN' check (role in ('ADMIN')),
  created_at timestamptz not null default now()
);

create table if not exists inventory_movements (
  id text primary key,
  product_slug text not null references products(slug),
  quantity_delta integer not null,
  previous_quantity integer not null check (previous_quantity >= 0),
  resulting_quantity integer not null check (resulting_quantity >= 0),
  reason text not null,
  actor_user_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists products_public_idx on products (publication_status, availability_status, archived, category_id);
create index if not exists inventory_movements_product_idx on inventory_movements (product_slug, created_at desc);

insert into product_categories (id, name, blurb, tint) values
  ('mascaras', 'Máscaras', 'Personajes listos para la fiesta, el desfile o la foto.', 'fucsia'),
  ('fiestas', 'Fiestas', 'Recuerdos, centros de mesa y números que se ven de lejos.', 'naranja'),
  ('colegios', 'Colegios', 'Aulas vivas: letras, figuras y murales que duran el año.', 'cielo'),
  ('personalizados', 'Personalizados', 'Tu personaje, tu tema, tu medida. Lo dibujamos en foami.', 'lima')
on conflict (id) do update set name = excluded.name, blurb = excluded.blurb, tint = excluded.tint, updated_at = now();

insert into products (slug, name, category_id, tagline, description, includes, base_price_nio, lead_days, min_qty, image, featured) values
  ('mascara-superheroe', 'Máscara superhéroe', 'mascaras', 'Capa, estrella y mucha actitud.', 'Máscara de foami en capas, pensada para cumpleaños, actos escolares y fotos. Elige el personaje — o cuéntanos el traje y lo armamos a color.', '["Ojales cómodos", "Elástico ajustable", "Acabado cosido en foami"]', 180, 3, 1, '/images/mascara-superheroe.jpg', true),
  ('mascara-princesa', 'Máscara princesa', 'mascaras', 'Corona, flores y brillo suave.', 'Diseño delicado con corona y flores en foami. Ideal para quinceañeras infantiles, obras de teatro y sesiones de fotos.', '["Corona en capas", "Flores de foami", "Elástico forrado"]', 200, 4, 1, '/images/mascara-princesa.jpg', true),
  ('mascara-unicornio', 'Máscara unicornio', 'mascaras', 'Cuerno, crin arcoíris y magia.', 'La favorita de las fiestas. Cuerno en espiral, crin de colores y orejitas. Se puede hacer diadema o máscara completa.', '["Cuerno reforzado", "Crin en tiras de foami", "Base cómoda"]', 220, 5, 1, '/images/mascara-unicornio.jpg', true),
  ('mascara-gatito', 'Máscara gatito', 'mascaras', 'Orejitas, bigotes y cara kawaii.', 'Gatito tierno para salones, Halloween suave o piñatas. Colores a elección: rosa, naranja, negro o el de la mascota de la casa.', '["Orejas rígidas", "Bigotes de foami", "Elástico suave"]', 160, 3, 1, '/images/mascara-gatito.jpg', false),
  ('recuerdos-pinata', 'Recuerdos para piñata', 'fiestas', 'Mini figuras para que cada niño se lleve algo.', 'Lotes de recuerdos en foami: animalitos, estrellas, héroes o el tema de la fiesta. Se entregan listos para la bolsa o la mesa de dulces.', '["Diseño del tema", "Corte y capas", "Empaque simple por lote"]', 45, 4, 12, '/images/recuerdos-pinata.jpg', true),
  ('centro-mesa', 'Centro de mesa', 'fiestas', 'La pieza que se ve al entrar al salón.', 'Centro de mesa en foami con número, estrellas y personaje. Escala para mesa infantil o mesa principal. Combinable con recuerdos.', '["Base estable", "Número o inicial", "Figuras del tema"]', 280, 5, 1, '/images/centro-mesa.jpg', false),
  ('numeros-3d', 'Números 3D', 'fiestas', 'La edad, en grande y a color.', 'Números de foami con volumen para mesa, pared o foto. Un dígito o la edad completa. Se pueden hacer con el color de la fiesta.', '["Estructura rígida", "Capas de color", "Listo para exhibir"]', 150, 3, 1, '/images/numeros-3d.jpg', false),
  ('letras-aula', 'Letras 3D para aula', 'colegios', 'El abecedario que se quiere tocar.', 'Letras y títulos en foami para rincones de lectura, nombres de salón y periódicos murales. Resistentes para el año escolar.', '["Corte limpio", "Capas de color", "Listas para pegar"]', 85, 4, 1, '/images/letras-aula.jpg', false),
  ('figuras-educativas', 'Figuras educativas', 'colegios', 'Ciencia, animales y cuentos en foami.', 'Figuras para ciencias, inglés o preescolar: animales, ciclo del agua, sistema solar y más. Se cotizan por set o por personaje.', '["Set temático", "Piezas con volumen", "Colores de aula"]', 120, 5, 1, '/images/figuras-educativas.jpg', false),
  ('mural-escolar', 'Mural escolar', 'colegios', 'Una pared que enseña y se fotografía.', 'Composición grande para pasillos, actos cívicos o ferias. Sol, nubes, letras y figuras en foami, pensada para anclarse en corcho o pizarra.', '["Boceto del mural", "Piezas numeradas", "Guía de armado"]', 480, 8, 1, '/images/mural-escolar.jpg', false),
  ('personaje-medida', 'Personaje a tu medida', 'personalizados', 'El héroe, la mascota o el dibujo de tu hijo.', 'Partimos de una foto, un dibujo o una referencia. Escala para mesa, pared o para que el niño lo lleve. El nivel de detalle marca el precio.', '["Boceto previo", "Capas a color", "Acabado reforzado"]', 380, 7, 1, '/images/personaje-medida.jpg', false),
  ('pedido-libre', 'Pedido personalizado', 'personalizados', 'Si lo imaginas en foami, lo hacemos.', 'Logos, recuerdos de empresa, temas de quince, baby shower o lo que no aparece en el catálogo. Cuéntanos la idea y armamos la cotización.', '["Asesoría por WhatsApp", "Propuesta de tamaño", "Entrega acordada"]', 250, 6, 1, '/images/pedido-personalizado.jpg', false)
on conflict (slug) do nothing;
