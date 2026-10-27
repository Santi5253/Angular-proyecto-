-- Datos iniciales (semilla) unificados en la BD
INSERT INTO productos (codigo, nombre, categoria, precio, stock) VALUES
  ('CIG-001', 'Pielroja x20',        'Cigarrillos', 9500, 30),
  ('CIG-002', 'Marlboro Rojo x20',   'Cigarrillos', 14500, 20),
  ('BEB-001', 'Pony Malta 330ml',    'Bebidas',     3500, 48),
  ('BEB-002', 'Coca-Cola 400ml',     'Bebidas',     4000, 36),
  ('DUL-001', 'Chocorramo',          'Dulces',      3500, 25),
  ('ABA-001', 'Papas Margarita 105g','Abarrotes',   6500, 18)
ON CONFLICT (codigo) DO NOTHING;
