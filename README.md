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

## Portal de administración

La rama `feature/admin-inventory-portal` incluye un portal protegido en `/admin` para administrar el catálogo y el inventario:

- Crear y editar productos.
- Publicar, convertir a borrador y archivar piezas.
- Marcar disponibilidad y elegir entre inventario controlado, hecho a pedido o sin control.
- Ajustar existencias con una razón obligatoria y registro de movimientos.
- Consultar métricas de publicados, borradores, stock bajo, agotados y no disponibles.
- Usar el mismo catálogo publicado en inicio, catálogo, detalle, cotizador, carrito y resumen de WhatsApp.

El acceso es **fail-closed**. Un usuario debe estar en la tabla `admin_users` o en una allowlist de servidor:

```bash
FOAMI_ADMIN_EMAILS=admin@ejemplo.com
# o, si se prefiere una allowlist por IDs de Better Auth:
FOAMI_ADMIN_USER_IDS=user-id-1,user-id-2
```

Nunca se promueve automáticamente al primer usuario ni se aceptan roles enviados desde el navegador. En despliegue, aplica la migración `migrations/0002_admin_inventory.sql` usando el flujo normal de migraciones de la aplicación antes de habilitar el portal. La migración es idempotente y su seed usa `on conflict do nothing` para conservar productos y precios existentes.

La rama está deliberadamente separada de `main`; no debe fusionarse hasta revisar la configuración de administrador y la migración de la base de datos de producción.
