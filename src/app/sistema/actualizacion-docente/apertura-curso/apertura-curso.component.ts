import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { MessageService } from 'primeng/api'
import { FormBuilder, Validators } from '@angular/forms'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-apertura-curso',
    standalone: true,
    templateUrl: './apertura-curso.component.html',
    styleUrls: ['./apertura-curso.component.scss'],
    imports: [PrimengModule, ToolbarPrimengComponent, TablePrimengComponent],
    providers: [MessageService],
})
export class AperturaCursoComponent implements OnInit {
    private _formBuilder = inject(FormBuilder)
    private _confirmService = inject(ConfirmationModalService)
    private _aulaService = inject(ApiAulaService)
    private _ConstantesService = inject(ConstantesService)

    iPago: boolean = true
    tipoCapacitacion: any[] = []
    nivelPedagogico: any[] = []
    publicoObjetivo: any[] = []
    cursos: any[] = []
    iCapacitacionId: string = ''

    modoFormulario: 'crear' | 'editar' = 'crear'

    constructor(private messageService: MessageService) {}

    // formGroup para el formulario
    public formNuevaCapacitacion = this._formBuilder.group({
        iTipoCapId: ['', [Validators.required]],
        cCapTitulo: ['', [Validators.required]],
        iNivelPedId: ['', [Validators.required]],
        iTipoPubId: [''],
        cCapDescripcion: [''],
        iTotalHrs: ['', [Validators.required]],
        dFechaInicio: [new Date()],
        dFechaFin: [new Date()],
        iCosto: [0],
        nCosto: [0.0],
        iDocenteId: [''],
        cHorario: [''],
        iCantidad: [0],
        cImagenUrl: [''],
    })

