# 🛫 ViajesAR - Frontend

![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![Estado](https://img.shields.io/badge/estado-final-22c55e)

Frontend de la plataforma turística **ViajesAR**. Permite explorar paquetes, consultar el clima de los destinos, registrarse e iniciar sesión, mantener favoritos y un carrito, completar compras con Mercado Pago y consultar el historial de órdenes. También ofrece un panel administrativo para gestionar paquetes, usuarios y ventas.

## 🌐 Enlaces del proyecto

- Frontend: https://viajesar.netlify.app
- Backend: https://nodo-viajes-backend.onrender.com
- Repositorio frontend: https://github.com/juanpi24/nodo-viajes-frontend
- Repositorio backend: https://github.com/juanpi24/nodo-viajes-backend

> El backend está alojado en el plan gratuito de Render. Puede tardar entre 30 y 50 segundos en responder después de estar inactivo.

## 🧰 Stack tecnológico

- React 19
- Vite 8
- React Router 8
- Tailwind CSS 4
- Axios
- React Hook Form
- Zod y `@hookform/resolvers`
- React Toastify
- Lucide React
- SheetJS / XLSX
- ESLint
- Mercado Pago, en modo de prueba
- Open-Meteo para consultar el clima

## 📋 Requisitos

- Node.js 20 o superior recomendado
- npm 10 o superior recomendado
- Backend de ViajesAR disponible localmente o en Render
- Navegador moderno

## ✨ Funcionalidades

### 👤 Cliente

- Registro e inicio de sesión.
- Catálogo público con búsqueda y paginación.
- Página de detalle de cada paquete.
- Consulta del clima del destino.
- Lista de paquetes favoritos.
- Carrito de compras persistente.
- Creación de órdenes y redirección a Mercado Pago.
- Verificación del pago al volver desde Mercado Pago.
- Historial y cancelación de órdenes pendientes.
- Perfil del usuario.
- Tema claro y oscuro.

### 🛡️ Administrador

- CRUD de paquetes.
- Importación de paquetes desde la API externa configurada por el backend.
- CRUD de usuarios y asignación de roles.
- Consulta de todas las órdenes.
- Exportación de paquetes, usuarios y órdenes a Excel.
- Paginación y búsqueda de paquetes.

## 🗂️ Estructura del proyecto

```text
nodo-viajes-frontend/
├── public/
│   ├── _redirects
│   ├── favicon.png
│   ├── favicon.svg
│   └── logo.png
├── src/
│   ├── api/
│   │   ├── authApi.js
│   │   ├── axiosInstance.js
│   │   ├── favoriteApi.js
│   │   ├── orderApi.js
│   │   └── packageApi.js
│   ├── components/
│   │   ├── layout/
│   │   ├── packages/
│   │   └── ui/
│   ├── constants/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   ├── pages/
│   │   ├── admin/
│   │   └── páginas públicas y de usuario
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── schemas/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Variables de entorno

Crear el archivo `.env` desde la plantilla incluida:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```bash
cp .env.example .env
```

Contenido de `.env` para desarrollo:

```env
VITE_API_URL=http://localhost:3000/api
```

Contenido para producción:

```env
VITE_API_URL=https://nodo-viajes-backend.onrender.com/api
```

Si `VITE_API_URL` no está definida, el cliente utiliza `http://localhost:3000/api` como valor predeterminado.

## 🚀 Instalación local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/juanpi24/nodo-viajes-frontend.git
cd nodo-viajes-frontend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar el entorno

```powershell
Copy-Item .env.example .env
```

Modificar `VITE_API_URL` si el backend no utiliza `http://localhost:3000/api`.

### 4️⃣ Levantar el backend

Levantar el repositorio backend en otra terminal:

```bash
cd ../nodo-viajes-backend
npm install
npm run dev
```

La API puede utilizar también el despliegue público de Render.

### 5️⃣ Ejecutar el frontend

```bash
npm run dev
```

Abrir http://localhost:5173.

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo de Vite |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build generado |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

## 🏗️ Build y despliegue

Crear el build de producción:

```bash
npm run build
```

Vista previa local:

```bash
npm run preview
```

Configuración sugerida para Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Variable: `VITE_API_URL=https://nodo-viajes-backend.onrender.com/api`
- El archivo `public/_redirects` permite conservar las rutas de React Router.

## 🧭 Rutas de la aplicación

### 🌍 Públicas

| Ruta | Descripción |
|---|---|
| `/` | Catálogo de paquetes |
| `/packages/:id` | Detalle y clima del paquete |
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/pago/:status` | Resultado y verificación del pago |

### 🔑 Usuario autenticado

| Ruta | Acceso | Descripción |
|---|---|---|
| `/favoritos` | Usuario | Paquetes favoritos |
| `/cart` | Usuario | Carrito y checkout |
| `/perfil` | Usuario | Perfil |
| `/mis-compras` | Usuario | Historial de órdenes |

### 🛡️ Administrador

| Ruta | Acceso | Descripción |
|---|---|---|
| `/admin/packages` | Admin | Lista de paquetes |
| `/admin/packages/new` | Admin | Alta de paquete |
| `/admin/packages/:id/edit` | Admin | Edición de paquete |
| `/admin/orders` | Admin | Órdenes realizadas |
| `/admin/users` | Admin | Lista de usuarios |
| `/admin/users/new` | Admin | Alta de usuario |
| `/admin/users/:id/edit` | Admin | Edición de usuario |

Las rutas protegidas leen el usuario y el JWT almacenados por `AuthContext`. Si no existe una sesión válida, redirigen a `/login`. Las rutas administrativas requieren además el rol `admin`.

## 🔌 Consumo de la API

El cliente Axios utilizado por el frontend:

- Configura `VITE_API_URL` como URL base.
- Envía el JWT almacenado en `localStorage` mediante `Authorization: Bearer <token>`.
- Elimina la sesión local ante respuestas HTTP `401`.
- Redirige al usuario a `/login` cuando la sesión expira.

Principales llamadas implementadas:

| Recurso | Métodos consumidos |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Packages | `GET /packages`, `GET /packages/:id`, `GET /packages/:id/weather`, `POST /packages`, `PUT /packages/:id`, `DELETE /packages/:id`, `POST /packages/import` |
| Favorites | `GET /favorites`, `POST /favorites/:packageId`, `DELETE /favorites/:packageId` |
| Orders | `POST /orders`, `GET /orders/:id/verify`, `GET /orders/mis-ordenes`, `POST /orders/:id/cancel`, `GET /orders` |
| Users | `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` |

Ejemplo de uso desde el navegador para una petición protegida:

```javascript
import api from './src/api/axiosInstance';

const favoritos = await api.get('/favorites');
console.log(favoritos.data);
```

## 🧪 Credenciales de prueba

Las siguientes cuentas permiten probar el proyecto en el entorno configurado.

### 👑 Administrador

| Campo | Valor |
|---|---|
| Email | `admin@nodoviajes.com` |
| Contraseña | `admin123` |

### 🙋 Cliente

Puede registrarse con un correo nuevo o utilizar:

| Campo | Valor |
|---|---|
| Email | `juan@test.com` |
| Contraseña | `123456` |

## 💳 Prueba de Mercado Pago

Mercado Pago debe utilizarse en modo prueba. No se realiza ningún cobro real.

### 🛒 Flujo de compra

1. Iniciar sesión como cliente.
2. Agregar uno o más paquetes al carrito.
3. Presionar **Pagar con Mercado Pago**.
4. Completar el checkout con alguno de los datos de prueba.
5. Esperar el redireccionamiento hacia `/pago/:status`.
6. El frontend verificará el pago contra el backend y actualizará la interfaz.

Se recomienda una ventana de incógnito si existe una sesión previa del comprador de Mercado Pago.

### 💳 Tarjeta de crédito de prueba

| Campo | Valor |
|---|---|
| Número | `5031 7557 3453 0604` |
| Marca | Mastercard |
| Titular | `APRO` |
| Vencimiento | `11/30` |
| CVV | `123` |
| DNI | `12345678` |

Para probar otros resultados, cambiar únicamente el nombre del titular:

| Titular | Resultado |
|---|---|
| `APRO` | Pago aprobado |
| `OTHE` | Pago rechazado por error general |
| `CONT` | Pago pendiente |

### 🧾 Comprador de prueba

| Campo | Valor |
|---|---|
| Usuario | `TESTUSER5776167015302551916` |
| Contraseña | `OWa7waQmXN` |
| Código de verificación | `914156`, solo si Mercado Pago lo solicita |

El usuario anterior pertenece al entorno de pruebas y no corresponde a una cuenta real con movimientos monetarios.

## 🤖 Uso de inteligencia artificial

DeepSeek y Claude fueron utilizados como asistentes durante el desarrollo para:

- Diseñar componentes y estados de React.
- Mejorar formularios y validaciones.
- Integrar el flujo de autenticación y rutas protegidas.
- Preparar y revisar la integración con Mercado Pago.
- Depurar manejo de errores y respuesta de la API.
- Mejorar la arquitectura, legibilidad y documentación.
- Armar este README y sus instrucciones de uso.

El código generado recibió revisión y pruebas manuales antes de incorporarse al proyecto.

## ✍️ Autor

**Juan Pablo Millicay**

Proyecto ViajesAR - 2026.
