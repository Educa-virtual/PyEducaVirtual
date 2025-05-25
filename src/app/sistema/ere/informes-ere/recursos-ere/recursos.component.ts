import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { FormGroup } from '@angular/forms'

interface Recurso {
    id: number
    area: string
    cuadernillo: string
    hojaRespuestas: string
    matriz: string
    estado: string
}

interface Column {
    field: string
    header: string
}

// Interface EstadoRecurso
interface EstadoRecurso {
    label: string
    icon: string
    severity:
        | 'success'
        | 'info'
        | 'warning'
        | 'danger'
        | 'help'
        | 'primary'
        | 'secondary'
        | 'contrast'
    accion: string
}

@Component({
    selector: 'app-recursos',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './recursos.component.html',
    styleUrl: './recursos.component.scss',
})
export class RecursosComponent implements OnInit {
    title: string = 'Lista de áreas de PRUEBA DE INICIO 2025 - nivel Inicio'
    segundoGrado: string = '2º Grado'
    cuartoGrado: string = '4º Grado'
    sextoGrado: string = '6º Grado'

    // Datos para breadcrumb
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    datosRecursosFiltrados: any[] = []
    datosRecursos4toFiltrados: any[] = []
    datosRecursos6toFiltrados: any[] = []

    // Estado de los diálogos
    mostrarDialogoEdicion: boolean = false
    mostrarDialogoConfiguracion: boolean = false
    recursoEditando: Recurso | null = null

    // Panel propiedades
    wordDescargado: boolean = false
    archivoSubido: boolean = false
    nombreArchivoSubido: string = ''
    archivoSeleccionado: File | null = null

    // Formulario de edición
    formularioEdicion = {
        area: '',
        estado: '',
        observaciones: '',
    }

    // Opciones para dropdowns
    opcionesAreas: string[] = [
        'Matemática',
        'Comunicación',
        'Ciencia y Tecnología',
        'Personal Social',
    ]
    opcionesEstados = [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Completo', value: 'completo' },
        { label: 'En Revisión', value: 'revision' },
        { label: 'Aprobado', value: 'aprobado' },
    ]

    // Estados de carga
    loadingActions: { [key: string]: boolean } = {}

    // Fecha actual para mostrar en el dialog
    fechaActual: Date = new Date()

    // Definición de estados
    estadosRecurso: { [key: string]: EstadoRecurso } = {
        completo: {
            label: 'Completo',
            icon: 'pi pi-eye',
            severity: 'success',
            accion: 'ver',
        },
        pendiente: {
            label: 'Pendiente',
            icon: 'pi pi-arrow-right',
            severity: 'warning',
            accion: 'completar',
        },
    }

    // Datos para la tabla 2do grado
    recursos!: Recurso[]

    // Datos para 4to grado
    recursos4to!: Recurso[]

    // Datos para 6to grado
    recursos6to!: Recurso[]

    cols!: Column[]
    terminoBusqueda: string = ''
    selectedItem: any

    // Propiedades steeper
    activeStep: number = 0
    totalSteps: number = 2
    cuadernilloFormGroup!: FormGroup

