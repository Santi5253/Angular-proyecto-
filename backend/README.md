# Back-end Caja Cigarrería

Express + TypeScript + PostgreSQL 18. Rutas versionadas bajo `/api/v1`.

## Comandos

```bash
cd "mi-app/backend"
npm install
cp .env.example .env   # ajusta credenciales si es necesario
npm run db:init        # crea la BD y carga esquema + datos
npm run dev            # http://localhost:3000/salud
```

## Base de datos (PostgreSQL 18)

1. Instala PostgreSQL 18 (https://www.postgresql.org/download/windows/), puerto 5432, usuario `postgres`.
2. Ajusta `backend/.env` con tus credenciales.
3. Ejecuta `npm run db:init` (crea `caja_cigarreria` y carga `sql/01_schema.sql` + `sql/02_seed.sql`).

Si prefieres pgAdmin: crea la BD `caja_cigarreria` y ejecuta los SQL en orden.

## Estructura

```
backend/
  package.json
  tsconfig.json
  .env
  .env.example
  scripts/init-db.js
  sql/
    01_schema.sql
    02_seed.sql
  src/
    server.ts
    app.ts
    config/db.ts
    models/producto.ts
    models/producto.model.ts
    api/v1/
      index.ts
      endpoints/productos.ts
      routes/productos.routes.ts
```

Rutas: `GET /api/v1/productos` | `GET /api/v1/productos/:codigo` | `POST /api/v1/productos` | `PUT /api/v1/productos/:codigo` | `DELETE /api/v1/productos/:codigo` | `GET /salud`.
