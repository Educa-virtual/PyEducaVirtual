import { UsuariosService } from './../services/usuarios.service'
import { MessageService, SelectItem } from 'primeng/api'
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-agregar-usuario',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './agregar-usuario.component.html',
    styleUrl: './agregar-usuario.component.scss',
})
export class AgregarUsuarioComponent implements OnInit {
    formUsuario!: FormGroup
    dataSexos: SelectItem[] = []
    dataTiposDocumento: SelectItem[] = []
    botonRegistrarDesactivado: boolean = true

    constructor(
        private fb: FormBuilder,
        private usuariosService: UsuariosService,
        private generalService: GeneralService,
        private messageService: MessageService
    ) {}

    // Propiedades para el diálogo
    @Input() visible: boolean = false
    //@Input()
    dataResultadoBusquedaUsuario: any = null
    @Input() dataUsuarios: any[] = []
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() usuarioRegistradoEvent = new EventEmitter<any>()

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this.dataSexos = [
            { label: 'Masculino', value: 'M' },
            { label: 'Femenino', value: 'F' },
        ]
        this.dataTiposDocumento = [
            { label: 'DNI', value: 1 },
            { label: 'RUC', value: 2 },
            { label: 'Carnet ', value: 3 },
        ]
        this.formUsuario = this.fb.group({
            iPersId: [''],
            iTipoIdentId: [1, [Validators.required]],
            cPersDocumento: ['', [Validators.required]],
            cPersNombre: ['', [Validators.required]],
            cPersMaterno: [''],
            cPersPaterno: ['', [Validators.required]],
            cPersSexo: ['M', [Validators.required]],
        })
    }

    closeDialog() {
        this.visible = false
        this.reiniciarFormulario()
        this.formUsuario.get('cPersDocumento')?.setValue('')
        this.visibleChange.emit(false)
    }

    reiniciarFormulario() {
        this.formUsuario.get('iPersId')?.setValue('')
        this.formUsuario.get('cPersNombre')?.setValue('')
        this.formUsuario.get('cPersPaterno')?.setValue('')
        this.formUsuario.get('cPersMaterno')?.setValue('')
    }

    buscarPersonaPorDocumento() {
        this.reiniciarFormulario()
        this.usuariosService
            .buscarPersonaPorDocumento(
                this.formUsuario.get('iTipoIdentId')?.value,
                this.formUsuario.get('cPersDocumento')?.value
            )
            .subscribe({
                next: (data: any) => {
                    this.setFormUsuario(data.data)
                    this.dataResultadoBusquedaUsuario = data.data
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
                    this.dataResultadoBusquedaUsuario = null
                    console.error('Error obteniendo datos:', error)
                },
            })
    }

    setFormUsuario(item: any) {
        this.formUsuario.get('iPersId')?.setValue(item?.iPersId)
        this.formUsuario.get('cPersDocumento')?.setValue(item?.cPersDocumento)
        this.formUsuario.get('cPersNombre')?.setValue(item?.cPersNombre)
        this.formUsuario.get('cPersPaterno')?.setValue(item?.cPersPaterno)
        this.formUsuario.get('cPersMaterno')?.setValue(item?.cPersMaterno)
        this.formUsuario.get('cPersSexo')?.setValue(item?.cPersSexo)
    }

    registrarUsuario() {
        if (this.dataResultadoBusquedaUsuario === null) {
            this.dataResultadoBusquedaUsuario = this.formUsuario.value
        }
        this.usuariosService
            .registrarUsuario({
                data: this.dataResultadoBusquedaUsuario,
                iSedeId: 0,
                iYAcadId: 0,
                iPerfilId: 0,
            })
            .subscribe({
                next: (data: any) => {
                    //this.setFormUsuario(data.data)
                    this.usuarioRegistradoEvent.emit(data.data)
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
                        detail: error.error.message,
                    })
                },
            })
    }

    /*validar() {
        if (this.personalForm.valid) {
            console.log('Formulario válido:', this.personalForm.value)
        } else {
            console.log('Formulario inválido, complete todos los campos')
            this.personalForm.markAllAsTouched()
        }
    }*/

    /*agregarYAsignarRol() {
        if (this.personalForm.valid) {
            console.log(
                'Agregando personal y asignando rol:',
                this.personalForm.value
            )
        } else {
            console.log('Formulario inválido, complete todos los campos')
            this.personalForm.markAllAsTouched()
        }
    }*/
}
