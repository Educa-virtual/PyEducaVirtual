import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormGroup, FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { PaginatorModule } from 'primeng/paginator'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'
import { InputGroupModule } from 'primeng/inputgroup'
import { RippleModule } from 'primeng/ripple'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { AsignarRolPersonalComponent } from './asignar-rol-personal/asignar-rol-personal.component'
import { AgregarPersonalPlataformaComponent } from './agregar-personal-plataforma/agregar-personal-plataforma.component'
import { PrimengModule } from '@/app/primeng.module'
interface Usuario {
    id: number
    documento: string
    rol: string
    apellidosNombres: string
    institucion: string
}

@Component({
    selector: 'app-new-mantenimiento-usuario',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        PaginatorModule,
        TooltipModule,
        InputGroupModule,
        RippleModule,
        AsignarRolPersonalComponent,
        ToastModule,
        AgregarPersonalPlataformaComponent,
        PrimengModule,
    ],
    providers: [MessageService],
    templateUrl: './new-mantenimiento-usuario.component.html',
    styleUrls: ['./new-mantenimiento-usuario.component.scss'],
})
export class NewMantenimientoUsuarioComponent implements OnInit {
    user: Usuario[] = []
    searchText: string = ''
    form: FormGroup

    searchTypes = [
        { name: 'Documento', code: 'documento' },
        { name: 'Apellidos', code: 'apellidos' },
        { name: 'Nombres', code: 'nombres' },
    ]

    filterOptions = [
        { name: 'Dremo', code: 'dremo' },
        { name: 'UGEL', code: 'ugel' },
        { name: 'Institución', code: 'institucion' },
    ]

    statusOptions = [
        { name: 'Todos', code: 'todos' },
        { name: 'Activos', code: 'activos' },
        { name: 'Inactivos', code: 'inactivos' },
    ]

    selectedSearchType: any = { name: 'Documento', code: 'documento' }
    selectedFilter: any = { name: 'Dremo', code: 'dremo' }
    selectedStatusFilter: any = { name: 'Todos', code: 'todos' }

    documento: any[] = [
        { nombre: 'I.E. Rafael Díaz', codigo: 'RAF' },
        { nombre: 'I.E. Simón Bolívar', codigo: 'SIM' },
    ]

    // Variables para controlar el diálogo
    modalRolVisible: boolean = false
    selectedUser: Usuario | null = null

    // modal 2
    modalAgregarPersonalVisible: boolean = false
    modalPersonalVisible: boolean = false
    selectedPersonal: Usuario | null = null

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.user = [
            {
                id: 1,
                documento: '47382910',
                rol: 'Especialista UGEL',
                apellidosNombres: 'Cárdenas Huamán, Luis Alberto',
                institucion: 'UGEL Sánchez Cerro',
            },
            {
                id: 2,
                documento: '50938472',
                rol: 'Especialista DREMO',
                apellidosNombres: 'Ramírez Mamani, Ana Mercedes',
                institucion: 'DREMO',
            },
            {
                id: 3,
                documento: '47382910',
                rol: 'Especialista UGEL',
                apellidosNombres: 'Cárdenas Huamán, Luis Alberto',
                institucion: 'UGEL Sánchez Cerro',
            },
            {
                id: 4,
                documento: '50938472',
                rol: 'Especialista DREMO',
                apellidosNombres: 'Ramírez Mamani, Ana Mercedes',
                institucion: 'DREMO',
            },
            {
                id: 5,
                documento: '47382910',
                rol: 'Especialista UGEL',
                apellidosNombres: 'Cárdenas Huamán, Luis Alberto',
                institucion: 'UGEL Sánchez Cerro',
            },
            {
                id: 6,
                documento: '50938472',
                rol: 'Especialista DREMO',
                apellidosNombres: 'Ramírez Mamani, Ana Mercedes',
                institucion: 'DREMO',
            },
        ]
    }

    agregarNuevoPersonal() {
        this.selectedUser = null
        this.modalAgregarPersonalVisible = true
    }

    abrirDialogoAsignarRol(usuario: Usuario) {
        this.selectedUser = usuario
        this.modalRolVisible = true
    }
    /*
    abrirDialogoAsignarRol(usuario: Usuario) {
        this.selectedUser = usuario
        this.modalRolVisible = true
    }
    */

    agregarNuevo() {
        this.selectedUser = null
        this.modalRolVisible = true
    }

    editarUsuario(usuario: Usuario) {
        console.log('Editar usuario:', usuario)
    }

    verUsuario(usuario: Usuario) {
        console.log('Ver usuario:', usuario)
    }

    eliminarUsuario(usuario: Usuario) {
        console.log('Eliminar usuario:', usuario)
    }
}