    ngOnInit() {
        // Obtener los select:
        this.obtnerTipoCapacitacion()
        this.obtenerNivelPedagogico()
        this.obtenerTipodePublico()

        // Obtener las capacitaciones:
        this.obtenerCapacitaciones()
    }
    // mostrar los headr de las tablas
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cCapTitulo',
            header: 'Título del curso',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'dFechaFin',
            header: 'Fecha Fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    // mostrar los botones de la tabla
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-succes p-button-text',
            isVisible: (row) => [1, 2, 3].includes(row.iEstado),
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: (row) => row.iEstado === 1,
        },
    ]
    //

    // asignar la accion a los botones de la tabla
    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'editar':
                this.modoFormulario = 'editar'
                this.iCapacitacionId = item.iCapacitacionId
                // console.log('Editar', item)
                this.formNuevaCapacitacion.patchValue(item)
                // this.selectedItems = []
                // this.selectedItems = [item]
                break
            case 'eliminar':
                this.eliminarCapacitacion(item)
                break
        }
    }

    // metodo para guardar el curso creado
    crearCurso() {
        // if(this.formNuevaCapacitacion.invalid) return;
        if (this.modoFormulario === 'editar') {
            const id = this.iCapacitacionId

            const titulo =
                this.formNuevaCapacitacion.get('cCapTitulo')?.value || ''
            // alert antes de editar el curso creado
            this._confirmService.openConfiSave({
                message: 'Recuerde que no podra retroceder',
                header: `¿Esta seguro que desea Editar: ${titulo} ?`,
                accept: () => {
                    const iDocenteId = 1
                    const iCredId = this._ConstantesService.iCredId
                    // Agregar datos al formulario
                    const data = {
                        ...this.formNuevaCapacitacion.value,
                        iCredId: iCredId,
                        iDocenteId: iDocenteId,
                        iCapacitacionId: id,
                    }
                    this._aulaService.actualizarCapacitacion(data).subscribe({
                        next: (resp: any) => {
                            // Mensaje de guardado(opcional)
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Actualizado',
                                detail: 'Acción éxitosa',
                            })
                            // para refrescar la pagina
                            if (resp?.validated) {
                                this.obtenerCapacitaciones()
                                // this.guardarComunicado.get('cForoRptaPadre')?.reset()
                            }
                            this.formNuevaCapacitacion.reset()
                        },
                        error: (error) => {
                            console.error('Comentario:', error)
                        },
                    })
                    this.modoFormulario = 'crear'
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Capacitación no Actualizada',
                    })
                },
            })
        } else {
            // revisar si tiene datos formNuevaCapacitacion para registrar el curso
            const titulo =
                this.formNuevaCapacitacion.get('cCapTitulo')?.value || ''
            // alert en caso si no tiene datos los campos del formulario
            if (titulo == '') {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Tiene que agregar un Título al curso',
                })
            } else {
                // alert antes de guardar el curso creado
                this._confirmService.openConfiSave({
                    message: 'Recuerde que no podra retroceder',
                    header: `¿Esta seguro que desea guardar: ${titulo} ?`,
                    accept: () => {
                        const iDocenteId = 1
                        const iCredId = this._ConstantesService.iCredId
                        // Agregar datos al formulario
                        const data = {
                            ...this.formNuevaCapacitacion.value,
                            iCredId: iCredId,
                            iDocenteId: iDocenteId,
                        }
                        this._aulaService.guardarCapacitacion(data).subscribe({
                            next: (resp: any) => {
                                // Mensaje de guardado(opcional)
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Guardado',
                                    detail: 'Acción éxitosa',
                                })
                                // para refrescar la pagina
                                if (resp?.validated) {
                                    this.obtenerCapacitaciones()
                                    // this.guardarComunicado.get('cForoRptaPadre')?.reset()
                                }
                                this.formNuevaCapacitacion.reset()
                            },
                            error: (error) => {
                                console.error('Comentario:', error)
                            },
                        })
                        // this._aulaService.guardarCapacitacion(data).subscribe((data)=>{
                        // Mensaje de guardado(opcional)
                        // this.messageService.add({
                        //     severity: 'success',
                        //     summary: 'Guardado',
                        //     detail: 'Acción éxitosa',
                        // })
                        // console.log(
                        //     'datos de curso',
                        //     this.formNuevaCapacitacion.value
                        // )
                        // this.formNuevaCapacitacion.reset()
                        // })
                    },
                    reject: () => {
                        // Mensaje de cancelación (opcional)
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Capacitación no Guardado',
                        })
                    },
                })
            }
        }
    }

    // eliminar capacitación
    eliminarCapacitacion(item) {
        const titulo = item.cCapTitulo
        const data = {
            iCapacitacionId: item.iCapacitacionId,
            iCredId: this._ConstantesService.iCredId,
        }
        // alert antes de guardar el curso creado
        this._confirmService.openConfiSave({
            message: 'Recuerde que no podra retroceder',
            header: `¿Esta seguro que desea Eliminar: ${titulo} ?`,
            accept: () => {
                console.log('Eliminado', data)
                this._aulaService.eliminarCapacitacion(data).subscribe({
                    next: (resp: any) => {
                        // Mensaje de guardado(opcional)
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Eliminado',
                            detail: 'Acción éxitosa',
                        })
                        // para refrescar la pagina
                        if (resp?.validated) {
                            this.obtenerCapacitaciones()
                        }
                    },
                    error: (error) => {
                        console.error('Comentario:', error)
                    },
                })
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Capacitación no Eliminado',
                })
            },
        })
    }

    // metodo para obtener tipo capacitación:
    obtnerTipoCapacitacion() {
        const userId = 1
        this._aulaService.obtenerTipoCapacitacion(userId).subscribe((Data) => {
            this.tipoCapacitacion = Data['data']
            // console.log('Datos tipo capacitacion', this.tipoCapacitacion)
        })
    }

    // Obtener el nivel pedagógico:
    obtenerNivelPedagogico() {
        const userId = 1
        this._aulaService.obtenerNivelPedagogico(userId).subscribe((Data) => {
            this.nivelPedagogico = Data['data']
            // console.log('Datos tipo capacitacion', this.nivelPedagogico)
        })
    }

    // metodo para obtener el tipo de publico
    obtenerTipodePublico() {
        const userId = 1
        this._aulaService.obtenerTipoPublico(userId).subscribe((Data) => {
            this.publicoObjetivo = Data['data']
            // console.log('Datos tipo capacitacion', this.publicoObjetivo)
        })
    }

    // obtener las capacitaciones
    obtenerCapacitaciones() {
        const iEstado = 1
        const iCredId = this._ConstantesService.iCredId
        const data = {
            iEstado: iEstado,
            iCredId: iCredId,
        }
        this._aulaService.obtenerCapacitacion(data).subscribe((Data) => {
            this.cursos = Data['data']
            // console.log('Datos capacitacion', this.cursos)
        })
    }

    // metodo para limpiar el formulario
    limpiarFormulario() {
        this.formNuevaCapacitacion.reset()
        this.modoFormulario = 'crear'
        this.iCapacitacionId = ''
    }
}
