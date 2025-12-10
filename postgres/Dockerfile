# Usar la imagen oficial de PostgreSQL 16 como base
FROM postgres:16-alpine

# Instalar openssl, ya que no viene en la imagen alpine y es necesario para generar los certificados.
RUN apk add --no-cache openssl

# Instalar dependencias de compilación
RUN apk add --no-cache \
    build-base \
    perl \
    perl-dev \
    git

# Instalar pgTAP
RUN cd /tmp && \
    git clone https://github.com/theory/pgtap.git && \
    cd pgtap && \
    make && \
    make install && \
    cd / && \
    rm -rf /tmp/pgtap

# Limpiar dependencias de compilación
RUN apk del build-base perl-dev git

# Copiar el script de inicialización SSL al directorio de inicialización del contenedor.
# La instrucción COPY preserva los permisos del archivo de origen si es posible,
# pero el siguiente paso garantiza que sean correctos.
COPY init-ssl.sh /docker-entrypoint-initdb.d/01-init-ssl.sh

# Copiar el script para habilitar la extensión pgTAP
COPY 01-enable-pgtap.sql /docker-entrypoint-initdb.d/01-enable-pgtap.sql

# Asegurar que el script tenga permisos de ejecución dentro del contenedor.
# Y que el usuario 'postgres' sea el propietario, ya que es quien ejecuta los scripts.
RUN chmod +x /docker-entrypoint-initdb.d/01-init-ssl.sh && \
    chown postgres:postgres /docker-entrypoint-initdb.d/01-init-ssl.sh && \
    chown postgres:postgres /docker-entrypoint-initdb.d/01-enable-pgtap.sql