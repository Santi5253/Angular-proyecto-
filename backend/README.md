# Back-end Caja Cigarrería

Carpeta ubicada en la misma raíz del front-end (`mi-app/backend`), POR FUERA de `mi-app/src`.

## Comandos (CMD, según apuntes)
```bash
cd "C:\Users\sf467\Documents\Angular proyecto\mi-app\backend"
npm init -y
npm install express pg cors dotenv
npm i -D typescript ts-node-dev @types/express @types/cors @types/pg @types/node
npx tsc --init
npm run dev   # http://localhost:3000/salud
```

## Estructura
```
backend/
  package.json   # inventario de insumos del back
  tsconfig.json  # reglas TypeScript (qué es válido y qué no)
  .env           # secretos locales (NO se sube)
  .env.example   # plantilla sí se sube
  .gitignore     # node_modules, dist, .env no se suben
  src/
    server.ts      # serve: inicia localhost:3000
    app.ts         # appconfig: CORS + json + rutas
    config/db.ts   # credenciales pg
    models/producto.ts  # plantilla que valida datos
    controllers/productos.controller.ts  # get/post/delete
    routes/productos.routes.ts  # /getproductos, /postproductos, /deleteproductos/:codigo
```

`dist/` es solo despliegue compilado: NO se crea ni se sube (apunte).
