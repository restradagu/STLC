# Instrucciones de Ejecución - STLC AI Assistant

## 🚀 Ejecutar la Aplicación

### Paso 1: Navegar al Directorio
```bash
cd stlc-ai-assistant
```

### Paso 2: Instalar Dependencias (si no está hecho)
```bash
npm install
```

### Paso 3: Ejecutar en Modo Desarrollo
```bash
npm run dev
```

### Paso 4: Abrir en Navegador
La aplicación estará disponible en: **http://localhost:5173**

## 🎭 Flujo de Demostración Recomendado

### 1. Dashboard Inicial
- Página de inicio muestra overview del proyecto
- Métricas en tiempo real y navegación visual
- Cards de fase con indicadores de progreso

### 2. Fase 1: Análisis de Requisitos
**Ruta**: Click en "Phase 1: Requirements Analysis" desde sidebar

**Demo Flow**:
1. Usar texto libre en "Business Context" o drag & drop un archivo
2. Click "Analyze with AI" 
3. Mostrar resultados: quality score, requisitos extraídos, validación
4. Navegar tabla de requisitos con filtros
5. Click "Complete Phase 1"

### 3. Fase 2: Planificación de Pruebas  
**Ruta**: Navegación automática o click en "Phase 2" desde sidebar

**Demo Flow**:
1. Completar wizard de 4 pasos con datos demo:
   - **Proyecto**: "E-Commerce Platform Testing"
   - **Objetivo**: "Ensure quality and performance of platform"
   - **Inclusions**: "User authentication", "Product catalog", "Shopping cart"
   - **Test Types**: Seleccionar Functional, API, Performance
   - **Team**: 4-6 people, Duration: 3-4 weeks
2. Click "Generate Plan"
3. Navegar por secciones del plan generado
4. Click "Approve Plan"

### 4. Fase 3: Desarrollo de Casos de Prueba
**Ruta**: Navegación automática o click en "Phase 3" desde sidebar

**Demo Flow**:
1. Configurar generación:
   - Mantener defaults: Positive ✓, Negative ✓, Boundary ✓
   - Seleccionar test types: Functional, UI, API
   - Complexity: Medium
2. Click "Generate Test Cases"
3. Explorar tabla de casos generados
4. Expandir filas para ver detalles
5. Demostrar filtros y búsqueda
6. Click "Export Test Suite"

## 📋 Casos de Uso Destacados

### Caso 1: Proyecto Completo (10 min)
Demostrar flujo completo desde requisitos hasta casos de prueba

### Caso 2: Focus en IA (5 min)  
Enfatizar capacidades de análisis y generación automática

### Caso 3: Focus en Productividad (5 min)
Mostrar rapidez vs. proceso manual tradicional

## 🎯 Puntos Clave para Destacar

### Durante Fase 1
- **Upload flexible**: Archivos o texto libre
- **Análisis inteligente**: Extracción automática + validación
- **Quality score**: 87% vs. proceso manual
- **Formato BDD**: Criterios Given-When-Then automáticos

### Durante Fase 2  
- **Wizard inteligente**: Autocompletado contextual
- **Plan completo**: 10 secciones profesionales
- **Estimaciones**: Cronograma y recursos automáticos
- **Export ready**: PDF listo para stakeholders

### Durante Fase 3
- **Generación masiva**: 24 casos en 30 segundos
- **Tipos múltiples**: Funcional, UI, API, Performance
- **Datos realistas**: Test data contextual
- **Gestión avanzada**: Filtros, búsqueda, bulk actions

## 🔧 Troubleshooting

### Aplicación No Carga
```bash
# Verificar puerto disponible
netstat -an | grep 5173

# Si puerto ocupado, usar otro
npm run dev -- --port 3000
```

### Dependencias Faltantes
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Errores de Build
```bash
# Limpiar cache
npm run build -- --clean
```

## 📱 Navegación de la App

### Sidebar Navigation
- **Dashboard**: Overview y métricas
- **Phase 1**: Requirements Analysis  
- **Phase 2**: Test Planning
- **Phase 3**: Test Case Development
- **Phase 4**: Environment Setup *(Próximamente)*
- **Phase 5**: Test Execution *(Próximamente)*
- **Phase 6**: Test Closure *(Próximamente)*

### Fases Futuras (Coming Soon)
Las fases 4-6 están marcadas como "Próximamente" con:
- Iconos de candado y reloj
- Tooltips informativos al hacer hover
- Badges "Próximamente" 
- No son clickeables (disabled)
- Muestran características futuras planificadas

### Atajos Útiles
- **Ctrl/Cmd + Click**: Abrir enlaces en nueva tab
- **Escape**: Cerrar modales y notificaciones
- **Auto-save**: Cada 5 segundos automáticamente

## 🎨 Features Avanzadas para Mostrar

### Estado Persistente
- Refresh página mantiene progreso
- Auto-save continuo en localStorage
- Recovery automático de sesión

### Responsive Design
- Funciona en desktop y tablet
- Sidebar colapsable
- Tables responsive con scroll horizontal

### Export Multi-formato
- **JSON**: Para integración técnica
- **PDF**: Para documentación formal  
- **Word**: Para edición collaborative

### Notificaciones Inteligentes
- Toast notifications para feedback
- Progress indicators en procesos largos
- Error handling graceful

## 💡 Tips para Demo Efectiva

### Preparación
1. Tener datos demo listos
2. Practicar navegación fluida
3. Conocer timing de cada sección
4. Preparar respuestas para preguntas frecuentes

### Durante Demo
1. Narrar lo que hace la IA mientras procesa
2. Destacar velocidad vs. proceso manual
3. Mostrar calidad de outputs generados
4. Enfatizar valor de negocio en cada step

### Manejo de Tiempo
- **5 min demo**: Solo highlights principales
- **10 min demo**: Flujo completo una pasada
- **15 min demo**: Flujo completo + Q&A
- **20+ min**: Deep dive técnico + customization

---

**La aplicación está diseñada para ser intuitiva y impressive. ¡Disfruta la demostración!**