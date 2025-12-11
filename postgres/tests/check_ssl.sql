BEGIN;
SELECT plan(1);

-- Comprueba que el parámetro de configuración 'ssl' esté encendido ('on')
SELECT results_eq(
    'SHOW ssl',
    ARRAY['on'],
    'El servidor PostgreSQL debe tener SSL habilitado'
);

SELECT * FROM finish();
ROLLBACK;