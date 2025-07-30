import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ResponderSugerenciaComponent } from '../responder-sugerencia/responder-sugerencia.component'
import { BuzonSugerenciasDirectorService } from '../services/buzon-sugerencias-director.service'
@Component({
    selector: 'app-lista-sugerencias',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        ResponderSugerenciaComponent,
    ],
    templateUrl: './lista-sugerencias.component.html',
    styleUrl: './lista-sugerencias.component.scss',
})
export class ListaSugerenciasComponent implements OnInit {
    title: string = 'Buzón de sugerencias - Director'
    prioridades: any[]
    mostrarFormularioVer: boolean = false
    mostrarFormularioResponder: boolean = false
    //perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'))
    selectedItem: any
    cerrarResponderSugerencia: boolean = false
    //breadcrumb
    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem
    dataSugerencias: any[]

    // datos hardcodeados tabla
    /*dataSugerencias = [
        {
            item: 1,
            iSugerenciaId: 1,
            dtFechaCreacion: new Date('2025-04-20'),
            cAsunto: 'Mejora en materiales de clase',
            cPrioridadNombre: 'Alta',
            cNombreEstudiante: 'Juan Pérez',
            cRespuesta: '',
            cSugerencia:
                'Sería bueno tener acceso a más material digital para las clases de matemáticas.',
        },
        {
            item: 2,
            iSugerenciaId: 2,
            dtFechaCreacion: new Date('2025-04-15'),
            cAsunto: 'Problema con horarios',
            cPrioridadNombre: 'Media',
            cNombreEstudiante: 'María Rodríguez',
            cRespuesta: '13/05/2025',
            cSugerencia:
                'Hay un solapamiento en los horarios de física y química para el grupo A.',
        },
        {
            item: 3,
            iSugerenciaId: 3,
            dtFechaCreacion: new Date('2025-04-10'),
            cAsunto: 'Solicitud de taller adicional',
            cPrioridadNombre: 'Baja',
            cNombreEstudiante: 'Carlos Gómez',
            cRespuesta: '',
            cSugerencia:
                'Muchos estudiantes estamos interesados en tener un taller de programación después de clases.',
        },
        {
            item: 4,
            iSugerenciaId: 4,
            dtFechaCreacion: new Date('2025-04-05'),
            cAsunto: 'Mejoras en la cafetería',
            cPrioridadNombre: 'Media',
            cNombreEstudiante: 'Ana Martínez',
            cRespuesta: '13/05/2025',
            cSugerencia:
                'Sería bueno incluir opciones vegetarianas en el menú de la cafetería.',
        },
        {
            item: 5,
            iSugerenciaId: 5,
            dtFechaCreacion: new Date('2025-04-01'),
            cAsunto: 'Problema con la plataforma virtual',
            cPrioridadNombre: 'Alta',
            cNombreEstudiante: 'Luis Sánchez',
            cRespuesta: '',
            cSugerencia:
                'La plataforma virtual se cae frecuentemente durante las horas pico.',
        },
    ]*/

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '3rem',
            field: 'dtFechaCreacion',
            header: 'Fecha de sugerencia',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '5rem',
            field: 'cNombreEstudiante',
            header: 'Estudiante',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '12rem',
            field: 'cAsunto',
            header: 'Asunto',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'tag',
            width: '2rem',
            field: 'cPrioridadNombre',
            header: 'Prioridad',
            styles: {
                Alta: 'danger',
                Baja: 'success',
                Media: 'warning',
            },
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '6rem',
            field: 'dtFechaRespuesta',
            header: 'Fecha respuesta',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item-innerHtml',
            width: '8rem',
            field: 'cRespuesta',
            header: 'Respuesta',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    constructor(
        private buzonSugerenciasDirectorService: BuzonSugerenciasDirectorService,
        private messageService: MessageService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit() {
        this.obtenerListaSugerencias()
    }

    obtenerListaSugerencias() {
        this.buzonSugerenciasDirectorService
            .obtenerListaSugerencias()
            .subscribe({
                next: (data: any) => {
                    this.dataSugerencias = data.data
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Problema al obtener sugerencias',
                        detail: error.error.message,
                    })
                },
            })
    }

    actions: IActionTable[] = [
        /*{
            labelTooltip: 'Ver sugerencia',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },*/
        {
            labelTooltip: 'Responder sugerencia',
            icon: 'pi pi-pen-to-square',
            accion: 'responder',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
            // se mantiene visible para que se pueda responder sugerencia  solo si no tiene respuesta
            //isVisible: (row) => {
            //return !row.cRespuesta || row.cRespuesta === ''
            //},
        },
    ]

    accionBtnItemTable({ accion, item }) {
        switch (accion) {
            case 'responder':
                this.selectedItem = item
                this.responderSugerencia()
                break
        }
    }

    responderSugerencia() {
        this.mostrarFormularioResponder = true
    }

    listenSugerenciaRespondida(event: any) {
        this.mostrarFormularioResponder = false
        this.selectedItem.cRespuesta = event.respuesta
        this.selectedItem.dtFechaRespuesta = new Date(event.fecha)
        this.dataSugerencias = this.dataSugerencias.map((sug) => {
            if (sug.iSugerenciaId === this.selectedItem.iSugerenciaId) {
                return {
                    ...sug,
                    cRespuesta: event.respuesta,
                    dtFechaRespuesta: new Date(event.fecha),
                }
            }
            return sug
        })
    }

    listenCerrarResponderSugerencia(event: boolean) {
        if (event == false) {
            this.mostrarFormularioResponder = false
        }
    }
}
