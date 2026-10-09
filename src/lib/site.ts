export const SITE = {
  name: "Foami Mágico",
  tagline: "Manualidades en foami que hacen magia",
  phoneDisplay: "+505 8791 6164",
  phoneE164: "50587916164",
  city: "Managua, Nicaragua",
  hours: "Lunes a sábado, 8:00 a.m. a 6:00 p.m.",
  usdRate: 36.6243,
} as const;

export const WHATSAPP_BASE = `https://wa.me/${SITE.phoneE164}`;
