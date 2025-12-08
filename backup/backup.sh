#!/bin/sh

# Salir inmediatamente si un comando falla
set -e

# Variables de entorno ya están disponibles desde docker-compose.yml
# POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

echo "Iniciando backup de la base de datos: ${POSTGRES_DB}"

# Formato del nombre del archivo de backup
FILENAME="backup-$(date +%Y-%m-%dT%H-%M-%S).sql.gz"
BACKUP_PATH="/backup/${FILENAME}"

# Exportar la contraseña para que pg_dump la utilice de forma segura
export PGPASSWORD=$POSTGRES_PASSWORD

# Ejecutar pg_dump y comprimir la salida con gzip
pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -w --clean | gzip > "$BACKUP_PATH"

# Limpiar la variable de contraseña
unset PGPASSWORD

# Limpiar backups antiguos, manteniendo solo los últimos 7
echo "Limpiando backups antiguos..."
ls -t /backup/backup-*.sql.gz | tail -n +8 | xargs -r rm --

echo "Backup completado exitosamente: ${FILENAME}"