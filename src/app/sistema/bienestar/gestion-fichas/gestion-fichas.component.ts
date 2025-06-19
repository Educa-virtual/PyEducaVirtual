import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroupModule } from 'primeng/inputgroup'
import { PrimengModule } from '@/app/primeng.module'
import { Router } from '@angular/router'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import {
    ESPECIALISTA_DREMO,
    ESPECIALISTA_UGEL,
} from '@/app/servicios/perfilesConstantes'

@Component({
    selector: 'app-gestion-fichas',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
    ],
    templateUrl: './gestion-fichas.component.html',
    styleUrls: ['./gestion-fichas.component.scss'],
})
export class GestionFichasComponent implements OnInit {
    @ViewChild('filtro') filtro: ElementRef
    fichas: Array<object>
    fichas_filtradas: Array<object>
    form: FormGroup
    iIieeId: number
    perfil: any

    private _messageService = inject(MessageService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private datosFichaBienestar: DatosFichaBienestarService,
        private store: LocalStoreService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
    }

    ngOnInit(): void {
        if (
            this.perfil.iPerfilId.includes([
                ESPECIALISTA_DREMO,
                ESPECIALISTA_UGEL,
            ])
        ) {
            this.columnasTabla = this.columnasTablaEspecialista
        }

        try {
            this.form = this.fb.group({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.store.getItem('dremoiYAcadId'),
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.datosFichaBienestar.listarFichas(this.form.value).subscribe({
            next: (data: any) => {
                this.fichas = data.data
                this.fichas_filtradas = this.fichas
            },
            error: (error) => {
                console.error('Error al obtener los estudiantes', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    filtrarTabla() {
        const filtro = this.filtro.nativeElement.value.toLowerCase()
        this.fichas_filtradas = this.fichas.filter((ficha: any) => {
            if (ficha.cPersApellidos.toLowerCase().includes(filtro))
                return ficha
            if (ficha.cPersNombre.toLowerCase().includes(filtro)) return ficha
            if (ficha.cGradoNombre.toLowerCase().includes(filtro)) return ficha
            if (ficha.cSeccionNombre.toLowerCase().includes(filtro))
                return ficha
            if (ficha.dtFichaDGFormateada.toLowerCase().includes(filtro))
                return ficha
            if (ficha.cGradoSeccion.toLowerCase().includes(filtro)) return ficha
            if (ficha.cIieeNombre.toLowerCase().includes(filtro)) return ficha
            if (ficha.cPersNombreApellidos.toLowerCase().includes(filtro))
                return ficha
            return null
        })
    }

    nuevoIngreso(): void {
        this.router.navigate(['/bienestar/ficha/general'])
    }

    accionBnt({ accion, item }) {
        switch (accion) {
            case 'imprimir':
                this.descargarFicha(item)
                break
            case 'eliminar':
                this._confirmService.openConfirm({
                    message: '¿Está seguro de anular la ficha seleccionada?',
                    header: 'Anular ficha',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.borrarFicha(item)
                    },
                })
                break
            default:
                console.warn('Acción no reconocida:', accion)
        }
    }

    descargarFicha(item: any): void {
        this.datosFichaBienestar
            .descargarFicha({
                iFichaDGId: item.iFichaDGId,
            })
            .subscribe({
                next: (response) => {
                    // const url = window.URL.createObjectURL(blob)
                    // window.open(url, '_blank')
                    const blob = new Blob([response], {
                        type: 'application/pdf',
                    })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.target = '_blank'
                    link.click()
                    // window.URL.revokeObjectURL(url)
                },
                error: (err) => {
                    console.error('Error al descargar el PDF:', err)
                    alert('No se pudo generar el PDF')
                },
            })
    }

    borrarFicha(item: any): void {
        this.datosFichaBienestar
            .borrarFicha({
                iFichaDGId: item.iFichaDGId,
            })
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Eliminación exitosa',
                        detail: 'Se eliminaron los datos',
                    })
                    this.fichas = this.fichas.filter(
                        (ficha: any) => ficha.iFichaDGId !== item.iFichaDGId
                    )
                    this.fichas_filtradas = this.fichas
                },
                error: (error) => {
                    console.error('Error eliminando fichas:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    public columnasTabla: IColumn[] = [
        {
            field: 'item',
            header: 'N°',
            type: 'item',
            width: '5%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombre',
            header: 'Nombres',
            type: 'text',
            width: '25%',
            text_header: 'left',
            text: 'left',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersApellidos',
            header: 'Apellidos',
            type: 'text',
            width: '30%',
            text_header: 'left',
            text: 'left',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombreApellidos',
            header: 'Nombres y Apelidos',
            type: 'text',
            width: '60%',
            text_header: 'left',
            text: 'left',
            class: 'table-cell md:hidden',
        },
        {
            field: 'cGradoNombre',
            header: 'Grado',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cSeccionNombre',
            header: 'Sección',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cGradoSeccion',
            header: 'Sección',
            type: 'text',
            width: '20%',
            text_header: 'center',
            text: 'center',
            class: 'table-cell md:hidden',
        },
        {
            field: 'dtFichaDGFormateada',
            header: 'Creación',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            type: 'actions',
            width: '10%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public columnasTablaEspecialista: IColumn[] = [
        {
            field: 'item',
            header: 'N°',
            type: 'item',
            width: '5%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cIieeNombre',
            header: 'I.E.',
            type: 'text',
            width: '20%',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'cPersNombre',
            header: 'Nombres',
            type: 'text',
            width: '20%',
            text_header: 'left',
            text: 'left',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersApellidos',
            header: 'Apellidos',
            type: 'text',
            width: '20%',
            text_header: 'left',
            text: 'left',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cPersNombreApellidos',
            header: 'Nombres y Apellidos',
            type: 'text',
            width: '55%',
            text_header: 'left',
            text: 'left',
            class: 'table-cell md:hidden',
        },
        {
            field: 'cGradoNombre',
            header: 'Grado',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cSeccionNombre',
            header: 'Sección',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cGradoSeccion',
            header: 'Sección',
            type: 'text',
            width: '20%',
            text_header: 'center',
            text: 'center',
            class: 'table-cell md:hidden',
        },
        {
            field: 'dtFichaDGFormateada',
            header: 'Creación',
            type: 'text',
            width: '10%',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            type: 'actions',
            width: '5%',
            field: '',
            header: 'Acciones',
            text_header: 'right',
            text: 'right',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Imprimir',
            icon: 'pi pi-print',
            accion: 'imprimir',
            type: 'item',
            class: 'p-button-rounded p-button-secondary p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
}
