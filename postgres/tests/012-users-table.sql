BEGIN;

-- Usamos no_plan() para permitir un número dinámico de pruebas mientras desarrollamos
SELECT no_plan();

-- 1. Sanity Check: Verificar conexión y extensión
SELECT pass('La base de datos está respondiendo y pgTAP funciona');
SELECT has_extension('pgtap', 'La extensión pgTAP debe estar instalada');

-- 2. Verificación de Estructura: Tablas
-- Comprobamos que la tabla crítica 'users' existe
SELECT has_table('users', 'La tabla users debería existir');
SELECT col_is_pk('users', 'id', 'La columna id debe ser Primary Key');

-- Verificación de columnas principales
SELECT columns_are('users', ARRAY[
    'id', 'username', 'email', 'password_hash', 'full_name', 'avatar_url',
    'is_active', 'email_verified', 'last_login_at', 'created_at', 'updated_at', 'deleted_at'
], 'La tabla debe tener las columnas correctas');

-- Verificación de valores por defecto
SELECT col_default_is('users', 'is_active', 'true', 'is_active debe ser true por defecto');
SELECT col_default_is('users', 'email_verified', 'false', 'email_verified debe ser false por defecto');

-- 2. Verificación de Índices
-- Índices Únicos Parciales
SELECT has_index('users', 'idx_users_email_unique', 'email', 'Debe existir índice único para email (activo)');
SELECT has_index('users', 'idx_users_username_unique', 'username', 'Debe existir índice único para username (activo)');

-- Índices de Búsqueda y Ordenamiento
SELECT has_index('users', 'idx_users_deleted_at_id', ARRAY['deleted_at', 'id'], 'Debe existir índice compuesto deleted_at_id');
SELECT has_index('users', 'idx_users_is_active_deleted_at', ARRAY['is_active', 'deleted_at'], 'Debe existir índice compuesto is_active_deleted_at');
SELECT has_index('users', 'idx_users_email_verified_deleted_at', ARRAY['email_verified', 'deleted_at'], 'Debe existir índice compuesto email_verified_deleted_at');
SELECT has_index('users', 'idx_users_email_lower', 'lower((email)::text)', 'Debe existir índice funcional para email minúsculas');
SELECT has_index('users', 'idx_users_username_lower', 'lower((username)::text)', 'Debe existir índice funcional para username minúsculas');

-- 3. Verificación de Constraints (Validaciones)
SELECT col_has_check('users', 'email', 'Debe validar formato de email');
SELECT col_has_check('users', 'username', 'Debe validar caracteres de username');
SELECT col_has_check('users', 'username', 'Debe validar longitud de username');
SELECT col_has_check('users', 'avatar_url', 'Debe validar formato de URL de avatar');
SELECT col_has_check('users', 'password_hash', 'Debe validar longitud del hash de contraseña');

-- 4. Verificación de Triggers
SELECT has_trigger('users', 'trigger_users_updated_at', 'Debe tener trigger para actualizar updated_at');

-- 5. Pruebas Funcionales

-- Preparar statement para inserts limpios
PREPARE insert_user (text, text, text, text) AS 
    INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4);

-- Caso 1: Inserción válida
SELECT lives_ok(
    $$ EXECUTE insert_user('user_ok', 'ok@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAk.ONxt10.kM0d.Uq0t.t.t.t.t.t.t.t00', 'User OK') $$,
    'Debe permitir insertar un usuario válido'
);

-- Caso 2: Email duplicado (Violación de índice único)
SELECT throws_ok(
    $$ EXECUTE insert_user('user_dup', 'ok@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAk.ONxt10.kM0d.Uq0t.t.t.t.t.t.t.t00', 'User Dup') $$,
    '23505', -- unique_violation
    NULL,
    'No debe permitir emails duplicados activos'
);

-- Caso 3: Username duplicado
SELECT throws_ok(
    $$ EXECUTE insert_user('user_ok', 'other@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAk.ONxt10.kM0d.Uq0t.t.t.t.t.t.t.t00', 'User Dup Name') $$,
    '23505', -- unique_violation
    NULL,
    'No debe permitir usernames duplicados activos'
);

-- Caso 4: Formato de email inválido
SELECT throws_ok(
    $$ EXECUTE insert_user('user_bad_email', 'bad-email-format', '$2b$12$LQv3c1yqBWVHxkd0LHAk.ONxt10.kM0d.Uq0t.t.t.t.t.t.t.t00', 'Bad Email') $$,
    '23514', -- check_violation
    NULL,
    'Debe fallar si el email no tiene formato válido'
);

-- Caso 5: Password hash corto (simulando texto plano o hash débil)
SELECT throws_ok(
    $$ EXECUTE insert_user('user_weak_pass', 'weak@example.com', 'password123', 'Weak Pass') $$,
    '23514', -- check_violation
    NULL,
    'Debe fallar si el hash del password es muy corto (<60 chars)'
);

-- Caso 6: Soft Delete y Reutilización de Email
-- "Borramos" el usuario original
UPDATE users SET deleted_at = NOW() WHERE username = 'user_ok';

-- Intentamos insertar el mismo email de nuevo (debería funcionar porque el anterior está borrado)
SELECT lives_ok(
    $$ EXECUTE insert_user('user_ok_v2', 'ok@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAk.ONxt10.kM0d.Uq0t.t.t.t.t.t.t.t00', 'User Reborn') $$,
    'Debe permitir reutilizar email si el usuario anterior tiene deleted_at NOT NULL'
);

SELECT * FROM finish();
ROLLBACK;