import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'
import { RippleModule } from 'primeng/ripple'
import { PrimengModule } from '@/app/primeng.module'
import { DialogModule } from 'primeng/dialog'

interface Institucion {
    nombre: string
    codigo: string
}

interface Nivel {
    nombre: string
    codigo: string
}

interface Modulo {
    nombre: string
    codigo: string
}

interface Rol {
    nombre: string
    codigo: string
}

interface AsignacionRol {
    id: number
    rol: string
    nivel: string
    institucion: string
    fechaAsignacion: string
}

@Component({
    selector: 'app-asignar-rol-personal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        TableModule,
        ButtonModule,
        TooltipModule,
        RippleModule,
        PrimengModule,
        DialogModule,
    ],
    templateUrl: './asignar-rol-personal.component.html',
    styleUrls: ['./asignar-rol-personal.component.scss'],
})
export class AsignarRolPersonalComponent implements OnInit, OnChanges {
    instituciones: Institucion[] = []
    niveles: Nivel[] = []
    modulos: Modulo[] = []
    roles: Rol[] = []

    institucionSeleccionada: Institucion | null = null
    nivelSeleccionado: Nivel | null = null
    moduloSeleccionado: Modulo | null = null
    rolSeleccionado: Rol | null = null

    asignaciones: AsignacionRol[] = []

    // Propiedades para el diálogo
    @Input() visible: boolean = false
    @Input() personalData: any = null
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() rolAsignado = new EventEmitter<any>()

    ngOnInit() {
        this.inicializarDatos()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && changes['visible'].currentValue === true) {
            this.inicializarDatos()
        }
    }

    inicializarDatos() {
        this.instituciones = [
            { nombre: 'I.E. Rafael Díaz', codigo: 'RAF' },
            { nombre: 'I.E. Simón Bolívar', codigo: 'SIM' },
        ]

        this.niveles = [
            { nombre: 'Primario', codigo: 'PRI' },
            { nombre: 'Secundario', codigo: 'SEC' },
            { nombre: 'Superior', codigo: 'SUP' },
        ]

        this.modulos = [
            { nombre: 'I.E. Rafael Díaz', codigo: 'RAF' },
            { nombre: 'I.E. Simón Bolívar', codigo: 'SIM' },
        ]

        this.roles = [
            { nombre: 'Docente', codigo: 'DOC' },
            { nombre: 'Estudiante', codigo: 'EST' },
            { nombre: 'Director', codigo: 'DIR' },
        ]

        if (this.personalData) {
            console.log('Cargando datos del usuario:', this.personalData)
        }

        this.asignaciones = [
            {
                id: 1,
                rol: 'Docente',
                nivel: 'Secundario',
                institucion: 'I.E. Rafael Díaz',
                fechaAsignacion: '04/07/2024',
            },
            {
                id: 2,
                rol: 'Estudiante',
                nivel: 'Superior',
                institucion: 'I.E. Simón Bolívar',
                fechaAsignacion: '04/07/2024',
            },
            {
                id: 3,
                rol: 'Director',
                nivel: 'Secundario',
                institucion: 'I.E. Rafael Díaz',
                fechaAsignacion: '04/07/2024',
            },
        ]
    }

    agregarAsignacion() {
        if (
            this.rolSeleccionado &&
            this.nivelSeleccionado &&
            this.institucionSeleccionada
        ) {
            const nuevoId =
                this.asignaciones.length > 0
                    ? Math.max(...this.asignaciones.map((a) => a.id)) + 1
                    : 1

            const nuevaAsignacion: AsignacionRol = {
                id: nuevoId,
                rol: this.rolSeleccionado.nombre,
                nivel: this.nivelSeleccionado.nombre,
                institucion: this.institucionSeleccionada.nombre,
                fechaAsignacion: this.formatearFecha(new Date()),
            }

            this.asignaciones = [...this.asignaciones, nuevaAsignacion]

            this.rolSeleccionado = null
        } else {
            console.error('Falta seleccionar algún campo')
        }
    }

    eliminarUsuario(id: number) {
        this.asignaciones = this.asignaciones.filter((item) => item.id !== id)
    }

    private formatearFecha(fecha: Date): string {
        const dia = fecha.getDate().toString().padStart(2, '0')
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
        const anio = fecha.getFullYear()
        return `${dia}/${mes}/${anio}`
    }

    closeDialog() {
        this.visible = false
        this.visibleChange.emit(false)
    }

    guardarCambios() {
        this.rolAsignado.emit({
            asignaciones: this.asignaciones,
            personalData: this.personalData,
        })

        // Cerrar el diálogo
        this.closeDialog()
    }
}
