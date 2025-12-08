# Usar la imagen oficial de PostgreSQL 16 como base
FROM postgres:16

# Copiar el script de inicialización SSL al directorio de inicialización del contenedor.
# La instrucción COPY preserva los permisos del archivo de origen si es posible,
# pero el siguiente paso garantiza que sean correctos.
COPY init-ssl.sh /docker-entrypoint-initdb.d/01-init-ssl.sh

# Asegurar que el script tenga permisos de ejecución dentro del contenedor.
# Y que el usuario 'postgres' sea el propietario, ya que es quien ejecuta los scripts.
RUN chmod +x /docker-entrypoint-initdb.d/01-init-ssl.sh && \
    chown postgres:postgres /docker-entrypoint-initdb.d/01-init-ssl.sh