# Portfolio Full Stack Project

Este proyecto es una aplicación Full Stack contenerizada que implementa una arquitectura robusta de microservicios utilizando Docker. Incluye backend, frontend, base de datos con soporte SSL, caché, sistema de backups automatizados y un entorno de pruebas integrado.

## 🚀 Features

- **Arquitectura de Microservicios**: Orquestación completa mediante Docker Compose.
- **Base de Datos Segura**: PostgreSQL 16 personalizado con soporte SSL y extensión `pgTAP` para testing.
- **Caché de Alto Rendimiento**: Redis configurado con autenticación para gestión de sesiones y caché.
- **Seguridad Avanzada**: Gestión de credenciales mediante **Docker Secrets** (sin contraseñas en texto plano).
- **Testing Integrado**: Pruebas unitarias de base de datos automatizadas con `pgTAP`.
- **Backups Automatizados**: Contenedor dedicado para realizar copias de seguridad de la base de datos.
- **Healthchecks**: Monitorización activa del estado de los servicios (Postgres, Redis, Backend).

## 🛠️ Requisitos Previos

Antes de iniciar, asegúrate de tener instalado Docker y Docker Compose.

### Configuración de Secretos

Por seguridad, este proyecto utiliza Docker Secrets. Debes crear los siguientes archivos en la carpeta `./secrets/` con sus respectivos valores:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `REDIS_PASSWORD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `VITE_API_BASE_URL`

## 📦 Despliegue

### Entorno de Desarrollo

Para levantar el entorno localmente y ver los logs en tiempo real:

```bash
docker-compose up --build
```

### Entorno de Producción

Para desplegar en producción (modo "detached" y reinicio automático):

```bash
docker-compose up -d --build
```

> **Nota**: El servicio de backend está configurado por defecto con `NODE_ENV: production` en el `docker-compose.yml`. Para desarrollo activo con _hot-reloading_, se recomienda usar un archivo `docker-compose.override.yml` que monte el código fuente como volumen.

## 🧪 Testing

El proyecto utiliza **pgTAP** para validar la integridad, estructura y lógica de la base de datos.

### Ejecutar Tests

Para correr la suite de pruebas de base de datos, utiliza el siguiente comando que levanta un contenedor efímero de pruebas:

```bash
docker-compose -f docker-compose.yml -f docker-compose.test.yml run --rm pgtap
```

### ¿Qué se testea?

Los scripts en `tests/db/` validan:

1.  **Estructura**: Existencia de tablas críticas (`users`), columnas y tipos de datos.
2.  **Restricciones (Constraints)**:
    - Primary Keys (`id`).
    - Unicidad (`email`).
    - Valores no nulos (`NOT NULL` en `username`, `password`, etc.).
3.  **Lógica de Negocio**: Se simulan inserciones para asegurar que la BD rechaza datos inválidos (ej. emails duplicados) y acepta datos correctos.

## 🔒 Seguridad y Prevenciones

Este proyecto ha sido diseñado siguiendo el principio de _Security by Design_:

### 1. Gestión de Secretos (Docker Secrets)

Ninguna contraseña o clave API está hardcodeada en el `docker-compose.yml`. Todas las variables sensibles se inyectan en tiempo de ejecución desde el sistema de archivos montado en `/run/secrets/`.

### 2. Aislamiento de Red

- Todos los servicios se comunican a través de una red interna privada `portfolio_network`.
- **Puertos Expuestos**: Solo se exponen los puertos estrictamente necesarios al host.
- **Binding Local**: La base de datos expone el puerto 5432 vinculada a `127.0.0.1`, impidiendo el acceso directo desde internet o desde otras máquinas en la red local.

### 3. Encriptación (SSL/TLS)

El contenedor de PostgreSQL incluye un script de inicialización (`init-ssl.sh`) y las librerías `openssl` necesarias para permitir conexiones cifradas a la base de datos.

### 4. Usuarios y Privilegios

Los servicios de base de datos y caché no se ejecutan como `root` (en el caso de las imágenes oficiales, usan usuarios dedicados `postgres` y `redis`).

### 5. Healthchecks

Se implementan comprobaciones de salud para asegurar que los servicios dependientes (como el backend) no intenten iniciar hasta que la base de datos y la caché estén totalmente operativas y aceptando conexiones.

## 📂 Estructura de Directorios Clave

- `backend/`: Código fuente del servidor Node.js.
- `frontend/`: Código fuente de la aplicación Vite.
- `postgres/`: Dockerfile personalizado y scripts de inicialización (`001-enable-pgtap.sql`).
- `tests/db/`: Scripts SQL para las pruebas de pgTAP.
- `backup/`: Configuración del servicio de copias de seguridad.
- `secrets/`: Almacenamiento de credenciales (no incluido en el control de versiones).
