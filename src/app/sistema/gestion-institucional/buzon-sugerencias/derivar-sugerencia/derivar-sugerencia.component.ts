import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { Component, inject, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CompartirSugerenciaService } from '../services/compartir-sugerencia.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-derivar-sugerencia',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './derivar-sugerencia.component.html',
    styleUrl: './derivar-sugerencia.component.scss',
})
export class DerivarSugerenciaComponent implements OnInit {
    @Input() item: any
    @Input() disable: boolean

    form: FormGroup
    disable_form: boolean = false
    derivacion_registrada: boolean = false
    uploadedFiles: any[] = []
    derivaciones: Array<object> = []
    destinos_seleccionados: any[] = []

    destinos: Array<object>

    private _MessageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private compartirSugerenciaService: CompartirSugerenciaService
    ) {}

    ngOnInit(): void {
        this.destinos = [
            { value: 1, label: 'EQUIPO TECNICO' },
            { value: 2, label: 'DIRECCION' },
            { value: 3, label: 'PROFESORES' },
            { value: 4, label: 'ESPECIALISTAS' },
        ]

        this.form = this.fb.group({
            iSugerenciaId: this.compartirSugerenciaService.getiSugerenciaId(),
            iDestinoId: [null, Validators.required],
            cProveido: [null, Validators.required],
        })
    }

    marcarDestinos(event: any) {
        if (event.originalEvent.selected === true) {
            this.destinos_seleccionados.push(event.itemValue)
        } else {
            this.destinos_seleccionados.splice(
                this.destinos_seleccionados.indexOf(event.itemValue),
                1
            )
        }
    }

    addDerivacion() {
        for (const destino of this.destinos_seleccionados) {
            if (
                this.derivaciones.find(
                    (derivacion: any) => derivacion.iDestinoId === destino.value
                )
            ) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        'El destino seleccionado ' +
                        destino.label +
                        ' ya fue agregado',
                })
                return
            }
        }
        this.destinos_seleccionados.forEach((destino: any) => {
            this.derivaciones.push({
                iSugerenciaId: this.form.value.iSugerenciaId,
                iDestinoId: destino.value,
                cDestinoNombre: destino.label,
                cProveido: this.form.value.cProveido,
            })
        })
        // Crear nueva referencia para actualizar tabla
        this.derivaciones = [...this.derivaciones]
        this.destinos_seleccionados = []
        this.form.reset()
    }

    guardarDerivacion() {
        this.form.reset()
        this.derivaciones = []
        this.form.get('iSugerenciaId')?.setValue(null)
    }

    actualizarDerivacion() {
        console.log('Actualizando derivación...')
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'quitar') {
            this.derivaciones.splice(this.derivaciones.indexOf(item), 1)
            this.derivaciones = [...this.derivaciones]
        }
    }

    actions: IActionTable[] = [
        {
            labelTooltip: 'Quitar',
            icon: 'pi pi-fw pi-trash',
            accion: 'quitar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'Item',
            text_header: 'left',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cDestinoNombre',
            header: 'Destino',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cProveido',
            header: 'Proveído',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'right',
        },
    ]
}
