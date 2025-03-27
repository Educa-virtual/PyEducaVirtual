import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core'

import { PrimengModule } from '@/app/primeng.module'
import {
    IActionContainer,
    ContainerPageComponent,
} from '@/app/shared/container-page/container-page.component'
//para formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
//import { MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-mantenimiento-add-user',
    standalone: true,
    imports: [PrimengModule, ContainerPageComponent],
    templateUrl: './mantenimiento-add-user.component.html',
    styleUrl: './mantenimiento-add-user.component.scss',
})
export class MantenimientoAddUserComponent implements OnChanges, OnInit {
    @Output() nuevo_usuario = new EventEmitter() // emite usuario para registar

    @Input() data //listao de usuarios
    @Input() search_perfiles // lista de perfiles
    @Input() iSedeId
    @Input() iYAcadId
    @Input() iCredId

    form_user: FormGroup
    btnValidar: boolean = false
    registro: any
    datoValido: boolean = false

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        private fb: FormBuilder,
        private query: GeneralService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.form_user = this.fb.group({
            iPerfilId: ['', [Validators.required]],
            iPersId: [''],
            iTipoIdentId: [1, [Validators.required]],
            cPersDocumento: [''],
            cPersNombre: ['', [Validators.required]],
            cPersMaterno: [''],
            cPersPaterno: [''],
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.data || this.search_perfiles) {
            //this.getPerfilUsuario(this.usuario)
            //this.getAccesos(this.option);
            //console.log(this.area, ' registro en com if visible_horario');
            //this.mostrarModal();
        }
        if (changes['data'] && changes['data'].currentValue) {
            // this.getPerfilUsuario(this.data)
        }
        console.log(this.iCredId, this.iSedeId, this.iYAcadId)
    }

    accionBtn(event: any, accion: string) {
        console.log('item nuevo usuario event', accion)
        if (accion === 'nuevo_perfil_generado') {
            const item = [
                {
                    iPersId: this.form_user.value.iPersId,
                    iPerfilId: this.form_user.value.iPerfilId,
                },
            ]
            const params = { action: accion, item: item }

            this.validarDocumento()
            this.nuevo_usuario.emit(params)
            // Explicitly return to ensure a value is returned
        }
        //
        if (accion === 'Validar') {
            if (event == 1) {
                this.btnValidar = true
                // Agregar validaciones al campo 'cDocumento'
                this.form_user.get('cDocumento')?.setValidators([
                    Validators.required, // Campo obligatorio
                    Validators.pattern(/^\d{8}$/), // Solo 8 dígitos numéricos
                ])

                // Aplicar los cambios para que Angular revalide el campo
                this.form_user.get('cDocumento')?.updateValueAndValidity()
            } else if (event == 2 || event == 3) {
                this.btnValidar = true
                this.form_user.get('cDocumento')?.setValidators([
                    Validators.required, // Campo obligatorio
                ])
            } else {
                this.btnValidar = false
                this.form_user
                    .get('cDocumento')
                    ?.setValidators([Validators.required])
            }

            // Agrega aquí la lógica adicional si es necesario
        }
    }

    validarDocumento() {
        // solo para DNI
        this.query
            .validarPersona({
                iTipoIdentId: this.form_user.get('iTipoIdentId')?.value,
                cPersDocumento: this.form_user.get('cPersDocumento')?.value,
            })
            .subscribe({
                next: (data: any) => {
                    console.log(data, 'validar persona')
                    this.setFormUsuario(data.data)
                    this.registro = data.data
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Información válidada correctamente',
                        detail: data.message,
                    })
                    this.datoValido = true // valido el procesamiento
                },
                error: (error) => {
                    console.error('Error validando persona:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Información invalida datos inconsistentes ',
                        detail: error,
                    })
                    this.datoValido = false // no existe en BD
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    generarCredencialesIE() {
        //console.log(this.registro);

        if (this.datoValido) {
            alert(this.form_user.value.iPerfilId)
            this.query
                .generarCredencialesIE({
                    data: this.registro,
                    iSedeId: this.iSedeId,
                    iYAcadId: this.iYAcadId,
                    iCredId: this.iCredId,
                    iPerfilId: Number(this.form_user.value.iPerfilId),
                    condicion: 'add_credencial_ie',
                })
                .subscribe({
                    next: (data: any) => {
                        console.log(data, 'validar persona')
                        this.setFormUsuario(data.data)
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: data.message,
                        })
                    },
                    error: (error) => {
                        console.error('Error validando persona:', error)
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error,
                        })
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de Procesamiento',
                detail: 'Error Datos inconsistentes (No validos)',
            })
        }
    }

    setFormUsuario(item: any) {
        this.form_user.get('iTipoIdentId')?.setValue(item?.iTipoIdentId)
        this.form_user.get('cPersDocumento')?.setValue(item?.cPersDocumento)
        this.form_user.get('cPersNombre')?.setValue(item?.cPersNombre)
        this.form_user.get('cPersPaterno')?.setValue(item?.cPersPaterno)
        this.form_user.get('cPersMaterno')?.setValue(item?.cPersMaterno)
    }

    //estructura de boton de contenedor
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Crear credencial a usuario',
            text: 'Generar credencial',
            icon: 'pi pi-check-square',
            accion: 'nuevo_perfil_generado',
            class: 'p-button-primary',
        },
    ]
}
