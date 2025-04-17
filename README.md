# 📝 Task Manager Challenge

Este proyecto nació como un reto técnico y terminó convirtiéndose en una SPA completa para gestionar tareas personales. Todo está desarrollado con Angular 17 y desplegado con Firebase. La idea es simple: iniciar sesión con tu correo, crear tareas, completarlas o eliminarlas. Todo de forma rápida, clara y responsive.

---

## 🚀 ¿En qué consiste?

- Inicia sesión con tu correo. Si ya existe, entras; si no, se preguntará si deseas crearlo.
- Puedes agregar tareas, editarlas, marcarlas como completadas o eliminarlas.
- Las tareas se guardan en un backend real, usando Firebase Functions + Firestore.
- Todo es responsive. Funciona genial en móvil y escritorio.
- El proyecto sigue una arquitectura hexagonal y está organizado para escalar fácilmente.

---

## ✅ Características clave

- Inicio de sesión por correo (sin contraseña)
- Diálogo para confirmar la creación de cuenta
- Panel principal con lista de tareas ordenadas por fecha
- Filtro de tareas: todas, pendientes y completadas
- Crear, editar, eliminar y completar tareas
- App totalmente responsive
- Despliegue a Firebase Hosting y Functions

---

## 🧱 Tecnologías utilizadas

- Angular 17 Standalone + Signals
- Reactive Forms + Angular Router
- Angular Material
- Firebase (Hosting + Functions + Firestore)
- Arquitectura Hexagonal (Clean Architecture)
- Interceptores HTTP

---

## 📁 Estructura del proyecto

```
root/
├── src/                        → Frontend (Angular)
│   ├── app/
│   │   ├── core/               → Servicios globales, proveedores, interceptores, guards
│   │   ├── domain/             → Modelos y puertos (interfaces)
│   │   ├── infrastructure/     → Adaptadores que comunican con el backend (HTTP)
│   │   ├── application/        → Casos de uso (controladores de la lógica de negocio)
│   │   ├── pages/              → login/ y dashboard/
│   │   └── shared/             → Enums, componentes reutilizables, utilidades, formularios
├── test/                       → Pruebas unitarias sobre el Backend
│
├── functions/                  → Backend (Firebase Cloud Functions)
│   ├── src/
│   │   ├── domain/             → Entidades, modelos y puertos del dominio
│   │   ├── application/        → Casos de uso (aplican lógica sobre el dominio)
│   │   ├── infrastructure/     → Conexiones a Firestore, JWT, etc.
│   │   ├── shared/             → DTOs, helpers y validaciones comunes
│   │   └── interface/          → Endpoints HTTP (rutas, middlewares, controladores)
│   ├── .env                    → Variables de entorno locales (no se sube)
│   ├── test/                   → Pruebas unitarias sobre el Frontend
│
├── .gitignore                  → Ignora node_modules, .env, etc.
├── .firebaserc                 → Alias y vinculación a múltiples proyectos Firebase
├── firebase.json               → Configuración de hosting, funciones y reglas
└── README.md                   → Documentación del proyecto
```

---

## 🧪 Ejecutar localmente

Este proyecto está dividido en dos partes: el **frontend** (Angular) y el **backend** (Firebase Functions con Firestore). Ambas pueden ejecutarse por separado en tu entorno local.

## 🌐 Frontend (Angular)

1. **Clona el repositorio**:

```bash
git clone https://github.com/JorgeRocha1994/atom.git
cd atom
```

2. **Instala las dependencias del frontend**:

```bash
npm install
```

3. **Levanta la aplicación Angular**:

```bash
ng serve
```

Esto iniciará la app en `http://localhost:4200`

---

## 🔧 Backend (Firebase Cloud Functions)

1. **Entra a la carpeta del backend**:

```bash
cd functions
```

2. **Instala las dependencias**:

```bash
npm install
```

3. **Levanta el emulador local de Firebase Functions y Firestore**:

```bash
npm run serve
```

Esto expondrá tus endpoints en:

```
http://localhost:5001/YOUR_PROJECT_ID/us-central1/api
```

Puedes consultar tu `projectId` en `.firebaserc` o Firebase Console.

---

## 📬 Postman – Colección y ambiente

Para facilitar la prueba de los endpoints disponibles en este proyecto, se incluye una colección de **Postman** junto con su ambiente configurado. Ambos archivos se encuentran en:

```
functions/docs/
```

La colección contiene todas las rutas disponibles del backend, y el ambiente incluye las variables necesarias (como la URL base y tokens si aplica) para una ejecución rápida y sin fricción.

---

