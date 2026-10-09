# Foami Mágico

Catálogo y cotizador móvil para un taller de manualidades en foami de Managua, Nicaragua.

## Incluye

- Catálogo por categorías: máscaras, fiestas, colegios y personalizados.
- Fichas de producto con imágenes, precios base y tiempos de entrega.
- Cotizador por nivel de detalle, cantidad y fecha del evento.
- Descuentos por volumen y recargo por entrega express.
- Carrito de varias piezas.
- Generación de pedidos para WhatsApp.
- Diseño responsive y soporte PWA.

## Desarrollo local

```bash
npm install
npm run dev
```

Checks disponibles:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Los datos y precios actuales son de catálogo y deben confirmarse con el taller antes de aceptar un pedido. La aplicación está preparada para usar PGlite en preview y Neon/Postgres cuando se configura `DATABASE_URL` en despliegue.
