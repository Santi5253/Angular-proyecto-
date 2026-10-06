import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'caja_cigarreria',
});

export async function verificarConexion(): Promise<void> {
  try {
    await pool.query('SELECT 1');
    console.log('DB conectada (pg)');
  } catch {
    console.log('DB no disponible: el back sigue con datos en memoria (modo clase)');
  }
}
