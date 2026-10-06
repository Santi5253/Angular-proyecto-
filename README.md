# Angular Proyecto — Sistema de Caja Registradora (Cigarrería)

Repo universitario: front-end Angular + back-end Express, como carpetas hermanas.

```
mi-app/
  front/     ← Angular 21 + Material (ng serve, schematics, router-outlet)
  backend/   ← Express + TypeScript + pg (GET /getproductos, POST, DELETE)
```

## Front (ver `front/README.md`)
```bash
cd front
npm install
npm.cmd start
# http://localhost:4200/productos | /formulario | /tabla
```

## Back (ver `backend/README.md`)
```bash
cd backend
npm install
npm run dev
# http://localhost:3000/salud
```

## Lo que NO se sube
`node_modules/`, `dist/`, `.angular/`, `backend/.env` (ver `.gitignore` de cada carpeta).