## 🔐 Configuración de Entorno y Secrets

Este proyecto utiliza **variables de entorno modernas** y **Firebase Secrets** para manejar la configuración tanto local como en producción, de forma segura y organizada.

### 🖥️ Desarrollo local

Para trabajar en tu entorno local, crea y utiliza un archivo `.env` dentro de la carpeta `functions/` con el siguiente formato:

```
ENVIRONMENT=dev
SECRET_JWT=default_secret
EXPIRES_AT=30
```

> ⚠️ Importante: estos archivos **solo se usan en el entorno local (emulador)**.  
> Firebase los ignora automáticamente al hacer `firebase deploy`.  
> Este archivo **nunca debe subirse al repositorio**, ya está ignorado en `.gitignore`.

💡 El emulador de Firebase es compatible con múltiples archivos `.env`, incluyendo:

- `.env`
- `.env.dev`
- `.env.task-manager-6f53f` (usa tu `projectId`)

Más información:  
https://firebase.google.com/docs/functions/config-env?hl=es-419&gen=2nd#emulator_support

---

### 🚀 Producción (Firebase + GitHub Actions)

#### ✅ Variables de entorno (`ENVIRONMENT`, `EXPIRES_AT`)

Actualmente, **no es posible establecer `defineString()` con comandos CLI**.  
En lugar de eso, la única manera compatible es usando un archivo `.env.<projectId>` con el mismo nombre de tu proyecto de Firebase.

Ejemplo:

Archivo: `.env.task-manager-6f53f`  
Contenido:

```env
ENVIRONMENT=prd
EXPIRES_AT=30
```

Este archivo será usado automáticamente por Firebase CLI si el `projectId` coincide.

---

#### 🔒 Secrets reales (`SECRET_JWT`)

Este sí puede ser registrado de forma oficial mediante Firebase Secrets Manager:

```bash
firebase functions:secrets:set SECRET_JWT
```

Luego, en tu código:

```ts
import { defineSecret } from "firebase-functions/params";
export const secretJwt = defineSecret("SECRET_JWT");
```

Y al desplegar:

```ts
export const api = onRequest({ secrets: [secretJwt] }, app);
```

---

### 🤖 Secrets en GitHub (Actions)

GitHub necesita un token de Firebase para hacer deploy. Agrégalo en:

- **Settings > Secrets and variables > Actions**
- Nombre: `FIREBASE_TOKEN`

Puedes generarlo con:

```bash
firebase login:ci
```

---

### 🧪 Resumen rápido

| Variable       | Local (.env) | Producción (.env.<projectId> / Secret) | ¿Sensitiva? |
| -------------- | ------------ | -------------------------------------- | ----------- |
| ENVIRONMENT    | ✅           | ✅                                     | ❌ No       |
| EXPIRES_AT     | ✅           | ✅                                     | ❌ No       |
| SECRET_JWT     | ✅           | 🔐 Firebase Secret                     | ✅ Sí       |
| FIREBASE_TOKEN | ❌           | 🔐 GitHub Secret                       | ✅ Sí       |

---

### 🔐 Cómo generar `SECRET_JWT`

Puedes generar una clave segura para `SECRET_JWT` con cualquiera de las siguientes opciones:

#### ✅ Opción 1: Node.js (sin necesidad de instalar nada más)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Esto generará una clave secreta hexadecimal de 128 caracteres.

#### ✅ Opción 2: OpenSSL

Si tienes OpenSSL instalado, puedes generar una clave en base64:

```bash
openssl rand -base64 64
```

#### ✅ Opción 3: Passwords Generator

