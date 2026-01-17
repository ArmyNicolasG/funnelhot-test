# Prueba técnica Funnelhot - Nicolás Galeano

## Correr proyecto de forma local
1. Clonar el repositorio
```
git clone https://github.com/ArmyNicolasG/funnelhot-test
cd funnelhot-test
```

2. Instalar dependencias
```
npm i -y
```

3. Levantar servidor web local
```
npm run dev
```

# Prioridades
En este proyecto se priorizó el mantener la modularidad, patrones de arquitectura sólidos y principios de patrones de diseño como SOLID, con el fin de asegurar escalabilidad a futuro y orden en el código. Adicionalmente, se busca una interfaz bonita y amigable con el usuario.
Otro factor que se tuvo como prioridad en el proyecto fue la integridad de los datos existentes y la "base de datos" en memoria, de modo que, cuando el usuario intentase ingresar valores no válidos, esto se complementaba con alertas e indicaciones que hacían que no se presentaran bugs o roturas. Y cuando se guardase la información esta quedase asociada y coherente, como por ejemplo, al editar reglas de asistentes y volver a consultarlos, o el volver a mostrar los mensajes y su historial.
El tiempo dedicado al mismo fue de aproximadamente 6 horas.
En el apartado de tecnologías se da un detalle técnico indivual del por qué de cada tecnología.

# Features relevantes integradas
A continuación, se describen las features que se integran en el proyecto siguiendo el documento de requisitos

### 1. Página inicial
Se muestra la lista de asistentes con sus diferentes opciones y configuraciones. Cuenta también con los botones de entrenamiento y edición:

<img width="1279" height="626" alt="image" src="https://github.com/user-attachments/assets/8f8bd915-615d-46c2-8acd-9255c3cc2e7d" />

Se incluye componente que de forma amigable indica que no hay asistentes creados en caso de que se eliminen en su totalidad:

<img width="1243" height="476" alt="image" src="https://github.com/user-attachments/assets/dbfc5dd1-e73d-4fa6-b949-6cb4653e27c1" />

### 2. Modal de creación/edición de asistentes
Cuenta con dos pasos para ingresar la información y campos del mismo, entre las que se incluyen: nombre, idioma, tono, longitud de las respuestas y capacidad para manejar respuestas de audio. También, se incluye validación de los valores ingresados:

<img width="722" height="497" alt="image" src="https://github.com/user-attachments/assets/7ef000f6-7dd9-4e98-9d6c-10347ef0250c" />
<img width="715" height="644" alt="image" src="https://github.com/user-attachments/assets/5178a248-8d87-4169-8b00-e1a31eec3082" />

### 3. Página de entrenamiento y simulador de chat
En esta página se pueden modificar las reglas del asistente y simular un chat con el mismo, además de que las reglas y el historial del chat persisten en memoria, así que al salir y volver a ingresar a la vista del asistente, se conservan las reglas y el chat:

<img width="1389" height="763" alt="image" src="https://github.com/user-attachments/assets/7f67c57e-d8e0-4a53-8c69-19205e7f7d39" />

Entre otras...

# Tecnologías

- **Next.js + TypeScript**
  - Ruteo por medio del filesystem (`/` y `/assistant/[id]`) y componentes procesados del lado del cliente con `'use client'`.
  - Tipado fuerte para modelos, DTOs e interfaces entre capas.

- **Tailwind CSS**
  - Estilos utilitarios, responsive y micro-animaciones usadas para las transiciones cortas en cards, botones, modales y diálogos).
  - Paleta de colores centralizada en el archivo `tailwind.config.cjs`

- **Zustand**
  - Estado global de UI y sesión para control del modal multi-paso (open/close, modo, paso), diálogos globales, confirmaciones, estado de tips de entrenamiento e historial de chat por asistente

- **TanStack React Query**
  - Manejo de estado asíncrono y cache por queries para obtener asistentes y detalle de los mismo, mutaciones para crear, editar o eliminar.
  - Invalidación de cache post-mutation y optimistic updates en eliminación con rollback en error.

- **React Hook Form**
  - Manejo de formularios con validación y baja re-renderización
  - Modal multi-paso con un solo `form` y submit final controlado.

---

## Patrones de diseño y arquitectura

- **Separación de responsabilidades por capas**
  - **UI**: páginas en `app/` y componentes en `components/`.
  - **Dominio**: modelos y DTOs en `lib/types`.
  - **Acceso a datos**: servicios en `lib/services`, donde se encuentra un Mock en memoria que simula la conexión al backend

- **Repositorio (en este caso es un Mock de capa de acceso a datos)**
  - `assistantService` encapsula CRUD y simula persistencia en memoria
  - `chatService` se encarga de la generación de respuestas simuladas.

- **Single Source of Truth por tipo de estado**
  - **Server state** React Query para cache, refetch, e invalidación.
  - **Estados UI** Zustand para modales, diálogos y navegación de pasos
  - **States de los formularios** React Hook Form para campos y validaciones.

- **Optimistic UI (UX-first)**
  - Eliminación de asistentes con actualización optimista del cache y rollback ante error `onMutate/onError/onSettled`.

- **Flujo multi-paso controlado**
  - “Siguiente” en paso 1 valida y avanza el step, sin ejecutar mutación.
  - Guardado real ocurre en el paso final, manteniendo consistencia y evitando submits prematuros.

- **Composición de componentes**
  - Componentes reutilizables para diálogos, cards, modales, empty states y chat simulado, reduciendo el acoplamiento y mejorando la mantenibilidad.












