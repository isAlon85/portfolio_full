FROM alpine:3.19

# Instalar herramientas necesarias
RUN apk update && apk add --no-cache \
    mysql-client \
    dcron \
    bash \
    gzip \
    && rm -rf /var/cache/apk/*

# Crear usuario sin privilegios
RUN addgroup -S backupgroup && \
    adduser -S -H -s /bin/false -G backupgroup backupuser

# Crear directorios con permisos
RUN mkdir -p /backup /var/log && \
    chown -R backupuser:backupgroup /backup /var/log

# Copiar script de backup
COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh && \
    chown backupuser:backupgroup /usr/local/bin/backup.sh

# Configurar crontab
COPY crontab /etc/crontabs/root
RUN chmod 0644 /etc/crontabs/root

# Ejecutar crond con -S para deshabilitar setpgid
CMD ["crond", "-f", "-l", "2", "-S"]
