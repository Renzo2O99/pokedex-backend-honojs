<div align="center">
  <h1>✨ Pokédex API ✨</h1>
  <h3>Backend de alto rendimiento para tu aplicación Pokédex</h3>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Hono](https://img.shields.io/badge/Hono.js-000000?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

  <p align="center">
    <a href="#características-principales-✨">Características</a> •
    <a href="#tecnologías-utilizadas-🛠️">Tecnologías</a> •
    <a href="#comenzando-🚀">Comenzando</a> •
    <a href="#documentación-de-la-api-📚">Documentación</a>
  </p>
</div>

---

## 🌟 Características Principales ✨

### 🔐 Seguridad Avanzada
<div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #10b981;">
  <h4>🔒 Medidas de Seguridad Implementadas</h4>
  <ul style="margin: 0; padding-left: 1.2rem;">
    <li><strong>Autenticación JWT</strong> con expiración y refresh tokens</li>
    <li><strong>Hash de contraseñas</strong> con bcrypt (10 rondas de sal)</li>
    <li><strong>Protección de cabeceras HTTP</strong> con Helmet</li>
    <li><strong>Configuración segura de CORS</strong> con origen restringido</li>
    <li><strong>Rate limiting</strong> para prevenir ataques de fuerza bruta</li>
    <li><strong>Sanitización de entradas</strong> para prevenir inyecciones</li>
    <li><strong>Validación de datos</strong> con Zod en todas las entradas</li>
    <li><strong>Manejo centralizado de errores</strong> sin exponer detalles sensibles</li>
    <li><strong>Protección contra XSS</strong> con encabezados de seguridad</li>
    <li><strong>Seguridad de cookies</strong> con flags HttpOnly, Secure y SameSite</li>
  </ul>
  
  <h4>🔐 Configuración de Seguridad Detallada</h4>
  <ul style="margin: 0; padding-left: 1.2rem;">
    <li>Configuración personalizada para CSP, HSTS, XSS Filter, etc.</li>
    <li>Límite de tamaño de solicitudes para prevenir ataques DoS</li>
    <li>Deshabilitación del header <code>X-Powered-By</code></li>
    <li>Configuración de seguridad para cookies de sesión</li>
    <li>Protección contra MIME type sniffing</li>
    <li>Políticas de seguridad de contenido (CSP) estrictas</li>
    <li>Prevención de clickjacking con X-Frame-Options</li>
  </ul>
</div>

### 🎮 Gestión de Pokémon
<div style="background: rgba(99, 102, 241, 0.1); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #6366f1;">
  <ul style="margin: 0; padding-left: 1.2rem;">
    <li>Búsqueda avanzada de Pokémon con filtros</li>
    <li>Sistema de favoritos con gestión completa</li>
    <li>Historial de búsquedas persistente</li>
    <li>Listas personalizables con múltiples Pokémon</li>
    <li>Gestión de perfil de usuario</li>
    <li>Estadísticas de uso</li>
  </ul>
</div>

### 🛠️ Para Desarrolladores
<div style="background: rgba(245, 158, 11, 0.1); padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #f59e0b;">
  <ul style="margin: 0; padding-left: 1.2rem;">
    <li>Tipado estático con TypeScript en todo el proyecto</li>
    <li>Validación de esquemas con Zod</li>
    <li>Sistema de logging estructurado</li>
    <li>Manejo centralizado de errores con códigos personalizados</li>
    <li>Migraciones de base de datos con Drizzle</li>
    <li>Configuración de variables de entorno</li>
    <li>Testing con Vitest (próximamente)</li>
  </ul>
</div>

## 🛠️ Tecnologías Utilizadas

- **Backend**: Hono.js (Runtime: Node.js)
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: PostgreSQL + Drizzle ORM
- **Autenticación**: JWT con refresh tokens
- **Validación**: Zod para validación de esquemas
- **Seguridad**: Helmet, rate limiting, CORS
- **Variables de Entorno**: dotenv
- **Paquetería**: pnpm

## 🔐 Guía de Seguridad

### Variables de Entorno Requeridas
```env
# Entorno
NODE_ENV=production
PORT=4000

# Base de Datos
DATABASE_URL=postgresql://user:password@localhost:5432/pokedex

# Seguridad
JWT_SECRET=tu_jwt_secreto_aqui
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=tu_refresh_token_secreto
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS (ajustar en producción)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX=100
```

## 🚀 Comenzando

### 📋 Requisitos Previos

- Node.js v18 o superior
- PostgreSQL v13 o superior
- pnpm (recomendado) o npm

### 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Renzo2O99/pokedex-backend-honojs.git
   cd pokedex-backend-honojs
   ```

2. **Instalar dependencias**
   ```bash
   # Instalar con pnpm (recomendado)
   pnpm install
   
   # O con npm
   # npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env
   ```
   
   Luego, edita el archivo `.env` con tus credenciales de base de datos y configuración.

4. **Configuración de la base de datos**
   - Asegúrate de tener PostgreSQL en ejecución
   - Crea una nueva base de datos
   - Ejecuta las migraciones:
     ```bash
     pnpm db:generate
     pnpm db:migrate
     ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   # Usando Node.js (recomendado)
   # pnpm dev:node
   ```
   
   El servidor estará disponible en `http://localhost:4000`

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener perfil de usuario
- `PUT /api/auth/password` - Cambiar contraseña

#### Favoritos
- `GET /api/favorites` - Obtener lista de favoritos
- `POST /api/favorites` - Añadir a favoritos
- `DELETE /api/favorites/:id` - Eliminar de favoritos

#### Listas Personalizadas
- `GET /api/lists` - Obtener todas las listas
- `POST /api/lists` - Crear nueva lista
- `GET /api/lists/:id` - Obtener lista por ID
- `PUT /api/lists/:id` - Actualizar lista
- `DELETE /api/lists/:id` - Eliminar lista

## 🏗️ Estructura del Proyecto

```
src/
├── core/                # Lógica central de la aplicación
│   ├── config/         # Configuraciones (base de datos, variables de entorno, etc.)
│   ├── db/             # Configuración y migraciones de la base de datos
│   ├── middlewares/    # Middlewares personalizados (auth, validación, manejo de errores)
│   └── utils/          # Utilidades, helpers y constantes
│
├── features/           # Módulos de características
│   ├── auth/           # Autenticación y autorización
│   │   ├── auth.controller.ts  # Controladores
│   │   ├── auth.routes.ts      # Rutas
│   │   ├── auth.service.ts     # Lógica de negocio
│   │   ├── auth.types.ts       # Tipos e interfaces
│   │   └── auth.validation.ts  # Validaciones
│   ├── favorites/      # Gestión de Pokémon favoritos
│   └── custom-lists/   # Listas personalizadas
│
├── types/              # Tipos globales de TypeScript
└── index.ts            # Punto de entrada de la aplicación
```

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🙏 Agradecimientos

- [PokéAPI](https://pokeapi.co/) - Por proporcionar los datos de Pokémon
- [Hono.js](https://hono.dev/) - Por el framework web rápido y minimalista
- A todos los contribuyentes que han ayudado a mejorar este proyecto

---

<div align="center" style="margin-top: 3rem; padding: 2rem 0; border-top: 1px solid rgba(0,0,0,0.1);">
  <h3 style="margin-bottom: 1rem;">✨ Desarrollado por</h3>
  <a href="https://github.com/Renzo2O99" target="_blank" style="display: inline-flex; align-items: center; text-decoration: none; color: #2563eb; font-weight: 600; margin: 0.5rem 0;">
    <img src="https://avatars.githubusercontent.com/u/72551282?v=4" alt="Renzo2099" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 12px;">
    Renzo2099
  </a>
  
  <div style="margin-top: 1.5rem; color: #6b7280; font-size: 0.9rem;">
    <p>¡Gracias por visitar el proyecto! Siéntete libre de explorar mi perfil de GitHub para más proyectos interesantes.</p>
    <p style="margin-top: 0.5rem;">
      <a href="https://github.com/Renzo2O99" target="_blank" style="color: #2563eb; text-decoration: none; display: inline-flex; align-items: center;">
        <svg height="16" viewBox="0 0 16 16" width="16" style="margin-right: 5px;">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        Visitar mi perfil de GitHub
      </a>
    </p>
  </div>
</div>
