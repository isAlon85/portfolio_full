# Usar una imagen base ligera de Alpine
FROM alpine:3.18

# Instalar el cliente de PostgreSQL (para pg_dump) y cron
# openrc es necesario para gestionar los servicios de cron
RUN apk add --no-cache postgresql-client dcron

# Crear el directorio para el log de cron
RUN mkdir -p /var/log/cron && touch /var/log/cron.log

# Copiar el script de backup al contenedor
COPY backup.sh /usr/local/bin/backup.sh

# Dar permisos de ejecución al script
RUN chmod +x /usr/local/bin/backup.sh

# Copiar el archivo crontab para programar la tarea
COPY crontab /etc/crontabs/root

# Comando para iniciar el demonio de cron en primer plano
CMD ["crond", "-f", "-l", "8", "-L", "/var/log/cron.log"]