import { PrimengModule } from '@/app/primeng.module'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    Component,
    ElementRef,
    inject,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DatosFichaBienestarService } from '../../../services/datos-ficha-bienestar.service'
import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { DropdownSimpleComponent } from '../../shared/dropdown-simple/dropdown-simple.component'
import { InputSimpleComponent } from '../../shared/input-simple/input-simple.component'
import { FuncionesBienestarService } from '../../../services/funciones-bienestar.service'

@Component({
    selector: 'app-gestion-pandemia-dosis',
    standalone: true,
    imports: [
        PrimengModule,
        TablePrimengComponent,
        DropdownSimpleComponent,
        InputSimpleComponent,
    ],
    templateUrl: './gestion-pandemia-dosis.component.html',
    styleUrl: './gestion-pandemia-dosis.component.scss',
})
export class GestionPandemiaDosisComponent implements OnInit {
    @Input() iFichaDGId: any
    @ViewChild('filtro') filtro: ElementRef
    formDosis: FormGroup
    pandemias: Array<object>
    dosis: any[]
    dosis_filtradas: any[]
    dosis_registrada: boolean = false
    visible: boolean = false
    caption: string = ''
    fecha_actual: Date = new Date()

    private _messageService = inject(MessageService)
    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private fb: FormBuilder,
        private datosFichaBienestar: DatosFichaBienestarService,
        private funcionesBienestar: FuncionesBienestarService
    ) {}

    ngOnInit(): void {
        try {
            this.formDosis = this.fb.group({
                iFichaDGId: [this.iFichaDGId, Validators.required],
                iPanDFichaId: [null],
                iPandemiaId: [null, Validators.required],
                iPanDFichaNroDosis: [null, Validators.required],
                dtPanDFichaDosis: [null, Validators.required],
            })
        } catch (error) {
            console.log(error, 'error de formulario')
        }

        this.datosFichaBienestar.getFichaParametros().subscribe((data: any) => {
            this.pandemias = this.datosFichaBienestar.getPandemias(
                data?.pandemias
            )
        })

        if (this.iFichaDGId) {
            this.listarDosis()
        }
    }

    filtrarTabla() {
        const filtro = this.filtro.nativeElement.value.toLowerCase()
        this.dosis_filtradas = this.dosis.filter((dosis: any) => {
            if (dosis.iPanDFichaNroDosis.toLowerCase().includes(filtro))
                return dosis
            if (dosis.dtPanDFichaDosis.toLowerCase().includes(filtro))
                return dosis
            if (dosis.cPandemiaNombre.toLowerCase().includes(filtro))
                return dosis
            return null
        })
    }

    listarDosis() {
        this.datosFichaBienestar
            .listarDosis({
                iFichaDGId: this.iFichaDGId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.dosis = data.data
                        this.dosis_filtradas = this.dosis
                    }
                },
            })
    }

    verDosis(iPanDFichaId: any) {
        this.datosFichaBienestar
            .verDosis({
                iPanDFichaId: iPanDFichaId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.setFormDosis(data.data[0])
                    }
                },
                error: (error) => {
                    console.error('Error al obtener dosis:', error)
                },
            })
    }

    //Maquetar tablas
    handleActions(actions) {
        console.log(actions)
    }

    clearForm() {
        this.formDosis.reset()
    }

    setFormDosis(data: any) {
        this.formDosis.reset()
        if (data) {
            this.formDosis.patchValue(data)
            this.funcionesBienestar.formatearFormControl(
                this.formDosis,
                'iPandemiaId',
                data.iPandemiaId,
                'number'
            )
            this.funcionesBienestar.formatearFormControl(
                this.formDosis,
                'iPanDFichaNroDosis',
                data.iPanDFichaNroDosis,
                'number'
            )
            this.funcionesBienestar.formatearFormControl(
                this.formDosis,
                'dtPanDFichaDosis',
                data.dtPanDFichaDosis,
                'date'
            )
            this.dosis_registrada = true
        }
    }

    agregarDosis() {
        this.setFormDosis({
            iFichaDGId: this.iFichaDGId,
            iPandemiaId: null,
            iPanDFichaId: null,
            iPanDFichaNroDosis: null,
            dtPanDFichaDosis: new Date(),
        })
        this.dosis_registrada = false
        this.visible = true
    }

    borrarDosis(iPanDFichaId: any) {
        this.datosFichaBienestar
            .borrarDosis({
                iPanDFichaId: iPanDFichaId,
            })
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Eliminación exitosa',
                        detail: 'Se eliminaron los datos',
                    })
                    this.dosis = this.dosis.filter(
                        (dosis: any) => dosis.iPanDFichaId !== iPanDFichaId
                    )
                    this.dosis_filtradas = this.dosis
                },
                error: (error) => {
                    console.error('Error eliminando dosis:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    guardarDosis() {
        if (this.formDosis.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestar.guardarDosis(this.formDosis.value).subscribe({
            next: () => {
                this._messageService.add({
                    severity: 'success',
                    summary: 'Registro exitoso',
                    detail: 'Se registraron los datos',
                })
                this.visible = false
                this.listarDosis()
            },
            error: (error) => {
                console.error('Error guardando dosis:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                })
            },
        })
    }

    actualizarDosis() {
        if (this.formDosis.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe completar los campos requeridos',
            })
            return
        }
        this.datosFichaBienestar
            .actualizarDosis(this.formDosis.value)
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Se actualizaron los datos',
                    })
                    this.visible = false
                    this.listarDosis()
                },
                error: (error) => {
                    console.error('Error actualizando dosis:', error)
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            this.visible = true
            this.verDosis(item?.iPanDFichaId)
        }
        if (accion === 'anular') {
            this._confirmService.openConfirm({
                message: '¿Está seguro de anular la dosis seleccionada?',
                header: 'Anular dosis',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.borrarDosis(item?.iPanDFichaId)
                },
            })
        }
    }

    accionBtnItem(accion) {
        switch (accion) {
            case 'agregar':
                this.visible = true
        }
    }

    selectedItems = []

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
        {
            labelTooltip: 'Borrar',
            icon: 'pi pi-trash',
            accion: 'anular',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
    ]

    actionsLista: IActionTable[]

    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cPandemiaNombre',
            header: 'Pandemia',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iPanDFichaNroDosis',
            header: 'Nro. de Dosis',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'date',
            width: '5rem',
            field: 'dtPanDFichaDosis',
            header: 'Fecha',
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
}
