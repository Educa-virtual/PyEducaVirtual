import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit } from '@angular/core'
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
    cumpleanios: Array<object> = []
    cumpleanios_filtrados: Array<object> = []
    formSearch: FormGroup
    perfil: any
    iYAcadId: any
    periodos: Array<object>
    recordatorio_activo: boolean = false

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
        this.formSearch = this.fb.group({
            iCredEntPerfId: [this.perfil.iCredEntPerfId],
            cBuscar: [''],
            iPeriodoId: [null],
        })

        this.datosRecordatorio.getPeriodos().subscribe((data: any) => {
            console.log(data, 'periodos')
            this.periodos = data
        })

        this.verCumpleanios()
        this.verConfiguracion()
    }

    verConfiguracion() {
        this.datosRecordatorio
            .verConfRecordatorio(this.formSearch.value)
            .subscribe({
                next: (data: any) => {
                    if (data.data.length === 0) {
                        // Si no hay configuración, establecemos el periodo por defecto
                        this.formSearch.get('iPeriodoId')?.setValue(1)
                    }
                    const iPeriodoId = data.data[0]?.iPeriodoId
                        ? +data.data[0]?.iPeriodoId
                        : 1
                    this.formSearch.get('iPeriodoId')?.setValue(iPeriodoId)
                },
                error: (error) => {
                    console.error('Error al obtener configuracion:', error)
                },
            })
    }

    actualizarConfiguracion() {
        this.datosRecordatorio
            .actualizarConfReordatorio(this.formSearch.value)
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'configuracion guardada')
                },
                error: (error) => {
                    console.error('Error al guardar configuracion:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo actualizar su configuración',
                    })
                },
            })
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
                        detail: error,
                    })
                },
            })
    }

    /* Filtrar tabla según búsqueda */
    filtrarTabla() {
        if (!this.cumpleanios) {
            return []
        }
        const cBuscar = this.formSearch.get('cBuscar')?.value
        this.cumpleanios_filtrados = this.cumpleanios.filter((cumple: any) => {
            if (
                cumple.iCumpleaniosDiff
                    .toLowerCase()
                    .includes(cBuscar.toLowerCase())
            ) {
                return cumple
            }
            if (
                cumple.cCumpleaniosFormateado
                    .toLowerCase()
                    .includes(cBuscar.toLowerCase())
            ) {
                return cumple
            }
            if (
                cumple.cPersNombreApellidos
                    .toLowerCase()
                    .includes(cBuscar.toLowerCase())
            ) {
                return cumple
            }
            if (
                cumple.cRelacionNombre
                    .toLowerCase()
                    .includes(cBuscar.toLowerCase())
            ) {
                return cumple
            }
            return null
        })
        return null
    }

    accionBnt(event: { accion: string }): void {
        switch (event.accion) {
            case 'editar':
                console.log('Editar seleccionado')
                break
            case 'eliminar':
                console.log('Eliminar seleccionado')
                break
            case 'estado':
                console.log('Cambiar estado seleccionado')
                break
            default:
                console.warn('Acción no reconocida:', event.accion)
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
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-print',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
        {
            labelTooltip: 'Cambiar estado',
            icon: 'pi pi-file-edit',
            accion: 'estado',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-undo',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
}
