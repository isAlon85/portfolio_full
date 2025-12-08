#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backup/portfolio_${TIMESTAMP}.sql.gz"

echo "[$(date)] Starting MySQL backup..."

# Verificar que las variables de entorno existen
if [ -z "$MYSQL_HOST" ] || [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ] || [ -z "$MYSQL_DATABASE" ]; then
    echo "[$(date)] ERROR: Missing required environment variables"
    exit 1
fi

# Realizar backup con mysqldump
mysqldump -h "${MYSQL_HOST}" \
          -u "${MYSQL_USER}" \
          -p"${MYSQL_PASSWORD}" \
          --single-transaction \
          --routines \
          --triggers \
          --databases "${MYSQL_DATABASE}" \
          2>/dev/null | gzip > "${BACKUP_FILE}"

# Verificar que el backup se creó correctamente
if [ -f "${BACKUP_FILE}" ] && [ -s "${BACKUP_FILE}" ]; then
    echo "[$(date)] Backup completed successfully: ${BACKUP_FILE}"
    echo "[$(date)] Backup size: $(du -h ${BACKUP_FILE} | cut -f1)"
else
    echo "[$(date)] ERROR: Backup failed or file is empty"
    exit 1
fi

# Listar backups existentes
echo "[$(date)] Current backups:"
ls -lh /backup/portfolio_*.sql.gz 2>/dev/null || echo "No backups found"

exit 0
