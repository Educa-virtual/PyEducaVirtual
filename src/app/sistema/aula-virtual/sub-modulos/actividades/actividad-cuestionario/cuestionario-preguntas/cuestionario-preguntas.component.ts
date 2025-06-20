import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, Input, OnInit } from '@angular/core'
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular'
import { MenuItem, MessageService } from 'primeng/api'
import { environment } from '@/environments/environment'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { NoDataComponent } from '@/app/shared/no-data/no-data.component'
import { CuestionarioFormPreguntasComponent } from '../cuestionario-form-preguntas/cuestionario-form-preguntas.component'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { AulaVirtualService } from '@/app/servicios/aula/aula-virtual.service'
// import { group } from '@angular/animations'
// import { aC } from '@fullcalendar/core/internal-common'

@Component({
    selector: 'app-cuestionario-preguntas',
    standalone: true,
    templateUrl: './cuestionario-preguntas.component.html',
    styleUrls: ['./cuestionario-preguntas.component.scss'],
    imports: [
        PrimengModule,
        NoDataComponent,
        CuestionarioFormPreguntasComponent,
    ],
    providers: [
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    ],
})
export class CuestionarioPreguntasComponent implements OnInit {
    @Input() datosGenerales: any

    // private _ConstantesService = inject(ConstantesService)
    private _constantesService = inject(ConstantesService)
    private GeneralService = inject(GeneralService)
    private _confirmService = inject(ConfirmationModalService)

    private _confirmServiceAula = inject(AulaVirtualService)

    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE

    backend = environment.backend
    totalPregunta: number = 0
    preguntas: any[] = []
    showModal: boolean = false
    titulo: string = ''
    opcion: string = ''
    codigoTipoPregunta: string = ''
    selectedOption!: number
    selectedDropdown!: number

    datosPreguntas: any
    datos: any
    params: any // variable para enviar datos para actualizar
    iEstado: number
    iPerfilId: number

    tiposAgregarPregunta: MenuItem[] = [
        {
            label: 'Nueva pregunta',
            icon: 'pi pi-plus',
            command: () => {
                this.showModal = true
                this.titulo = 'Nueva pregunta'
                this.opcion = 'GUARDAR'
            },
        },
        // {
        //     label: 'Importar preguntas',
        //     icon: 'pi pi-plus',
        //     command: () => {
        //         //
        //     },
        // },
    ]
    constructor(
        // private dialogConfig: DynamicDialogConfig,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.obtenerCuestionario()
        this.datos = this.datosGenerales
        this.obtenerTipoPreguntas()
        this.iEstado = this.datosGenerales.iEstado
        this.iPerfilId = this._constantesService.iPerfilId
    }

    tipoPreguntas: any[] = [
        {
            iTipoPregId: '1',
            cTipoPregunta: 'Texto',
            cIcon: 'pi-align-left',
            cCodeTipoPreg: 'TIP-PREG-TEXTO',
        },
        {
            iTipoPregId: '2',
            cTipoPregunta: 'Varias opciones',
            cIcon: 'pi-stop-circle',
            cCodeTipoPreg: 'TIP-PREG-OPCIONES',
        },
        {
            iTipoPregId: '4',
            cTipoPregunta: 'Casillas',
            cIcon: 'pi-stop-circle',
            cCodeTipoPreg: 'TIP-PREG-CASILLA',
        },
        {
            iTipoPregId: '5',
            cTipoPregunta: 'Desplegable',
            cIcon: 'pi-chevron-circle-down',
            cCodeTipoPreg: 'TIP-PREG-DESPLEGABLE',
        },
        {
            iTipoPregId: '7',
            cTipoPregunta: 'Escala lineal',
            cIcon: 'pi-ellipsis-h',
            cCodeTipoPreg: 'TIP-PREG-ESC-LINEAL',
        },
        {
            iTipoPregId: '8',
            cTipoPregunta: 'Calificación',
            cIcon: 'pi-star',
            cCodeTipoPreg: 'TIP-PREG-CALIF',
        },
        {
            iTipoPregId: '9',
            cTipoPregunta: 'Cuadrícula de varias opciones',
            cIcon: 'pi-th-large',
            cCodeTipoPreg: 'TIP-PREG-CUAD-OPCIONES',
        },
        {
            iTipoPregId: '10',
            cTipoPregunta: 'Cuadrícula de casillas',
            cIcon: 'pi-table',
            cCodeTipoPreg: 'TIP-PREG-CUAD-CASILLA',
        },
    ]
    // data: any
    data: any = [
        {
            id: 1,
            nombre: 'Pregunta 1',
            tipoCuestionario: 'TIP-PREG-TEXTO',
            estado: 'Activo',
        },
        {
            id: 2,
            nombre: 'Pregunta 2 Opciones',
            tipoCuestionario: 'TIP-PREG-OPCIONES',
            opciones: [
                { id: 1, label: 'Si son opciones' },
                { id: 2, label: 'No son opciones' },
                { id: 3, label: 'Quizás son opciones' },
            ],
            estado: 'Activo',
        },
        {
            id: 3,
            nombre: 'Pregunta 3',
            tipoCuestionario: 'TIP-PREG-CASILLA',
            estado: 'Activo',
        },
        {
            id: 4,
            nombre: 'Pregunta 4',
            tipoCuestionario: 'TIP-PREG-DESPLEGABLE',
            opciones: [
                { id: 1, label: 'Si son opciones' },
                { id: 2, label: 'No son opciones' },
                { id: 3, label: 'Quizás son opciones' },
            ],
            estado: 'Activo',
        },
    ]
    loading: boolean = false

