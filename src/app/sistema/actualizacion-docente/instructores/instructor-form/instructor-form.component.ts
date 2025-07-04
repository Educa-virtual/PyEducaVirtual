import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { GestionUsuariosService } from '@/app/sistema/administrador/gestion-usuarios/services/gestion-usuarios.service'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-instructor-form',
    standalone: true,
    imports: [PrimengModule, ModalPrimengComponent],
    templateUrl: './instructor-form.component.html',
    styleUrl: './instructor-form.component.scss',
})
export class InstructorFormComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() instructor: any = {}
    @Input() tiposIdentificaciones: any[] = []
    @Input() showModal: boolean = false
    @Input() action: string

    private _constantesService = inject(ConstantesService)
    private GeneralService = inject(GeneralService)
    private _GestionUsuariosService = inject(GestionUsuariosService)

    dropdownStyle: boolean = false
    loading: boolean = false
    persona: any // variable para guardar al buscar dni
    accion: string

    constructor(private messageService: MessageService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['instructor']) {
            this.instructorForm.patchValue(changes['instructor'].currentValue)
        }
        if (changes['tiposIdentificaciones']) {
            const tiposIdentificaciones =
                changes['tiposIdentificaciones'].currentValue
            if (tiposIdentificaciones && tiposIdentificaciones.length > 0) {
                console.log(tiposIdentificaciones)
                this.instructorForm.controls['iTipoIdentId'].setValue(
                    tiposIdentificaciones[0].iTipoIdentId
                )
            }
        }
        if (changes['showModal']) {
            this.instructorForm.patchValue(changes['showModal'].currentValue)
        }
        if (this.action === 'editar') {
            this.accion = 'Editar Instructor'
        } else {
            this.accion = 'Nuevo Instructor'
            this.instructorForm.reset()
        }
    }

    instructorForm: FormGroup = new FormGroup({
        iTipoIdentId: new FormControl(null, Validators.required),
        iInstructorId: new FormControl(null),
        cPersDocumento: new FormControl(null),
        cPersNombre: new FormControl(null, Validators.required),
        cPersPaterno: new FormControl(null, Validators.required),
        cPersMaterno: new FormControl(null, Validators.required),
        cPersDireccion: new FormControl(null, Validators.required),
        cPersCorreo: new FormControl(null, Validators.required),
        cPersCelular: new FormControl(null, Validators.required),
    })

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }
    // metodo para buscar x dni
    buscarDni() {
        const idtipoDocumento = Number(
            this.instructorForm.get('iTipoIdentId')?.value
        )
        const dni = this.instructorForm.get('cPersDocumento')?.value

        if (!idtipoDocumento) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Seleccione un tipo de documento',
            })
        } else {
            // cargar los datos
            this.loading = true

            setTimeout(() => {
                this.loading = false
            }, 2000)
            console.log('guardar')

            // Validar el tipo de documento
            switch (idtipoDocumento) {
                case 1: // DNI
                    this.instructorForm
                        .get('dni')
                        ?.setValidators([
                            Validators.required,
                            Validators.pattern(/^\d{8}$/),
                        ])
                    if (!dni || dni.toString().length !== 8) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Ingrese un DNI válido de 8 dígitos numéricos',
                        })
                        return
                    } else {
                        this._GestionUsuariosService
                            .buscarPersonaPorDocumento(idtipoDocumento, dni)
                            .subscribe({
                                next: (data: any) => {
                                    console.log(data.data)
                                    this.persona = data.data
                                    this.instructorForm.patchValue({
                                        cPersNombre: this.persona.cPersNombre,
                                        cPersPaterno: this.persona.cPersMaterno,
                                        cPersMaterno: this.persona.cPersPaterno,
                                        cPersDireccion:
                                            this.persona.cPersDomicilio,
                                    })
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Datos encontrados',
                                        detail: 'Se obtuvo la información de la persona',
                                    })
                                },
                                error: (error) => {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Problema al obtener datos',
                                        detail: 'No se pudo obtener la información de la persona. Por favor ingrese los datos manualmente.',
                                    })
                                    console.error(
                                        'Error obteniendo datos:',
                                        error
                                    )
                                },
                            })
                        // const data = {
                        //     iTipoIdentId: idtipoDocumento,
                        //     iPersId: '',
                        //     cPersDocumento: dni,
                        // }
                        // const params = {
                        //     petition: 'get',
                        //     group: 'cap',
                        //     prefix: 'instructores',
                        //     ruta: idtipoDocumento + '/' + dni,
                        //     data: data,
                        //     params: {
                        //         iCredId: this._constantesService.iCredId,
                        //     },
                        // }
                        // this.GeneralService.getGralPrefixx(params).subscribe(
                        //     (Data) => {
                        //         this.persona = (Data as any)['data']
                        //         console.log('Datos persona', this.persona)

                        //         this.instructorForm.patchValue({
                        //             cPersNombre: this.persona.cPersNombre,
                        //             cPersPaterno: this.persona.cPersMaterno,
                        //             cPersMaterno: this.persona.cPersPaterno,
                        //             cPersDireccion: this.persona.cPersDomicilio,

                        //         })
                        //     }
                        // )
                    }

                    break
                case 2: // RUC
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ruc no disponible',
                    })
                    break
                default:
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No disponible',
                    })
                    break
            }
        }
    }
    data
    // método para guardar instructor
    guardarInstructor() {
        const data = {
            iPersId: this.persona?.iPersId || null,
            iTipoIdentId: this.instructorForm.get('iTipoIdentId')?.value,
            cPersDocumento: this.instructorForm.get('cPersDocumento')?.value,
            cPersNombre: this.instructorForm.get('cPersNombre')?.value,
            cPersPaterno: this.instructorForm.get('cPersPaterno')?.value,
            cPersMaterno: this.instructorForm.get('cPersMaterno')?.value,
            cPersCelular: this.instructorForm.get('cPersCelular')?.value,
            cPersCorreo: this.instructorForm.get('cPersCorreo')?.value,
            cPersDireccion: this.instructorForm.get('cPersDireccion')?.value,
            iCredId: this._constantesService.iCredId,
        }
        const params = {
            petition: 'post',
            group: 'cap',
            prefix: 'instructores',
            data: data,
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
                    this.showModal = false
                    this.instructorForm.reset()
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
        console.log('datos a guardar', data)
    }
    // Metodo para actualizar instructor
    actualizarInstructor() {
        const id = this.instructor
        const docn = this.instructorForm.value

        const data = {
            cOpcion: 'ACTUALIZAR',
            cPersCelular: docn.cPersCelular,
            cPersCorreo: docn.cPersCorreo,
            cPersDireccion: docn.cPersDireccion,
            iCredId: this._constantesService.iCredId,
        }
        const params = {
            petition: 'put',
            group: 'cap',
            prefix: 'instructores',
            ruta: id.iInstId,
            data: data,
            params: {
                iCredId: this._constantesService.iCredId,
            },
        }
        // console.log(params)
        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe({
            next: (resp) => {
                if (resp.validated) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Acción exitosa',
                        detail: resp.message,
                    })
                    this.showModal = false
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
            // console.log('Datos persona:', this.data);
        })
    }
}
