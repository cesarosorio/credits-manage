# Financiera Guacari

Sistema de gestión de préstamos y pagos desarrollado con Next.js 15, TypeScript y TanStack Query.

## Características

- 🏦 **Gestión de Créditos**: Visualización y administración de préstamos activos
- 💰 **Seguimiento de Pagos**: Control detallado de cuotas y abonos
- 📊 **Dashboard Estadístico**: Resumen de información financiera
- 🔐 **Autenticación JWT**: Sistema seguro de autenticación con refresh tokens
- 🎨 **UI Moderna**: Interfaz limpia construida con shadcn/ui y Tailwind CSS

## Configuración del Entorno

### Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
cp .env.example .env
```

#### Variables Requeridas:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=20000

# Authentication
NEXT_PUBLIC_TOKEN_STORAGE_KEY=token
NEXT_PUBLIC_REFRESH_TOKEN_STORAGE_KEY=refreshToken

# Application Configuration
NEXT_PUBLIC_APP_NAME="Financiera Guacari"
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

### Descripción de Variables:

- **NEXT_PUBLIC_API_BASE_URL**: URL base del backend API
- **NEXT_PUBLIC_API_TIMEOUT**: Timeout para peticiones HTTP (en milisegundos)
- **NEXT_PUBLIC_TOKEN_STORAGE_KEY**: Clave para almacenar JWT token en localStorage
- **NEXT_PUBLIC_REFRESH_TOKEN_STORAGE_KEY**: Clave para almacenar refresh token
- **NEXT_PUBLIC_APP_NAME**: Nombre de la aplicación
- **NEXT_PUBLIC_APP_VERSION**: Versión actual de la aplicación
- **NODE_ENV**: Entorno de ejecución (development, production, test)

## Instalación y Ejecución

### Prerequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd financiera-guacari
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## Estructura del Proyecto

```
├── app/                    # App Router de Next.js 15
│   ├── credits/           # Página de gestión de créditos
│   ├── payments/          # Página de gestión de pagos
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de shadcn/ui
│   └── ...               # Componentes personalizados
├── config/               # Configuraciones
│   └── env.config.ts     # Configuración de variables de entorno
├── services/             # Servicios y APIs
│   ├── api.service.ts    # Cliente HTTP principal
│   ├── credit.service.ts # Servicio de créditos
│   └── payment.service.ts # Servicio de pagos
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y helpers
└── domain/               # Tipos y modelos de dominio
```

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Estado/Cache**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Iconos**: Lucide React

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter (ESLint)
npm run type-check   # Verificación de tipos TypeScript
```

## API Backend

Este frontend está diseñado para trabajar con un backend que proporcione los siguientes endpoints:

- `GET /credits` - Obtener todos los créditos
- `GET /credits/:id` - Obtener crédito específico
- `GET /payments/credit/:creditId` - Obtener pagos de un crédito
- `POST /auth/login` - Autenticación
- `POST /auth/refresh-token` - Renovar token

## Configuración de Producción

Para desplegar en producción:

1. **Configurar variables de entorno de producción**
2. **Build del proyecto**
   ```bash
   npm run build
   ```
3. **Iniciar servidor de producción**
   ```bash
   npm start
   ```

## Desarrollo

### Agregar nuevas páginas
Las páginas se crean en el directorio `app/` siguiendo la estructura del App Router de Next.js 15.

### Agregar nuevos servicios
Los servicios se ubican en `services/` y utilizan el cliente HTTP centralizado en `api.service.ts`.

### Agregar nuevos componentes
Los componentes reutilizables van en `components/` y los componentes de UI en `components/ui/`.

## Contribución

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto es privado y propietario de Financiera Guacari.
