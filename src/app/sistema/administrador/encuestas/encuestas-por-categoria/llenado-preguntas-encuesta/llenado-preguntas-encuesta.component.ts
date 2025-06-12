import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-llenado-preguntas-encuesta',
    standalone: true,
    imports: [PrimengModule, FormsModule],
    templateUrl: './llenado-preguntas-encuesta.component.html',
    styleUrl: './llenado-preguntas-encuesta.component.scss',
})
export class LlenadoPreguntasEncuestaComponent implements OnInit {
    breadCrumbItems: MenuItem[] = []
    titleLLenadoPreguntasEncuesta: string = 'Encuesta: Satisfacción Académica'
    selectedItem: any
    totalPreguntas: number = 3
    nIndexAcordionTab: number = null
    
    // Configuración del editor
    init: any = {
        base_url: '/tinymce',
        suffix: '.min',
        menubar: false,
        selector: 'textarea',
        placeholder: 'Escriba aquí...',
        plugins: 'lists image table',
        toolbar: 'undo redo | forecolor backcolor | bold italic underline strikethrough | ' +
                'alignleft aligncenter alignright alignjustify fontsize | bullist numlist | ' +
                'image table',
        height: 200,
        editable_root: true,
    }

    // Estructura simplificada: solo secciones con preguntas directas
    secciones = [
        {
            id: 1,
            titulo: 'SECCIÓN 1: DATOS GENERALES',
            expandida: true,
            preguntas: [
                {
                    id: 1,
                    title: 'Pregunta #1: ¿Cuál es su edad?',
                    cPregunta: '¿Cuál es su edad?',
                    expandida: false,
                    alternativas: [
                        { iAlternativaId: 1, cAlternativaLetra: 'A', cAlternativaDescripcion: '18-25 años', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 2, cAlternativaLetra: 'B', cAlternativaDescripcion: '26-35 años', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 3, cAlternativaLetra: 'C', cAlternativaDescripcion: '36-45 años', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 4, cAlternativaLetra: 'D', cAlternativaDescripcion: 'Más de 45 años', bAlternativaCorrecta: false, cAlternativaExplicacion: '' }
                    ]
                },
                {
                    id: 2,
                    title: 'Pregunta #2: ¿Cuál es su nivel educativo?',
                    cPregunta: '¿Cuál es su nivel educativo más alto completado?',
                    expandida: false,
                    alternativas: [
                        { iAlternativaId: 5, cAlternativaLetra: 'A', cAlternativaDescripcion: 'Secundaria', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 6, cAlternativaLetra: 'B', cAlternativaDescripcion: 'Técnico', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 7, cAlternativaLetra: 'C', cAlternativaDescripcion: 'Universitario', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 8, cAlternativaLetra: 'D', cAlternativaDescripcion: 'Postgrado', bAlternativaCorrecta: false, cAlternativaExplicacion: '' }
                    ]
                }
            ]
        },
        {
            id: 2,
            titulo: 'SECCIÓN 2: MONITOREO Y SEGUIMIENTO',
            expandida: false,
            preguntas: [
                {
                    id: 3,
                    title: 'Pregunta #3: ¿Con qué frecuencia realiza monitoreo?',
                    cPregunta: '¿Con qué frecuencia realiza actividades de monitoreo?',
                    expandida: false,
                    alternativas: [
                        { iAlternativaId: 9, cAlternativaLetra: 'A', cAlternativaDescripcion: 'Diariamente', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 10, cAlternativaLetra: 'B', cAlternativaDescripcion: 'Semanalmente', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                        { iAlternativaId: 11, cAlternativaLetra: 'C', cAlternativaDescripcion: 'Mensualmente', bAlternativaCorrecta: false, cAlternativaExplicacion: '' }
                    ]
                }
            ]
        }
    ]
pregunta: any

    constructor(
        private messageService: MessageService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit() {
        console.log('Inicializando llenado de preguntas de encuesta')
        this.calcularTotalPreguntas()
    }

    // Calcular total de preguntas
    calcularTotalPreguntas() {
        this.totalPreguntas = this.secciones.reduce((total, seccion) => total + seccion.preguntas.length, 0)
    }

    // Métodos para gestionar secciones
    toggleSeccion(seccion: any) {
        seccion.expandida = !seccion.expandida
    }

    eliminarSeccion(seccion: any) {
        this.confirmationModalService.openConfirm({
            header: `¿Está seguro de eliminar la sección "${seccion.titulo}"?`,
            accept: () => {
                const index = this.secciones.findIndex(s => s.id === seccion.id)
                if (index !== -1) {
                    this.secciones.splice(index, 1)
                    this.calcularTotalPreguntas()
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sección eliminada',
                        detail: 'La sección ha sido eliminada correctamente'
                    })
                }
            }
        })
    }

