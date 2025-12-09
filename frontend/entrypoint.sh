#!/bin/sh
# entrypoint.sh

# Salir inmediatamente si un comando falla
set -e

# Definir la ruta de los archivos estáticos y el archivo del secreto
ROOT_DIR=/usr/share/nginx/html
SECRET_FILE_PATH=/run/secrets/VITE_API_BASE_URL

# Placeholder que Vite usará durante la compilación
PLACEHOLDER="VITE_API_BASE_URL_PLACEHOLDER"

if [ -f "$SECRET_FILE_PATH" ]; then
  # Leer el valor real de la URL desde el archivo de secreto
  API_URL=$(cat "$SECRET_FILE_PATH")
  echo "Inyectando la URL de la API en los archivos estáticos..."
  # Buscar y reemplazar el placeholder en todos los archivos JS y CSS
  # Usar -exec en lugar de xargs para mayor robustez y compatibilidad.
  # El delimitador '#' en sed evita conflictos si la URL contiene '/'.
  find "$ROOT_DIR" -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s#$PLACEHOLDER#$API_URL#g" {} +
else
  echo "Advertencia: No se encontró el archivo de secreto en $SECRET_FILE_PATH. Usando valores por defecto."
fi

# Ejecutar el comando original del contenedor (iniciar Nginx)
exec "$@"