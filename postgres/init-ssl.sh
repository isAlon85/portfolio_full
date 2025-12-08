#!/bin/sh

# Activar depuración: imprimir cada comando que se ejecuta
set -ex

echo "--- INICIO DEL SCRIPT DE INICIALIZACIÓN SSL ---"

PGDATA_DIR="/var/lib/postgresql/data"
SERVER_KEY="$PGDATA_DIR/server.key"
SERVER_CERT="$PGDATA_DIR/server.crt"

echo "Directorio de datos de PG: $PGDATA_DIR"
echo "Ruta de la clave del servidor: $SERVER_KEY"
echo "Ruta del certificado del servidor: $SERVER_CERT"

echo "Comprobando si los certificados ya existen..."
if [ ! -f "$SERVER_KEY" ] || [ ! -f "$SERVER_CERT" ]; then
  echo "Generando certificados SSL auto-firmados para PostgreSQL..."
  
  # Comando para generar los certificados
  openssl req -new -x509 -days 3650 -nodes -text -out "$SERVER_CERT" \
    -keyout "$SERVER_KEY" -subj "/CN=postgres-ssl"
  
  echo "Cambiando permisos de la clave privada..."
  chmod 600 "$SERVER_KEY"
  
  # Habilitar SSL en el archivo de configuración de PostgreSQL
  echo "Habilitando SSL en postgresql.conf..."
  echo "ssl = on" >> "$PGDATA_DIR/postgresql.conf"
  echo "ssl_cert_file = 'server.crt'" >> "$PGDATA_DIR/postgresql.conf"
  echo "ssl_key_file = 'server.key'" >> "$PGDATA_DIR/postgresql.conf"
  
  echo "Certificados generados."
else
  echo "Los certificados ya existen. No se generarán nuevos."
fi

echo "--- FIN DEL SCRIPT DE INICIALIZACIÓN SSL ---"
