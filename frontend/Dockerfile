# --- Etapa 1: Builder ---
# En esta etapa se compila la aplicación de frontend.
FROM node:20-alpine AS builder

WORKDIR /app

# Copia los archivos de definición de paquetes.
COPY package*.json ./

# Instala las dependencias de forma limpia y reproducible.
RUN npm ci

# Copia el resto del código fuente.
COPY . .

# Recibe el argumento de build desde docker-compose.yml.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Ejecuta el script de build para generar los archivos estáticos.
RUN npm run build

# --- Etapa 2: Production ---
# Esta etapa sirve los archivos estáticos con Nginx.
FROM nginx:1.25-alpine

# Copia los archivos estáticos generados desde la etapa 'builder'.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# El comando por defecto de la imagen de Nginx es suficiente para iniciar el servidor.
CMD ["nginx", "-g", "daemon off;"]
