// Script para crear la BD caja_cigarreria (PostgreSQL 18) y cargar esquema + datos
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_NAME = process.env.DB_NAME || 'caja_cigarreria';

async function main() {
  // 1. Conectarse a la BD por defecto 'postgres' para crear la BD si no existe
  const adminPool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
    console.log(`BD '${DB_NAME}' creada.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`BD '${DB_NAME}' ya existe, se reutiliza.`);
    } else {
      throw err;
    }
  } finally {
    await adminPool.end();
  }

  // 2. Conectarse a la BD objetivo y ejecutar los SQL
  const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  const sqlDir = path.join(__dirname, '..', 'sql');
  const files = ['01_schema.sql', '02_seed.sql'];
  for (const file of files) {
    const fullPath = path.join(sqlDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Archivo no encontrado: ${file}, se omite.`);
      continue;
    }
    const sql = fs.readFileSync(fullPath, 'utf8');
    console.log(`Ejecutando ${file}...`);
    await pool.query(sql);
  }

  await pool.end();
  console.log('Inicializacion de BD completada correctamente.');
}

main().catch((err) => {
  console.error('Error al inicializar la BD:', err.message);
  process.exit(1);
});
