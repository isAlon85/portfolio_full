#!/bin/sh

# Salir inmediatamente si un comando falla
set -e

# Validar que las variables de entorno para los archivos de secretos están definidas
if [ -z "$POSTGRES_USER_FILE" ] || [ -z "$POSTGRES_PASSWORD_FILE" ] || [ -z "$POSTGRES_DB_FILE" ]; then
  echo "Error: Las variables de entorno para los secretos de la base de datos no están definidas."
  echo "Asegúrate de que POSTGRES_USER_FILE, POSTGRES_PASSWORD_FILE, y POSTGRES_DB_FILE están configuradas."
  exit 1
fi

# Leer los secretos de los archivos si las variables _FILE están definidas.
# Esto hace que el script sea compatible con Docker Secrets.
export PGUSER=$(cat "${POSTGRES_USER_FILE}")
export PGPASSWORD=$(cat "${POSTGRES_PASSWORD_FILE}")
export PGDATABASE=$(cat "${POSTGRES_DB_FILE}")

# POSTGRES_HOST se mantiene como una variable de entorno estándar, lo cual es correcto.
export PGHOST=${POSTGRES_HOST}

echo "Iniciando backup de la base de datos: ${PGDATABASE}"

# Formato del nombre del archivo de backup
FILENAME="backup-$(date +%Y-%m-%dT%H-%M-%S).sql.gz"
BACKUP_PATH="/backup/${FILENAME}"

# Ejecutar pg_dump y comprimir la salida con gzip
# pg_dump utilizará automáticamente las variables de entorno PG*
pg_dump -w --clean | gzip > "$BACKUP_PATH"

# Limpiar todas las variables de entorno de conexión por higiene y seguridad.
unset PGPASSWORD
unset PGUSER
unset PGDATABASE
unset PGHOST

# Limpiar backups antiguos, manteniendo solo los últimos 7
echo "Limpiando backups antiguos..."
# ls -t: lista archivos por fecha de modificación (más nuevos primero)
# tail -n +8: empieza a mostrar desde la 8ª línea (salta los 7 más nuevos)
# xargs -r rm --: pasa los nombres de archivo a 'rm'. -r evita ejecutar rm si no hay entrada.
ls -t /backup/backup-*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -- && echo "Backups antiguos eliminados." || echo "No hay backups antiguos que eliminar."

echo "Backup completado exitosamente: ${FILENAME}"