También puedes generar una contraseña manualmente desde [Passwords Generator](https://passwordsgenerator.net/)

---

# 🚀 Despliegue con Firebase

Este es un monorepo que incluye tanto el frontend como el backend. Puedes desplegar uno, el otro o ambos.

## Requisitos

- Tener una app creada en Firebase Console
- Tener Firebase CLI instalado: `npm install -g firebase-tools`
- Iniciar sesión: `firebase login`

---

## 🛠 Asegúrate de configurar tu proyecto Firebase

Antes de ejecutar cualquier despliegue, revisa el archivo `.firebaserc` ubicado en la raíz del proyecto. Ahí se especifica el ID del proyecto de Firebase al que se realizarán los despliegues.

Este es un ejemplo:

```json
{
  "projects": {
    "default": "task-manager-6f53f"
  }
}
```

🔁 **Reemplaza** `"task-manager-6f53f"` por el ID de tu propio proyecto de Firebase, que puedes encontrar en [Firebase Console](https://console.firebase.google.com/) bajo la configuración general del proyecto.

No olvides también remplazarlo en el ambiente productivo dentro de la aplicación front-end, lo podrás encontrar en la ruta `src\environments\environment.prod.ts`, ubica la URL y cambia el ID por tu propio proyecto.

---

## 🌐 Opción 1: Desplegar solo el frontend

1. Compila el proyecto:

```bash
ng build --configuration production
```

2. Asegúrate que `firebase.json` no tenga rewrites para `/api/**` si no usas funciones:

```json
"hosting": {
  "public": "dist/atom/browser",
  "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
}
```

3. Despliega:

```bash
firebase deploy --only hosting
```

---

## ☁️ Opción 2: Desplegar solo el backend

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### 🪟 ¿Problemas al compilar en Windows?

Si obtienes errores durante el build relacionados con saltos de línea o espacios (por ejemplo, con ESLint particularmente con CRLF o LF), ejecuta este comando:

```bash
npm run lint:fix
```

Esto corregirá automáticamente problemas comunes de formato y te permitirá continuar con el despliegue sin errores.

---

## 🔁 Opción 3: Desplegar ambos

```bash
npm run build             # Angular
cd functions && npm run build
cd ..
firebase deploy           # Hosting + Functions
```

---

### ⚠️ Consideración importante sobre el plan Blaze

Para desplegar funciones con Firebase (Cloud Functions), es **necesario habilitar el plan Blaze (pago por uso)** en tu proyecto de Firebase. Esto es un requisito de Google para:

- Crear buckets temporales de despliegue
- Habilitar servicios como Cloud Build y Artifact Registry
- Ejecutar funciones en producción

Puedes activarlo fácilmente desde la [consola de Firebase](https://console.firebase.google.com/) en la sección **Billing**.  
El plan Blaze no tiene costos iniciales y solo cobra si superas los límites gratuitos.

---

## ⚙️ CI/CD con GitHub Actions

Este proyecto incluye integración continua y despliegue automático mediante **GitHub Actions**. Existen dos workflows disponibles:

- `.github/workflows/deploy-frontend.yml` → Despliega automáticamente el **frontend (Angular)**
- `.github/workflows/deploy-functions.yml` → Despliega automáticamente el **backend (Firebase Functions)**

## 🔐 Seguridad y autenticación

- El backend devuelve un token con expiración al iniciar sesión
- El `AuthTokenService` lo almacena y renueva automáticamente
- Un interceptor agrega el token a cada petición (excepto login)
- Si expira o es inválido, el usuario vuelve al login

---

## 🧠 Buenas prácticas aplicadas

- Environments por entorno (`environment.ts`, `environment.prod.ts`)
- Arquitectura hexagonal con separación de capas
- Interfaz-puerto para invertir dependencias
- Código modular y reutilizable
- Signals para un manejo de estado reactivo y limpio

---

## 🛠 Mejoras futuras

- [ ] Agregar soporte multilenguaje (i18n) para internacionalización
  - [ ] Centralizar mensajes de información o errores en un solo archivo constante
- [ ] Separar frontend y backend en proyectos distintos si el sistema escala
- [ ] Paginar el listado de tareas para mejorar rendimiento y experiencia de usuario o aplicar un scroll infinito
- [ ] Crear proyectos separados en Firebase por cada ambiente (`dev`, `staging`, `prod`) para aislar configuraciones y despliegues
  - [ ] Firebase planea permitir el uso del flag `--env-vars-file` para cargar variables directamente desde archivos `.env`. Esta opción está en desarrollo, pero una vez esté estable, podría integrarse fácilmente para mejorar la experiencia de despliegue.
- [ ] Aprovechar otros recursos de Firebase según convenga: Authentication, Storage, etc.
- [ ] Explorar herramientas de terceros como Doppler o Vault para simplificar y centralizar la gestión de variables de entorno y secretos en entornos productivos.

---

## 🌱 Escalabilidad futura

Si el proyecto crece, se puede dividir por módulos de funcionalidad (feature slicing) o incluso por contextos de dominio (bounded contexts) para mayor claridad. También se puede desacoplar backend y frontend si lo amerita.

## 🔒 Contribuciones

Este repositorio es **público solo con fines educativos** y como reto técnico.

Sin embargo, puedes clonar el repositorio y usarlo como referencia o punto de partida en tus propios proyectos si lo prefieres.

- Asegúrate de no exponer tu `SECRET_JWT`, `FIREBASE_TOKEN` ni ningún secret sensible.
- Nunca subas el archivo `.env` al repositorio.

---

© 2025 JorgeRocha1994 — Todos los derechos reservados.