    load() {
        this.loading = true

        setTimeout(() => {
            this.loading = false
        }, 2000)
    }

    respuesta: string = ''

    guadarRespuesta(item: any): void {
        const iPregAlterId = item.jsonAlternativas[0].iPregAlterId
        const iCuestionarioId = this.datosGenerales.iCuestionarioId
        const iEstudianteId = this.iPerfilId
        const data = {
            iPregAlterId: iPregAlterId,
            cRespuest: this.respuesta,
            iCredId: this._constantesService.iCredId,
        }
        console.log(data)
        // Servicio para obtener los instructores
        this._confirmServiceAula
            .guardarRespuestaEstudiante(iCuestionarioId, iEstudianteId, data)
            .subscribe({
                next: (response) => {
                    if (response.validated) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Acción exitosa',
                            detail: response.message,
                        })
                        this.showModal = false
                        this.obtenerCuestionario()
                        // this.instructorForm.reset()
                    }
                },
                error: (error) => {
                    const errores = error?.error?.errors
                    if (error.status === 422 && errores) {
                        // Recorre y muestra cada mensaje de error
                        Object.keys(errores).forEach((campo) => {
                            errores[campo].forEach((mensaje: string) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error de validación',
                                    detail: mensaje,
                                })
                            })
                        })
                    } else {
                        // Error genérico si no hay errores específicos
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                error?.error?.message ||
                                'Ocurrió un error inesperado',
                        })
                    }
                },
            })
        // Aquí puedes enviar la variable o hacer lo que necesites
    }
    guardarRespuestaOpcion(pregunta: any, idAlternativa: string) {
        const cRespuest = pregunta.jsonAlternativas.map(
            (item) => item.iPregAlterId
        )
        console.log(' preguntas', this.data)
        // console.log('Respuesta seleccionada:', {
        //     idPregunta: pregunta.iPregId,
        //     idAlternativa
        // });
        // const iCuestionarioId = this.datosGenerales.iCuestionarioId
        // const iEstudianteId = this.iPerfilId
        const data = {
            iPregAlterId: idAlternativa,
            cRespuest: cRespuest,
            iCredId: this._constantesService.iCredId,
        }
        console.log(data)
        // Servicio para obtener los instructores
        // this._confirmServiceAula
        //     .guardarRespuestaEstudiante(iCuestionarioId, iEstudianteId, data)
        //     .subscribe({
        //         next: (response) => {
        //             if (response.validated) {
        //                 this.messageService.add({
        //                     severity: 'success',
        //                     summary: 'Acción exitosa',
        //                     detail: response.message,
        //                 })
        //                 this.showModal = false
        //                 this.obtenerCuestionario()
        //                 // this.instructorForm.reset()
        //             }
        //         },
        //         error: (error) => {
        //             const errores = error?.error?.errors
        //             if (error.status === 422 && errores) {
        //                 // Recorre y muestra cada mensaje de error
        //                 Object.keys(errores).forEach((campo) => {
        //                     errores[campo].forEach((mensaje: string) => {
        //                         this.messageService.add({
        //                             severity: 'error',
        //                             summary: 'Error de validación',
        //                             detail: mensaje,
        //                         })
        //                     })
        //                 })
        //             } else {
        //                 // Error genérico si no hay errores específicos
        //                 this.messageService.add({
        //                     severity: 'error',
        //                     summary: 'Error',
        //                     detail:
        //                         error?.error?.message ||
        //                         'Ocurrió un error inesperado',
        //                 })
        //             }
        //         },
        //     })
    }
    guardarPregunta(data: any) {
        const datos = {
            iCuestionarioId: this.datosGenerales.iCuestionarioId,
            iTipoPregId: data.iTipoPregId,
            cPregunta: data.cPregunta,
            jsonAlternativas: data.jsonAlternativas,
            iCredId: this._constantesService.iCredId,
        }
        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'preguntas',
            data: datos,
            params: {
                iCredId: this._constantesService.iCredId,
            },
        }
        // // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Acción exitosa',
                        detail: response.message,
                    })
                    this.showModal = false
                    this.obtenerCuestionario()
                    // this.instructorForm.reset()
                }
            },
            error: (error) => {
                const errores = error?.error?.errors
                if (error.status === 422 && errores) {
                    // Recorre y muestra cada mensaje de error
                    Object.keys(errores).forEach((campo) => {
                        errores[campo].forEach((mensaje: string) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error de validación',
                                detail: mensaje,
                            })
                        })
                    })
                } else {
                    // Error genérico si no hay errores específicos
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error?.error?.message ||
                            'Ocurrió un error inesperado',
                    })
                }
            },
        })
    }
    actualizarPregunta(data: any) {
        const datos = {
            iCuestionarioId: this.datosGenerales.iCuestionarioId,
            iTipoPregId: data.iTipoPregId,
            cPregunta: data.cPregunta,
            jsonAlternativas: data.jsonAlternativas,
            iCredId: this._constantesService.iCredId,
        }
        const params = {
            petition: 'put',
            group: 'aula-virtual',
            prefix: 'preguntas',
            ruta: data.iPregId,
            data: datos,
            params: {
                iCredId: this._constantesService.iCredId,
            },
        }
        // // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe({
            next: (response) => {
                if (response.validated) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Acción exitosa',
                        detail: response.message,
                    })
                    this.showModal = false
                    this.obtenerCuestionario()
                    // this.instructorForm.reset()
                }
            },
            error: (error) => {
                const errores = error?.error?.errors
                if (error.status === 422 && errores) {
                    // Recorre y muestra cada mensaje de error
                    Object.keys(errores).forEach((campo) => {
                        errores[campo].forEach((mensaje: string) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error de validación',
                                detail: mensaje,
                            })
                        })
                    })
                } else {
                    // Error genérico si no hay errores específicos
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error?.error?.message ||
                            'Ocurrió un error inesperado',
                    })
                }
            },
        })
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.showModal = false
                break
            case 'ACTUALIZAR':
                this.titulo = 'Editar pregunta'
                this.opcion = accion
                this.params = item
                this.showModal = true
                break
        }
    }
    formpreguntas: any
    obtenerCuestionario() {
        const params = {
            petition: 'get',
            group: 'aula-virtual',
            prefix: 'preguntas',
            ruta: `cuestionario/${this.datosGenerales.iCuestionarioId}`,
            params: {
                iCredId: this._constantesService.iCredId,
            },
        }

        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe((Data) => {
            this.data = (Data as any)['data']
            this.data = this.data.map((Data) => {
                return {
                    ...Data,
                    jsonAlternativas: JSON.parse(Data.jsonAlternativas),
                }
            })
            // console.log('Datos preguntas:', this.data)
        })
    }

    eliminarPregunta(data: any) {
        this._confirmService.openConfirm({
            header: '¿Eliminar pregunta:  ' + data.cPregunta + '?',
            accept: () => {
                const params = {
                    petition: 'delete',
                    group: 'aula-virtual',
                    prefix: 'preguntas',
                    ruta: data.iPregId,
                    params: {
                        iCredId: this._constantesService.iCredId,
                    },
                }
                // Servicio para obtener los instructores
                this.GeneralService.getGralPrefixx(params).subscribe({
                    next: (resp) => {
                        if (resp.validated) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Acción exitosa',
                                detail: resp.message,
                            })
                            this.obtenerCuestionario()
                        }
                    },
                })
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
    }
    tipopregunta: any
    obtenerTipoPreguntas() {
        const params = {
            petition: 'get',
            group: 'enc',
            prefix: 'tipo-preguntas',
            params: {
                iCredId: this._constantesService.iCredId,
            },
        }
        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe((Data) => {
            this.tipoPreguntas = (Data as any)['data']
        })
    }
}
