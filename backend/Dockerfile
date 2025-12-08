# --- Etapa 1: Builder ---
# Esta etapa instala todas las dependencias (incluidas las de desarrollo)
# y prepara el código de la aplicación.
FROM node:20-alpine AS builder

WORKDIR /app

# Copia los archivos de definición de paquetes y el lockfile.
# El asterisco asegura que se copien tanto package.json como package-lock.json.
COPY package*.json ./

# Instala todas las dependencias usando 'npm ci', que es más rápido y seguro
# para builds reproducibles que 'npm install'.
RUN npm ci

# Copia el resto del código fuente y el tsconfig.
COPY src ./src
COPY tsconfig.json ./

# Compila el código TypeScript a JavaScript.
RUN npm run build

# --- Etapa 2: Production ---
# Esta etapa crea la imagen final, que será mucho más ligera.
FROM node:20-alpine

WORKDIR /app

# Crear un usuario sin privilegios para mejorar la seguridad.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar las dependencias de producción desde la etapa 'builder'.
COPY --from=builder /app/node_modules ./node_modules/
# Copiar el código compilado (JavaScript) desde la etapa 'builder'.
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/package.json .

# Asignar la propiedad de los archivos al usuario sin privilegios.
RUN chown -R appuser:appgroup /app

# Cambiar al usuario sin privilegios.
USER appuser

# Expone el puerto que la aplicación usará.
EXPOSE 3000

# Comando para iniciar la aplicación.
CMD [ "node", "dist/index.js" ]