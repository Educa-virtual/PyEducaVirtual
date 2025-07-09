import { PrimengModule } from '@/app/primeng.module'
import { InputNumberModule } from 'primeng/inputnumber'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { MessageService } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-block-horario',
    standalone: true,
    imports: [PrimengModule, InputNumberModule, TablePrimengComponent],
    templateUrl: './block-horario.component.html',
    styleUrl: './block-horario.component.scss',
})
export class BlockHorarioComponent implements OnChanges {
    @Output() act_iConfBloqueId = new EventEmitter()

    @Input() iConfBloqueId
    @Input() iNumBloque: number = 0 // Número de bloques, se puede ajustar según sea necesario
    @Input() iIntervalo: number = 45 // Intervalo en minutos, se puede ajustar según sea necesario
    @Input() iEstado: number = 1 // Estado del bloque, se puede ajustar según sea necesario

    formGenerador: FormGroup

    bloques: any = []
    bloque_asignado: number = 0 // Variable para almacenar el bloque asignado

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {}

    private inicializacionPendiente = false

    ngOnChanges(changes: SimpleChanges): void {
        if (
            (changes['iConfBloqueId'] &&
                changes['iConfBloqueId'].currentValue) ||
            (changes['iNumBloque'] && changes['iNumBloque'].currentValue) ||
            (changes['iIntervalo'] && changes['iIntervalo'].currentValue) ||
            (changes['iEstado'] && changes['iEstado'].currentValue)
        ) {
            if (!this.inicializacionPendiente) {
                this.inicializacionPendiente = true
                setTimeout(() => {
                    this.inicializarFormulario()
                    this.inicializacionPendiente = false
                })
            }
        }
    }

    inicializarFormulario() {
        this.formGenerador = this.fb.group({
            iDetBloqueId: [0], // ID del bloque, se puede ajustar según sea necesario
            iConfBloqueId: [0], // ID de la configuración del bloque, se puede ajustar según sea necesario
            tBloqueInicio: [null, Validators.required],
            tBloqueFin: [{ value: null, disabled: true }, Validators.required],
            iEstado: [1, Validators.required], // Estado del bloque, se puede ajustar según sea necesario
        })

        this.getDetailsBloque() // Cargar los bloques al iniciar el componente
    }

