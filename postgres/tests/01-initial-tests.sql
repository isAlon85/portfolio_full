BEGIN;

-- Usamos no_plan() para permitir un número dinámico de pruebas mientras desarrollamos
SELECT no_plan();

-- 1. Sanity Check: Verificar conexión y extensión
SELECT pass('La base de datos está respondiendo y pgTAP funciona');
SELECT has_extension('pgtap', 'La extensión pgTAP debe estar instalada');

-- 2. Verificación de Estructura: Tablas
-- Comprobamos que la tabla crítica 'users' existe
SELECT has_table('users', 'La tabla users debería existir');

-- 3. Verificación de Columnas en 'users'
-- Verificamos las columnas esenciales para autenticación y gestión
SELECT has_column('users', 'id', 'Debe tener columna id');
SELECT has_column('users', 'email', 'Debe tener columna email');
SELECT has_column('users', 'password', 'Debe tener columna password');
SELECT has_column('users', 'name', 'Debe tener columna name');
SELECT has_column('users', 'surname', 'Debe tener columna surname');
SELECT has_column('users', 'username', 'Debe tener columna username');
SELECT has_column('users', 'created_at', 'Debe tener columna created_at');

-- 4. Verificación de Restricciones (Constraints)
SELECT col_is_pk('users', 'id', 'La columna id debe ser Primary Key');
SELECT col_is_unique('users', 'email', 'El email debe ser único');
SELECT col_not_null('users', 'email', 'El email no puede ser nulo');
SELECT col_not_null('users', 'password', 'El password no puede ser nulo');
SELECT col_not_null('users', 'name', 'El name no puede ser nulo');
SELECT col_not_null('users', 'surname', 'El surname no puede ser nulo');
SELECT col_not_null('users', 'username', 'El username no puede ser nulo');

-- 5. Pruebas Funcionales (Insertar datos)
-- Preparamos una inserción para validar el comportamiento
-- Nota: Ajusta los campos si tu esquema requiere 'username' u otros NOT NULL
PREPARE insert_user AS INSERT INTO users (username, name, surname, email, password) VALUES ($1, $2, $3, $4, $5);

SELECT lives_ok(
    $$ EXECUTE insert_user('testuser', 'Usuario Test', 'Apellido Test', 'test_pgtap@example.com', 'secure_pass') $$,
    'Debería permitir insertar un usuario válido'
);

SELECT throws_ok(
    $$ EXECUTE insert_user('testuser', 'Usuario Test', 'Apellido Test', 'test_pgtap@example.com', 'another_pass') $$,
    '23505', -- Código de error PostgreSQL para unique_violation
    NULL,
    'Debería fallar al insertar un email duplicado'
);

-- Finalizar las pruebas
SELECT * FROM finish();
ROLLBACK;
