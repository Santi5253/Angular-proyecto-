-- Esquema unificado para productos (PostgreSQL 18)
CREATE TABLE IF NOT EXISTS productos (
  codigo    VARCHAR(50) PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  categoria VARCHAR(50)  NOT NULL,
  precio    NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
  stock     INTEGER NOT NULL CHECK (stock >= 0)
);
