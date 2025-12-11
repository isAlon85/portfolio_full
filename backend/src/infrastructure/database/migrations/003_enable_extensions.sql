-- Habilitar la extensión pg_trgm para búsquedas de texto (trigramas) y GIN indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Habilitar uuid-ossp si se usa para generar UUIDs (opcional pero recomendado dado tu esquema)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";