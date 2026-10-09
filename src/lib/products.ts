export const CATEGORIES = [
  {
    id: "mascaras",
    name: "Máscaras",
    blurb: "Personajes listos para la fiesta, el desfile o la foto.",
    tint: "fucsia",
  },
  {
    id: "fiestas",
    name: "Fiestas",
    blurb: "Recuerdos, centros de mesa y números que se ven de lejos.",
    tint: "naranja",
  },
  {
    id: "colegios",
    name: "Colegios",
    blurb: "Aulas vivas: letras, figuras y murales que duran el año.",
    tint: "cielo",
  },
  {
    id: "personalizados",
    name: "Personalizados",
    blurb: "Tu personaje, tu tema, tu medida. Lo dibujamos en foami.",
    tint: "lima",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  includes: string[];
  basePriceNio: number;
  leadDays: number;
  minQty: number;
  image: string;
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "mascara-superheroe",
    name: "Máscara superhéroe",
    category: "mascaras",
    tagline: "Capa, estrella y mucha actitud.",
    description:
      "Máscara de foami en capas, pensada para cumpleaños, actos escolares y fotos. Elige el personaje — o cuéntanos el traje y lo armamos a color.",
    includes: ["Ojales cómodos", "Elástico ajustable", "Acabado cosido en foami"],
    basePriceNio: 180,
    leadDays: 3,
    minQty: 1,
    image: "/images/mascara-superheroe.jpg",
    featured: true,
  },
  {
    slug: "mascara-princesa",
    name: "Máscara princesa",
    category: "mascaras",
    tagline: "Corona, flores y brillo suave.",
    description:
      "Diseño delicado con corona y flores en foami. Ideal para quinceañeras infantiles, obras de teatro y sesiones de fotos.",
    includes: ["Corona en capas", "Flores de foami", "Elástico forrado"],
    basePriceNio: 200,
    leadDays: 4,
    minQty: 1,
    image: "/images/mascara-princesa.jpg",
    featured: true,
  },
  {
    slug: "mascara-unicornio",
    name: "Máscara unicornio",
    category: "mascaras",
    tagline: "Cuerno, crin arcoíris y magia.",
    description:
      "La favorita de las fiestas. Cuerno en espiral, crin de colores y orejitas. Se puede hacer diadema o máscara completa.",
    includes: ["Cuerno reforzado", "Crin en tiras de foami", "Base cómoda"],
    basePriceNio: 220,
    leadDays: 5,
    minQty: 1,
    image: "/images/mascara-unicornio.jpg",
    featured: true,
  },
  {
    slug: "mascara-gatito",
    name: "Máscara gatito",
    category: "mascaras",
    tagline: "Orejitas, bigotes y cara kawaii.",
    description:
      "Gatito tierno para salones, Halloween suave o piñatas. Colores a elección: rosa, naranja, negro o el de la mascota de la casa.",
    includes: ["Orejas rígidas", "Bigotes de foami", "Elástico suave"],
    basePriceNio: 160,
    leadDays: 3,
    minQty: 1,
    image: "/images/mascara-gatito.jpg",
  },
  {
    slug: "recuerdos-pinata",
    name: "Recuerdos para piñata",
    category: "fiestas",
    tagline: "Mini figuras para que cada niño se lleve algo.",
    description:
      "Lotes de recuerdos en foami: animalitos, estrellas, héroes o el tema de la fiesta. Se entregan listos para la bolsa o la mesa de dulces.",
    includes: ["Diseño del tema", "Corte y capas", "Empaque simple por lote"],
    basePriceNio: 45,
    leadDays: 4,
    minQty: 12,
    image: "/images/recuerdos-pinata.jpg",
    featured: true,
  },
  {
    slug: "centro-mesa",
    name: "Centro de mesa",
    category: "fiestas",
    tagline: "La pieza que se ve al entrar al salón.",
    description:
      "Centro de mesa en foami con número, estrellas y personaje. Escala para mesa infantil o mesa principal. Combinable con recuerdos.",
    includes: ["Base estable", "Número o inicial", "Figuras del tema"],
    basePriceNio: 280,
    leadDays: 5,
    minQty: 1,
    image: "/images/centro-mesa.jpg",
  },
  {
    slug: "numeros-3d",
    name: "Números 3D",
    category: "fiestas",
    tagline: "La edad, en grande y a color.",
    description:
      "Números de foami con volumen para mesa, pared o foto. Un dígito o la edad completa. Se pueden hacer con el color de la fiesta.",
    includes: ["Estructura rígida", "Capas de color", "Listo para exhibir"],
    basePriceNio: 150,
    leadDays: 3,
    minQty: 1,
    image: "/images/numeros-3d.jpg",
  },
  {
    slug: "letras-aula",
    name: "Letras 3D para aula",
    category: "colegios",
    tagline: "El abecedario que se quiere tocar.",
    description:
      "Letras y títulos en foami para rincones de lectura, nombres de salón y periodicos murales. Resistentes para el año escolar.",
    includes: ["Corte limpio", "Capas de color", "Listas para pegar"],
    basePriceNio: 85,
    leadDays: 4,
    minQty: 1,
    image: "/images/letras-aula.jpg",
  },
  {
    slug: "figuras-educativas",
    name: "Figuras educativas",
    category: "colegios",
    tagline: "Ciencia, animales y cuentos en foami.",
    description:
      "Figuras para ciencias, inglés o preescolar: animales, ciclo del agua, sistema solar y más. Se cotizan por set o por personaje.",
    includes: ["Set temático", "Piezas con volumen", "Colores de aula"],
    basePriceNio: 120,
    leadDays: 5,
    minQty: 1,
    image: "/images/figuras-educativas.jpg",
  },
  {
    slug: "mural-escolar",
    name: "Mural escolar",
    category: "colegios",
    tagline: "Una pared que enseña y se fotografía.",
    description:
      "Composición grande para pasillos, actos cívicos o ferias. Sol, nubes, letras y figuras en foami, pensada para anclarse en corcho o pizarra.",
    includes: ["Boceto del mural", "Piezas numeradas", "Guía de armado"],
    basePriceNio: 480,
    leadDays: 8,
    minQty: 1,
    image: "/images/mural-escolar.jpg",
  },
  {
    slug: "personaje-medida",
    name: "Personaje a tu medida",
    category: "personalizados",
    tagline: "El héroe, la mascota o el dibujo de tu hijo.",
    description:
      "Partimos de una foto, un dibujo o una referencia. Escala para mesa, pared o para que el niño lo lleve. El nivel de detalle marca el precio.",
    includes: ["Boceto previo", "Capas a color", "Acabado reforzado"],
    basePriceNio: 380,
    leadDays: 7,
    minQty: 1,
    image: "/images/personaje-medida.jpg",
  },
  {
    slug: "pedido-libre",
    name: "Pedido personalizado",
    category: "personalizados",
    tagline: "Si lo imaginas en foami, lo hacemos.",
    description:
      "Logos, recuerdos de empresa, temas de quince, baby shower o lo que no aparece en el catálogo. Cuéntanos la idea y armamos la cotización.",
    includes: ["Asesoría por WhatsApp", "Propuesta de tamaño", "Entrega acordada"],
    basePriceNio: 250,
    leadDays: 6,
    minQty: 1,
    image: "/images/pedido-personalizado.jpg",
  },
];

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(id?: string) {
  if (!id) return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === id);
}

export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured);
}