    constructor(
        private messageService: MessageService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit(): void {
        console.log('Inicializando componente Recursos')

        // home / breadcrumb
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/inicio',
        }

        this.breadCrumbItems = [{ label: 'Recursos' }]

        // Inicializar datos de recursos 2do grado
        this.recursos = [
            {
                id: 1,
                area: 'Matemática',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
            {
                id: 2,
                area: 'Comunicación',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
        ]

        // Inicializar datos de recursos 4to grado
        this.recursos4to = [
            {
                id: 1,
                area: 'Matemática',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
            {
                id: 2,
                area: 'Comunicación',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'completo',
            },
        ]

        // Inicializar datos de recursos 6to grado
        this.recursos6to = [
            {
                id: 1,
                area: 'Matemática',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
            {
                id: 2,
                area: 'Comunicación',
                cuadernillo: 'PDF',
                hojaRespuestas: 'PDF',
                matriz: 'PDF',
                estado: 'pendiente',
            },
        ]

        // Definir columnas
        this.cols = [
            { field: 'id', header: '#' },
            { field: 'area', header: 'Área' },
            { field: 'cuadernillo', header: 'Cuadernillo de Evaluación' },
            { field: 'hojaRespuestas', header: 'Hoja de respuestas' },
            { field: 'matriz', header: 'Matriz de Evaluación' },
            { field: 'Resultado', header: 'Resultado' },
        ]

        // Inicializar datos filtrados
        this.datosRecursosFiltrados = [...this.recursos]
        this.datosRecursos4toFiltrados = [...this.recursos4to]
        this.datosRecursos6toFiltrados = [...this.recursos6to]
    }

    // Filtrar recursos
    filtrarRecursos() {
        if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
            this.datosRecursosFiltrados = [...this.recursos]
            this.datosRecursos4toFiltrados = [...this.recursos4to]
            this.datosRecursos6toFiltrados = [...this.recursos6to]
        } else {
            const termino = this.terminoBusqueda.toLowerCase().trim()

            this.datosRecursosFiltrados = this.recursos.filter((recurso) =>
                recurso.area.toLowerCase().includes(termino)
            )

            this.datosRecursos4toFiltrados = this.recursos4to.filter(
                (recurso) => recurso.area.toLowerCase().includes(termino)
            )

            this.datosRecursos6toFiltrados = this.recursos6to.filter(
                (recurso) => recurso.area.toLowerCase().includes(termino)
            )
        }
    }

    // Limpiar búsqueda
    limpiarBusqueda() {
        this.terminoBusqueda = ''
        this.datosRecursosFiltrados = [...this.recursos]
        this.datosRecursos4toFiltrados = [...this.recursos4to]
        this.datosRecursos6toFiltrados = [...this.recursos6to]
    }

    // Ejecutar acciones según el estado
    ejecutarAccion(accion: string, recurso: Recurso) {
        switch (accion) {
            case 'completar':
                this.completarEvaluacion(recurso)
                break
            case 'ver':
                this.verResultados(recurso)
                break
            case 'revisar':
                this.revisarRecurso(recurso)
                break
        }
    }

    // Acciones de botones
    descargarPDF(tipo: string, recurso: Recurso) {
        this.messageService.add({
            severity: 'success',
            summary: 'Descarga',
            detail: `Descargando ${tipo} de ${recurso.area}`,
        })
    }

    completarEvaluacion(recurso: Recurso) {
        this.messageService.add({
            severity: 'info',
            summary: 'Completar',
            detail: `Completando evaluación de ${recurso.area}`,
        })

        // Cambiar estado a completo
        recurso.estado = 'completo'
    }

    verResultados(recurso: Recurso) {
        this.messageService.add({
            severity: 'info',
            summary: 'Ver resultados',
            detail: `Viendo resultados de ${recurso.area}`,
        })
    }

    revisarRecurso(recurso: Recurso) {
        this.messageService.add({
            severity: 'info',
            summary: 'Revisar',
            detail: `Revisando recurso de ${recurso.area}`,
        })
    }

    // Abrir diálogo de edición
    abrirDialogoEdicion(recurso: Recurso) {
        this.recursoEditando = { ...recurso }
        this.formularioEdicion = {
            area: recurso.area,
            estado: recurso.estado,
            observaciones: '',
        }
        this.mostrarDialogoEdicion = true
    }

    // Guardar edición
    guardarEdicion() {
        if (!this.recursoEditando) return

        this.loadingActions['save-edit'] = true

        setTimeout(() => {
            // Buscar el recurso original en todas las listas
            const recursoOriginal = this.buscarRecursoOriginal(
                this.recursoEditando!.id
            )

            if (recursoOriginal) {
                recursoOriginal.area = this.formularioEdicion.area
                recursoOriginal.estado = this.formularioEdicion.estado
            }

            this.loadingActions['save-edit'] = false
            this.mostrarDialogoEdicion = false

            this.messageService.add({
                severity: 'success',
                summary: 'Recurso Actualizado',
                detail: `${this.formularioEdicion.area} ha sido actualizado correctamente`,
            })

            // Actualizar filtros
            this.filtrarRecursos()

            // Limpiar
            this.recursoEditando = null
        }, 1500)
    }

    // Restablecer formulario
    restablecerFormulario() {
        if (this.recursoEditando) {
            this.formularioEdicion = {
                area: this.recursoEditando.area,
                estado: this.recursoEditando.estado,
                observaciones: '',
            }

            this.messageService.add({
                severity: 'info',
                summary: 'Formulario Restablecido',
                detail: 'Se han restaurado los valores originales',
            })
        }
    }

    // Validar formulario
    formularioValido(): boolean {
        return !!(this.formularioEdicion.area && this.formularioEdicion.estado)
    }

    // Buscar recurso original por ID
    private buscarRecursoOriginal(id: number): Recurso | undefined {
        return (
            this.recursos.find((r) => r.id === id) ||
            this.recursos4to.find((r) => r.id === id) ||
            this.recursos6to.find((r) => r.id === id)
        )
    }

    // Verificar si una acción está cargando
    isActionLoading(action: string, id?: number): boolean {
        const key = id ? `${action}-${id}` : action
        return this.loadingActions[key] || false
    }

    // Obtener texto del estado
    obtenerTextoEstado(estado: string): string {
        return this.estadosRecurso[estado]?.label || estado
    }

    // Obtener severity del estado
    obtenerSeverityEstado(estado: string): string {
        return this.estadosRecurso[estado]?.severity || 'secondary'
    }

    // PANEL

    // Descargar archivo WORD
    descargarWord() {
        this.loadingActions['download-word'] = true

        // Simular descarga
        setTimeout(() => {
            this.loadingActions['download-word'] = false
            this.wordDescargado = true

            this.messageService.add({
                severity: 'success',
                summary: 'Descarga Exitosa',
                detail: 'El archivo WORD ha sido descargado correctamente',
            })
        }, 2000)
    }

    // Seleccionar archivo PDF
    onFileSelect(event: any) {
        const file = event.files[0]

        if (file) {
            // Validar que sea PDF
            if (file.type !== 'application/pdf') {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Archivo Inválido',
                    detail: 'Solo se permiten archivos PDF',
                })
                return
            }

            // Validar tamaño (máximo 10MB)
            if (file.size > 10000000) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Archivo muy grande',
                    detail: 'El archivo no debe superar los 10MB',
                })
                return
            }

