# 🛫 ViajesAR - Frontend (Entrega Parcial)

Frontend de la plataforma de venta de paquetes turísticos **ViajesAR**. Desarrollado con **React**, **Vite** y **Tailwind CSS**, consume la API REST del backend y permite pagar con **Mercado Pago** (modo prueba).

> 🚧 **Estado:** versión parcial para evaluación. El panel de administración (CRUD de paquetes) está en desarrollo.

---

## 🌐 Enlaces del Proyecto

* **Frontend (Netlify):** [https://viajesar.netlify.app](https://viajesar.netlify.app)
* **Backend (Render):** [https://nodo-viajes-backend.onrender.com](https://nodo-viajes-backend.onrender.com)
* **Repositorio del backend:** [https://github.com/juanpi24/nodo-viajes-backend](https://github.com/juanpi24/nodo-viajes-backend)

> ⏳ **Nota:** el backend está en el plan gratuito de Render, por lo que puede tardar unos **30-50 segundos** en "despertar" en la primera petición.

---

## 🔑 Credenciales de Prueba

**👑 Rol Administrador**

| Dato | Valor |
|------|-------|
| Email | `admin@nodoviajes.com` |
| Password | `admin123` |

**👤 Rol Cliente**

Puede registrarse directamente desde la app con un email nuevo, o usar:

| Dato | Valor |
|------|-------|
| Email | `juan@test.com` |
| Password | `123456` |

---

## 🧪 ¿Qué se puede probar?

### Flujo de Cliente

1. Navegar por el catálogo (búsqueda y filtros).
2. Ver el detalle de un paquete (incluye clima en tiempo real vía Open-Meteo).
3. Agregar paquetes a **Favoritos** (contador en el Navbar).
4. Agregar paquetes al **carrito**.
5. **Pagar con Mercado Pago** (ver sección siguiente).

---

## 🛒 Flujo de Compra y Pago (modo prueba)

> El pago funciona con **credenciales de prueba** de Mercado Pago: **no se cobra dinero real**.

1. Iniciar sesión como **Cliente**.
2. Agregar uno o más paquetes al carrito.
3. Ir al carrito y presionar **"Pagar con Mercado Pago"**.
4. Se abre el checkout de Mercado Pago. Se recomienda usar una **ventana de incógnito** para evitar errores por sesiones duplicadas.
5. Pagar con una de las dos opciones siguientes.

### Opción A: Tarjeta de crédito de prueba

En la pantalla de pago, seleccionar **"Tarjeta de crédito"** y completar:

| Dato | Valor |
|------|-------|
| Número de tarjeta | `5031 7557 3453 0604` (Mastercard) |
| Nombre del titular | `APRO` |
| Vencimiento | `11/30` |
| CVV | `123` |
| DNI | `12345678` |

> ⚠️ El nombre del titular **define el resultado** del pago. Debe ser exactamente `APRO` (en mayúsculas) para que sea **aprobado**.

**Otros resultados simulados** (cambiando solo el nombre del titular):

| Titular | Resultado |
|---------|-----------|
| `APRO` | Pago aprobado |
| `OTHE` | Rechazado por error general |
| `CONT` | Pendiente de pago |

### Opción B: Comprador de prueba (cuenta de Mercado Pago)

| Dato | Valor |
|------|-------|
| Usuario | `TESTUSER5776167015302551916` |
| Contraseña | `OWa7waQmXN` |
| Código de verificación | `914156` (solo si Mercado Pago pide verificar por e-mail) |

> Es una cuenta ficticia de Mercado Pago: no mueve dinero real.

### Después del pago

Al finalizar, Mercado Pago redirige de vuelta a la aplicación, donde se **verifica el pago** contra el backend. Si fue aprobado, la orden queda registrada con estado `approved` y se puede ver en el historial de compras del cliente.

---

## 🛠️ Tecnologías

* **React 19** + **Vite**
* **Tailwind CSS 4**
* **React Router** (navegación y rutas protegidas)
* **Axios** (consumo de la API)
* **React Hook Form** + **Zod** (formularios y validaciones)
* **React Toastify** (notificaciones)
* **Lucide React** (íconos)
* **Mercado Pago** (checkout, modo prueba) y **Open-Meteo** (clima)

---

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/juanpi24/nodo-viajes-frontend.git
   cd nodo-viajes-frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar las variables de entorno (copiar `.env.example` a `.env`):

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Ejecutar en modo desarrollo:

   ```bash
   npm run dev
   ```

   La app queda disponible en `http://localhost:5173`.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Análisis con ESLint |

> Para ejecutar el proyecto completo en local también hay que levantar el [backend](https://github.com/juanpi24/nodo-viajes-backend).

---

## 🗺️ Próximamente

* Panel de administración: CRUD de paquetes y gestión de usuarios y órdenes.
* README final con la documentación técnica de la arquitectura.