    getDetailsBloque() {
        const params = 'iConfBloqueId=' + Number(this.iConfBloqueId)
        this.query
            .searchCalAcademico({
                esquema: 'hor',
                tabla: 'detalle_bloques',
                campos: '*',
                condicion: params,
            })
            .subscribe({
                next: (data: any) => {
                    this.bloques = data.data
                    this.bloque_asignado = this.bloques.length // Verifica la longitud de los bloques obtenidos
                    //Inhabilita si ya los bloques estan completos
                    if (
                        Number(this.bloque_asignado) >= Number(this.iNumBloque)
                    ) {
                        this.formGenerador.get('iEstado')?.setValue(null) // Deshabilitar el estado si se alcanzó el número máximo de bloques
                    } else {
                        this.formGenerador.get('iEstado')?.setValue(1) // Habilitar el estado si no se alcanzó el número máximo de bloques
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Mensaje del Sistema',
                        detail:
                            'Error al cargar los datos del horario: ' +
                            error.message,
                    })
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje del Sistema',
                        detail: 'Se cargar los registros del horario correctamente',
                    })
                },
            })
    }

    agregarBloque() {
        this.sumarIntervalo()

        if (!this.validarFechas()) {
            return // Detiene el flujo si es duplicado
        }
        const params = JSON.stringify({
            iConfBloqueId: this.iConfBloqueId, // ID de la configuración del bloque, se puede ajustar según sea necesario
            tBloqueInicio: this.toHHMMSS(
                this.formGenerador.get('tBloqueInicio')?.value
            ),
            tBloqueFin: this.toHHMMSS(
                this.formGenerador.get('tBloqueFin')?.value
            ),
        })

        this.query
            .addCalAcademico({
                json: params, //this.formHorario.getRawValue(),
                _opcion: 'addConfigDetalleBloque',
            })
            .subscribe({
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Mensaje del sistema',
                        detail:
                            'Error. No se proceso petición de registro: ' +
                            error.message,
                    })
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje del sistema',
                        detail: 'Proceso exitoso',
                    })
                    this.getDetailsBloque()
                },
            })
    }

    eliminarBloque(id: number) {
        const params = {
            esquema: 'hor',
            tabla: 'detalle_bloques',
            campo: 'iDetBloqueId',
            valorId: id,
        }
        this.query.deleteAcademico(params).subscribe({
            error: (error) => {
                // console.error('Error fetching ambiente:', error)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Mensaje de error',
                    detail: 'NO se pudo eliminar registro' + error,
                })
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Registro eliminado correctamente',
                })
                this.getDetailsBloque()
            },
        })
    }

    cerrarBloque() {
        const items = { iConfBloqueId: this.iConfBloqueId }
        const params = { accion: 'finalizar', item: items }

        this.act_iConfBloqueId.emit(params)
    }

    validarFechas(): boolean {
        console.log(
            this.formGenerador.get('tBloqueInicio')?.value,
            'validarFechas'
        )
        const existe = this.bloques.some((bloque: any) => {
            const horaBloque = this.extraerHora(bloque.tBloqueInicio)
            const inicio = this.extraerHora(
                this.formGenerador.get('tBloqueInicio')?.value
            )
            console.log(horaBloque, ' bloque', inicio, 'horaBloque y inicio')
            return horaBloque === inicio
        })

        if (existe) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia del sistema',
                detail: 'El bloque ya existe.',
            })
            return false // Bloque ya existe
        } else {
            return true // Bloque no existe
        }
    }

    sumarIntervalo() {
        const inicio: Date = this.formGenerador.get('tBloqueInicio')?.value

        if (inicio) {
            const fin = new Date(inicio) // crea una copia de la fecha
            fin.setMinutes(fin.getMinutes() + Number(this.iIntervalo)) // suma 45 minutos

            this.formGenerador.get('tBloqueFin')?.setValue(fin)
        }
    }

    toHHMMSS(value: any): string {
        if (!value) return ''

        if (value instanceof Date) {
            return value.toTimeString().slice(0, 8)
        }

        if (typeof value === 'string') {
            // Si ya está en formato 'HH:mm:ss' o 'HH:mm'
            if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
                return value.length === 5 ? value + ':00' : value
            }

            // Intentar parsear si es otra string de fecha
            const d = new Date(value)
            if (!isNaN(d.getTime())) {
                return d.toTimeString().slice(0, 8)
            }
        }

        return ''
    }

    extraerHora(fecha: any): string {
        if (!fecha) return ''

        let dateObj: Date

        if (fecha instanceof Date) {
            dateObj = fecha
        } else if (typeof fecha === 'string') {
            dateObj = new Date('1970-01-01T' + fecha) // convierte string HH:mm:ss a Date
        } else {
            return ''
        }

        if (isNaN(dateObj.getTime())) {
            return ''
        }

        const horas = dateObj.getHours().toString().padStart(2, '0')
        const minutos = dateObj.getMinutes().toString().padStart(2, '0')

        return `${horas}:${minutos}`
    }

    //   toHHMMSS(value: any): string {
    //     if (!value) return '';

    //     if (value instanceof Date) {
    //       return value.toTimeString().slice(0, 8);
    //     }

    //     if (typeof value === 'string') {
    //       // Si ya está en formato 'HH:mm:ss' o 'HH:mm'
    //       if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    //         return value.length === 5 ? value + ':00' : value;
    //       }

    //       // Intentar parsear si es otra string de fecha
    //       const d = new Date(value);
    //       if (!isNaN(d.getTime())) {
    //         return d.toTimeString().slice(0, 8);
    //       }
    //     }

    //     return '';
    //   }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        if (accion === 'eliminar') {
            this._confirmService.openConfiSave({
                message: '¿Estás seguro de que deseas eliminar?',
                header: 'Advertencia de autoguardado',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Acción para eliminar el registro
                    this.eliminarBloque(item.iDetBloqueId)
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Acción cancelada',
                    })
                },
            })

            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    columnsBloque = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'time',
            width: '5rem',
            field: 'tBloqueInicio',
            header: 'Inicio de Bloque',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'time',
            width: '5rem',
            field: 'tBloqueFin',
            header: 'Fin de Bloque',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '5rem',
            field: 'iEstado',
            header: 'Activo',
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

    actions: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: (rowData) => {
                if (Number(this.iEstado) === 0 || rowData.iEstado === 1) {
                    return true // Mostrar el botón si el estado es 1
                }
                return false // Ocultar el botón en otros casos
            },
            //isVisible: () => !this.iEstado or
        },
    ]
}
