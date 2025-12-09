# --- Etapa 1: Builder ---
# En esta etapa se compila la aplicación de frontend.
FROM node:20-alpine AS builder

WORKDIR /app

# Copia los archivos de definición de paquetes para aprovechar el cacheo de capas.
COPY package*.json ./

# Instala solo las dependencias de producción si es posible, o usa 'ci' para una instalación limpia.
RUN npm ci

# Copia el resto del código fuente.
COPY . .

# Usamos un placeholder que será reemplazado en tiempo de ejecución.
ENV VITE_API_BASE_URL=VITE_API_BASE_URL_PLACEHOLDER

# Ejecuta el script de build para generar los archivos estáticos.
RUN npm run build

# --- Etapa 2: Production ---
# Esta etapa sirve los archivos estáticos con Nginx.
FROM nginx:1.25-alpine

# Instalar 'sed' para la sustitución de texto
RUN apk add --no-cache sed

# Copia los archivos estáticos generados desde la etapa 'builder'.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia y da permisos de ejecución al script de punto de entrada.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# El entrypoint se ejecutará primero, y luego iniciará Nginx.
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
