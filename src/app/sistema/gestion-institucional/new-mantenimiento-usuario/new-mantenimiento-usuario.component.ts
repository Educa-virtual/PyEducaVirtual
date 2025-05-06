import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown'
import { PaginatorModule } from 'primeng/paginator'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'

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
        TablePrimengComponent,
    ],
    templateUrl: './new-mantenimiento-usuario.component.html',
    styleUrl: './new-mantenimiento-usuario.component.scss',
})
export class NewMantenimientoUsuarioComponent implements OnInit {
    usuarios: Usuario[] = []
    searchText: string = ''
    selectedSearchType: any = { name: 'Documento', code: 'documento' }
    selectedFilter: any = { name: 'Dremo', code: 'dremo' }
    selectedStatusFilter: any = { name: 'Todos', code: 'todos' }

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
    iPerfilId: any

    constructor() {}

    ngOnInit() {
        this.usuarios = [
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
                documento: '74829163',
                rol: 'Director',
                apellidosNombres: 'Torres Valdivia, Juan Carlos',
                institucion: 'I.E. José Carlos Mariátegui',
            },
            {
                id: 4,
                documento: '83647219',
                rol: 'Docente',
                apellidosNombres: 'Flores Quispe, Rosa Elena',
                institucion: 'I.E. Santa Fortunata',
            },
            {
                id: 5,
                documento: '92738451',
                rol: 'Estudiante',
                apellidosNombres: 'Mendoza Ccallo, Diego Sebastián',
                institucion: 'I.E. Daniel Becerra Ocampo',
            },
            {
                id: 6,
                documento: '61729485',
                rol: 'Director',
                apellidosNombres: 'Gutiérrez Apaza, Carmen Beatriz',
                institucion: 'I.E. Daniel Becerra Ocampo',
            },
            {
                id: 7,
                documento: '35928174',
                rol: 'Director',
                apellidosNombres: 'Nina Huanca, Marco Antonio',
                institucion: 'I.E. María Auxiliadora',
            },
            {
                id: 8,
                documento: '78293561',
                rol: 'Director',
                apellidosNombres: 'Herrera Coaquira, Silvia Milagros',
                institucion: 'I.E. Simón Bolívar',
            },
            {
                id: 9,
                documento: '64918372',
                rol: 'Especialista UGEL',
                apellidosNombres: 'Soto Luque, Enrique Rafael',
                institucion: 'UGEL Mariscal Nieto',
            },
            {
                id: 10,
                documento: '51938276',
                rol: 'Director',
                apellidosNombres: 'Valdivia Ramos, Julio César',
                institucion: 'I.E. Santa Fortunata',
            },
        ]
    }

    agregarNuevoUsuario() {
        console.log('Agregar nuevo usuario')
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