    duplicarSeccion(seccion: any) {
        const nuevaSeccion = {
            ...seccion,
            id: this.secciones.length + 1,
            titulo: seccion.titulo + ' (Copia)',
            preguntas: seccion.preguntas.map(p => ({
                ...p, 
                id: Date.now() + Math.random(),
                alternativas: p.alternativas.map(alt => ({...alt, iAlternativaId: Date.now() + Math.random()}))
            }))
        }
        this.secciones.push(nuevaSeccion)
        this.calcularTotalPreguntas()
        this.messageService.add({
            severity: 'success',
            summary: 'Sección duplicada',
            detail: 'La sección ha sido duplicada correctamente'
        })
    }

    agregarSeccion() {
        const nuevaSeccion = {
            id: this.secciones.length + 1,
            titulo: `SECCIÓN ${this.secciones.length + 1}: NUEVA SECCIÓN`,
            expandida: true,
            preguntas: []
        }
        this.secciones.push(nuevaSeccion)
        this.messageService.add({
            severity: 'success',
            summary: 'Sección agregada',
            detail: 'Nueva sección creada correctamente'
        })
    }

    eliminarPregunta(seccionId: number, pregunta: any) {
        this.confirmationModalService.openConfirm({
            header: `¿Está seguro de eliminar "${pregunta.title}"?`,
            accept: () => {
                const seccion = this.secciones.find(s => s.id === seccionId)
                if (seccion) {
                    const index = seccion.preguntas.findIndex(p => p.id === pregunta.id)
                    if (index !== -1) {
                        seccion.preguntas.splice(index, 1)
                        this.calcularTotalPreguntas()
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Pregunta eliminada',
                            detail: 'La pregunta ha sido eliminada correctamente'
                        })
                    }
                }
            }
        })
    }

    agregarPregunta(seccion: any) {
        const numeroPregunta = this.totalPreguntas + 1
        const nuevaPregunta = {
            id: Date.now(),
            title: `Pregunta #${numeroPregunta}: Nueva pregunta`,
            cPregunta: 'Nueva pregunta',
            expandida: true,
            alternativas: [
                { iAlternativaId: Date.now() + 1, cAlternativaLetra: 'A', cAlternativaDescripcion: 'Opción A', bAlternativaCorrecta: false, cAlternativaExplicacion: '' },
                { iAlternativaId: Date.now() + 2, cAlternativaLetra: 'B', cAlternativaDescripcion: 'Opción B', bAlternativaCorrecta: false, cAlternativaExplicacion: '' }
            ]
        }
        
        seccion.preguntas.push(nuevaPregunta)
        this.calcularTotalPreguntas()
        this.messageService.add({
            severity: 'success',
            summary: 'Pregunta agregada',
            detail: 'Nueva pregunta creada correctamente'
        })
    }

    agregarAlternativa(pregunta: any) {
        const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        const nuevaLetra = letras[pregunta.alternativas.length]
        
        if (nuevaLetra) {
            pregunta.alternativas.push({
                iAlternativaId: Date.now(),
                cAlternativaLetra: nuevaLetra,
                cAlternativaDescripcion: `Opción ${nuevaLetra}`,
                bAlternativaCorrecta: false,
                cAlternativaExplicacion: ''
            })
        }
    }

    eliminarAlternativa(pregunta: any, index: number) {
        if (pregunta.alternativas.length > 2) {
            pregunta.alternativas.splice(index, 1)
            // Reordenar las letras
            const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
            pregunta.alternativas.forEach((alt: any, i: number) => {
                alt.cAlternativaLetra = letras[i]
            })
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe tener al menos 2 alternativas'
            })
        }
    }

    cambiarEstadoCheckbox(iAlternativaId: any, alternativas: any[]) {
        // Solo permitimos una opción seleccionada a la vez
        alternativas.forEach((alternativa) => {
            if (alternativa.iAlternativaId != iAlternativaId) {
                alternativa.bAlternativaCorrecta = false
                alternativa.cAlternativaExplicacion = ''
            }
        })
    }

    guardarPregunta(pregunta: any) {
        // Validaciones
        if (!pregunta.cPregunta || pregunta.cPregunta.trim() === '') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'La pregunta no puede estar vacía'
            })
            return
        }

        if (pregunta.alternativas.some((alt: any) => !alt.cAlternativaDescripcion || alt.cAlternativaDescripcion.trim() === '')) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Todas las alternativas deben tener descripción'
            })
            return
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Pregunta guardada',
            detail: 'La pregunta ha sido guardada correctamente'
        })
        
        pregunta.expandida = false
    }

    vistaPrevia() {
        this.messageService.add({
            severity: 'info',
            summary: 'Vista previa',
            detail: 'Cargando vista previa de la encuesta...'
        })
    }

    configuracion() {
        this.messageService.add({
            severity: 'info',
            summary: 'Configuración',
            detail: 'Abriendo configuración de la encuesta...'
        })
    }
}