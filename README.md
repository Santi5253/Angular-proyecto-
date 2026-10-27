# Sistema de Caja Registradora (Cigarrería)

Front-end Angular + back-end Express + PostgreSQL 18.

```
mi-app/
  front/     <- Angular + Material
  backend/   <- Express + TypeScript + PostgreSQL 18 (/api/v1/productos)
```

## Ejecutar
```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run db:init
npm run dev

# Frontend
cd ../front
npm install
npm start
```


