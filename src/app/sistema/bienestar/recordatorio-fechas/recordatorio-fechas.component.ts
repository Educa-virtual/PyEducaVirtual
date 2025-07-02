import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DatosRecordatorioService } from '../services/datos-recordatorio.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-recordatorio-fechas',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './recordatorio-fechas.component.html',
    styleUrl: './recordatorio-fechas.component.scss',
})
export class RecordatorioFechasComponent implements OnInit {
    @ViewChild('filtro') filtro: ElementRef
    cumpleanios: Array<object> = []
    cumpleanios_filtrados: Array<object> = []
    form: FormGroup
    perfil: any
    iYAcadId: any
    periodos: Array<object>
    recordatorio_activo: boolean = false
    visibleDialog: boolean = false

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private datosRecordatorio: DatosRecordatorioService,
        private store: LocalStoreService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            iCredEntPerfId: [this.perfil.iCredEntPerfId],
            iRecorPeriodoId: [null],
            iPersId: [null],
            iYAcadId: [this.iYAcadId],
        })

        this.datosRecordatorio
            .verRecordatorioPeriodos()
            .subscribe((data: any) => {
                this.periodos = this.datosRecordatorio.getPeriodos(data)
            })

        this.verCumpleanios()
    }

    verCumpleanios() {
        this.datosRecordatorio
            .verFechasEspeciales({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    this.cumpleanios = data.data
                    this.cumpleanios_filtrados = this.cumpleanios
                },
                error: (error) => {
                    console.error('Error al obtener cumpleanos:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    editarRecordatorio(item: any) {
        this.visibleDialog = true
        this.verRecordatorio(item?.iPersId)
    }

    verRecordatorio(iPersId: any) {
        this.datosRecordatorio
            .verConfRecordatorio({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iPersId: iPersId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.setFormRecordatorio(data.data[0])
                    } else {
                        this.setFormRecordatorio({
                            iCredEntPerfId: this.perfil.iCredEntPerfId,
                            iRecorPeriodoId: null,
                            iPersId: iPersId,
                            iYAcadId: this.iYAcadId,
                        })
                    }
                },
                error: (error) => {
                    console.error('Error al obtener recordatorio:', error)
                },
            })
    }

    setFormRecordatorio(data: any) {
        this.form.reset()
        if (data) {
            this.form.patchValue(data)
            this.datosRecordatorio.formatearFormControl(
                this.form,
                'iRecorPeriodoId',
                +data.iRecorPeriodoId,
                'number'
            )
        }
    }

    actualizarConfRecordatorio() {
        this.datosRecordatorio
            .actualizarConfReordatorio(this.form.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    this.visibleDialog = false
                    this.verCumpleanios()
                },
                error: (error) => {
                    console.error('Error actualizando recordatorio:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    clearForm() {
        this.form.reset()
    }

    /* Filtrar tabla según búsqueda */
    filtrarTabla() {
        if (!this.cumpleanios) {
            return []
        }
        const filtro = this.filtro.nativeElement.value.toLowerCase()
        this.cumpleanios_filtrados = this.cumpleanios.filter((cumple: any) => {
            if (
                cumple.iCumpleaniosDiff
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            ) {
                return cumple
            }
            if (
                cumple.cCumpleaniosFormateado
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            ) {
                return cumple
            }
            if (
                cumple.cPersNombreApellidos
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            ) {
                return cumple
            }
            if (
                cumple.cRelacionNombre
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
            ) {
                return cumple
            }
            return null
        })
        return null
    }

    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'editar':
                this.editarRecordatorio(item)
                break
            default:
                console.warn('Acción no reconocida:', accion)
        }
    }

    public columnasTabla: IColumn[] = [
        {
            field: 'iCumpleaniosDiff',
            type: 'text',
            width: '15%',
            header: 'Días restantes',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cCumpleaniosFormateado',
            type: 'text',
            width: '25%',
            header: 'Cumpleaños',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cPersNombreApellidos',
            type: 'text',
            width: '40%',
            header: 'Nombre',
            text_header: 'left',
            text: 'left',
        },
        {
            field: 'cRelacionNombre',
            type: 'text',
            width: '20%',
            header: 'Relación',
            text_header: 'center',
            text: 'center',
            class: 'hidden md:table-cell',
        },
        {
            field: 'cRecorPeriodoNombre',
            type: 'text',
            width: '20%',
            header: 'Recordatorio',
            text_header: 'center',
            text: 'center',
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

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-bell',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
}
