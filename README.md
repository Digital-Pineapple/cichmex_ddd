# Manual de Instalación del Proyecto

## Requisitos Previos
Antes de comenzar con la instalación, asegúrate de cumplir con los siguientes requisitos:
1. **Sistema Operativo**: Asegúrate de estar utilizando un sistema operativo compatible (por ejemplo, Windows, macOS o Linux).
2. **Lenguaje y Entorno**:
    - Instala [Node.js](https://nodejs.org/) (versión mínima recomendada: 14.x o superior).
    - Instala un gestor de paquetes como `npm` (incluido con Node.js).
3. **Herramientas Adicionales**:
    - Instala [Git](https://git-scm.com/) para clonar el repositorio.
    - Un editor de texto o IDE como [Visual Studio Code](https://code.visualstudio.com/).

## Pasos de Instalación
Sigue los pasos a continuación para instalar y configurar el proyecto:

### 1. Clonar el Repositorio
Clona el repositorio del proyecto desde el sistema de control de versiones (por ejemplo, GitHub o GitLab):

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar Dependencias
Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install --force
```

### 3. Compilar el Código TypeScript
Inicia el proceso de compilación en modo observador para TypeScript:

```bash
tsc -w
```

### 4. Ejecutar el Proyecto
Inicia el servidor de desarrollo con el siguiente comando:

```bash
npm run dev
```

### 5. Verificar la Instalación
Abre tu navegador y accede a la URL proporcionada por el servidor de desarrollo (por ejemplo, `http://localhost:3000`) para verificar que el proyecto se ejecuta correctamente.

---

## Estructura de Carpetas del Proyecto

```markdown
## Estructura de Carpetas del Proyecto

```plaintext
/carwash_ddd
├── /.github
├── /config
├── /dist
├── /interfaces
├── /swaggerdocs
├── .gitignore
├── app.ts
├── ngrok.exe
├── package-lock.json
├── package.json
├── README.md
├── swagger.ts
├── tsconfig.json
├── /src
│   ├── /api
│   │   ├── /application
│   │   ├── /domain
│   │   ├── /infrastructure
│   │   │   ├── controllers
│   │   │   ├── models
│   │   │   ├── repository
│   │   │   ├── router
│   │   ├── /utils
│   ├── /shared
│   │   ├── /domain
│   │   ├── /infrastructure
│   │   │   ├── /aws
│   │   │   ├── /db
│   │   │   ├── /facturapi
│   │   │   ├── /helpers
│   │   │   ├── /mercadopago
│   │   │   ├── /middleware
│   │   │   ├── /moment
│   │   │   ├── /nodemailer
│   │   │   ├── /Regions
│   │   │   ├── /routes
│   │   │   ├── /server
│   │   │   ├── /socket
│   │   │   ├── /twilio
│   │   │   ├── /validation
│   │   │   ├── /whatsapp
│   │   │   └── Container.ts
│   │   ├── /assets
│   └── /config
```

### Descripción de Carpetas

- **`/.github`**: Configuraciones y flujos de trabajo para GitHub Actions.
- **`/config`**: Archivos de configuración global del proyecto.
- **`/dist`**: Código compilado generado automáticamente.
- **`/interfaces`**: Interfaces utilizadas en el proyecto.
- **`/swaggerdocs`**: Documentación de la API generada con Swagger.
- **`/src`**: Carpeta principal del código fuente.
    - **`/api`**: Lógica específica de la aplicación.
        - **`/application`**: Casos de uso de la aplicación.
        - **`/domain`**: Entidades y lógica de dominio.
        - **`/infrastructure`**: Implementaciones técnicas como controladores, modelos, repositorios y rutas.
        - **`/utils`**: Utilidades generales.
    - **`/shared`**: Código compartido entre diferentes partes de la aplicación.
        - **`/domain`**: Conceptos genéricos del dominio reutilizables.
        - **`/infrastructure`**: Servicios y utilidades compartidas.
            - **`/aws`**: Servicios relacionados con AWS.
            - **`/db`**: Configuración y servicios de base de datos.
            - **`/facturapi`**: Integración con FacturAPI.
            - **`/helpers`**: Funciones auxiliares.
            - **`/mercadopago`**: Integración con MercadoPago.
            - **`/middleware`**: Middlewares reutilizables.
            - **`/moment`**: Utilidades relacionadas con fechas.
            - **`/nodemailer`**: Configuración de correo electrónico.
            - **`/Regions`**: Gestión de regiones.
            - **`/routes`**: Definición de rutas.
            - **`/server`**: Configuración del servidor Express.
            - **`/socket`**: Servicios relacionados con WebSockets.
            - **`/twilio`**: Integración con Twilio.
            - **`/validation`**: Validaciones genéricas.
            - **`/whatsapp`**: Servicios relacionados con WhatsApp.
            - **`Container.ts`**: Contenedor de dependencias.
        - **`/assets`**: Archivos estáticos y recursos.
    - **`/config`**: Configuraciones específicas del proyecto.
- **`.gitignore`**: Archivos y carpetas ignorados por Git.
- **`app.ts`**: Archivo principal de la aplicación.
- **`ngrok.exe`**: Ejecutable para exponer el servidor local a internet.
- **`package-lock.json`**: Bloqueo de versiones de dependencias.
- **`package.json`**: Configuración del proyecto y scripts.
- **`README.md`**: Documentación principal del proyecto.
- **`swagger.ts`**: Configuración de Swagger.
- **`tsconfig.json`**: Configuración del compilador TypeScript.
```