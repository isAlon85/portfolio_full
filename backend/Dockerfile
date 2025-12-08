# =================================================================
# ETAPA 1: Build - Compilar el código TypeScript a JavaScript
# =================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies) para poder compilar
RUN npm ci

# Copiar el resto de los archivos de configuración y código fuente
COPY tsconfig.json ./
COPY src ./src

# Ejecutar el script de compilación (asegúrate de tener un script "build" en tu package.json)
# Ejemplo de package.json: "scripts": { "build": "tsc" }
RUN npm run build

# Eliminar las dependencias de desarrollo para preparar la copia a la etapa final
# Esto deja en node_modules solo lo necesario para producción, ya compilado.
RUN npm prune --production

# =================================================================
# ETAPA 2: Production - Crear la imagen final y ligera
# =================================================================
FROM node:20-alpine

WORKDIR /app

# Instalar solo las dependencias necesarias en producción.
# 'curl' es necesario para el healthcheck definido en docker-compose.yml
RUN apk add --no-cache curl

# Crear un usuario y grupo no privilegiado para ejecutar la aplicación
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar los archivos de dependencias y la carpeta node_modules ya compilada y podada
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

# Copiar el código JavaScript compilado desde la etapa 'builder'
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# Cambiar al usuario no privilegiado
USER appuser

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["node", "dist/server.js"]