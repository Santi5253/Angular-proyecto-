# Back-end Caja Cigarrería


## Comandos 
```bash
cd "C:\Documents\Angular proyecto\mi-app\backend"
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