            this.archivoSeleccionado = file
            this.nombreArchivoSubido = file.name
            this.archivoSubido = true

            this.messageService.add({
                severity: 'success',
                summary: 'Archivo Seleccionado',
                detail: `${file.name} ha sido seleccionado correctamente`,
            })
        }
    }

    // Cambiar archivo seleccionado
    cambiarArchivo() {
        this.archivoSubido = false
        this.nombreArchivoSubido = ''
        this.archivoSeleccionado = null

        this.messageService.add({
            severity: 'info',
            summary: 'Archivo Removido',
            detail: 'Puedes seleccionar un nuevo archivo',
        })
    }

    // Siguiente paso
    siguientePaso() {
        if (!this.wordDescargado) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Paso Incompleto',
                detail: 'Primero debes descargar el archivo WORD',
            })
            return
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Siguiente Paso',
            detail: 'Ahora puedes subir tu archivo PDF',
        })
    }

    // Finalizar proceso
    finalizarProceso() {
        if (!this.archivoSubido || !this.archivoSeleccionado) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Proceso Incompleto',
                detail: 'Debes subir un archivo PDF para continuar',
            })
            return
        }

        this.loadingActions['finalizar'] = true

        // Simular subida de archivo
        setTimeout(() => {
            this.loadingActions['finalizar'] = false

            // Actualizar el recurso
            if (this.recursoEditando) {
                this.recursoEditando.estado = 'completo'

                // Buscar y actualizar el recurso original
                const recursoOriginal = this.buscarRecursoOriginal(
                    this.recursoEditando.id
                )
                if (recursoOriginal) {
                    recursoOriginal.estado = 'completo'
                }
            }

            this.mostrarDialogoEdicion = false
            this.resetearPanelDosColumnas()

            this.messageService.add({
                severity: 'success',
                summary: 'Proceso Completado',
                detail: 'El cuadernillo ha sido generado exitosamente',
            })

            // Actualizar filtros
            this.filtrarRecursos()
        }, 3000)
    }

    // Resetear Panel
    private resetearPanelDosColumnas() {
        this.wordDescargado = false
        this.archivoSubido = false
        this.nombreArchivoSubido = ''
        this.archivoSeleccionado = null
        this.recursoEditando = null
    }

    // Sobrescribir el método cancelarEdicion existente
    cancelarEdicion() {
        this.mostrarDialogoEdicion = false
        this.resetearPanelDosColumnas()

        this.messageService.add({
            severity: 'info',
            summary: 'Proceso Cancelado',
            detail: 'El proceso ha sido cancelado',
        })
    }

    // Navegación panel
    handleNext(): void {
        if (this.activeStep === 0) {
            if (!this.wordDescargado) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Paso requerido',
                    detail: 'Primero debes descargar el archivo WORD',
                })
                return
            }
        }

        if (this.activeStep < this.totalSteps - 1) {
            this.activeStep++
        }
    }

    handlePrevious(): void {
        if (this.activeStep > 0) {
            this.activeStep--
        }
    }

    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }
}
