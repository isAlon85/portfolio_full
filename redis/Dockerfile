FROM redis:7-alpine

# envsubst es parte del paquete gettext.
# Lo instalamos para permitir la sustitución de variables de entorno en el archivo de configuración.
RUN apk add --no-cache gettext