import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

// PrimeNG imports
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip'

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
    ],
    templateUrl: './asignar-rol-personal.component.html',
    styleUrl: './asignar-rol-personal.component.scss',
})
export class AsignarRolPersonalComponent implements OnInit {
    instituciones: Institucion[] = []
    niveles: Nivel[] = []
    modulos: Modulo[] = []
    roles: Rol[] = []

    institucionSeleccionada: Institucion | null = null
    nivelSeleccionado: Nivel | null = null
    moduloSeleccionado: Modulo | null = null
    rolSeleccionado: Rol | null = null

    asignaciones: AsignacionRol[] = []

    ngOnInit() {
        // Inicializar datos de ejemplo
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
                id: 2,
                rol: 'Director',
                nivel: 'Secundario',
                institucion: 'I.E. Rafael Díaz',
                fechaAsignacion: '04/07/2024',
            },
        ]
    }

    agregarAsignacion() {
        // Implementar lógica para agregar nueva asignación
        console.log(
            'Agregar asignación',
            this.institucionSeleccionada,
            this.nivelSeleccionado,
            this.moduloSeleccionado,
            this.rolSeleccionado
        )
    }

    eliminarUsuario(id: number) {
        // Implementar lógica para eliminar asignación
        this.asignaciones = this.asignaciones.filter((item) => item.id !== id)
    }
}
/*import { Component,  } from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@Component({
  selector: 'app-asignar-rol-personal',
  standalone: true,
  imports: [TableModule, InputGroupAddonModule, InputGroupModule,
  ],
  templateUrl: './asignar-rol-personal.component.html',
  styleUrl: './asignar-rol-personal.component.scss'
})
export class AsignarRolPersonalComponent {
  instituciones = [{ label: 'I.E. Rafael Díaz', value: 'I.E. Rafael Díaz' }, { label: 'I.E. Simón Bolívar', value: 'I.E. Simón Bolívar' }];
  niveles = [{ label: 'Secundario', value: 'Secundario' }, { label: 'Superior', value: 'Superior' }];
  modulos = [...this.instituciones]; // Asumimos mismo contenido
  roles = [{ label: 'Docente', value: 'Docente' }, { label: 'Estudiante', value: 'Estudiante' }, { label: 'Director', value: 'Director' }];

  selectedInstitucion?: string;
  selectedNivel?: string;
  selectedModulo?: string;
  selectedRol?: string;

  rolesAsignados: any[] = [
    { rol: 'Docente', nivel: 'Secundario', institucion: 'I.E. Rafael Díaz', fecha: '04/07/2024' },
    { rol: 'Estudiante', nivel: 'Superior', institucion: 'I.E. Simón Bolívar', fecha: '04/07/2024' },
    { rol: 'Director', nivel: 'Secundario', institucion: 'I.E. Rafael Díaz', fecha: '04/07/2024' }
  ];

  agregarRol() {
    if (this.selectedRol && this.selectedNivel && this.selectedInstitucion) {
      this.rolesAsignados.push({
        rol: this.selectedRol,
        nivel: this.selectedNivel,
        institucion: this.selectedInstitucion,
        fecha: new Date().toLocaleDateString('en-GB')
      });
      // Reset
      this.selectedRol = this.selectedNivel = this.selectedInstitucion = undefined;
    }
  }

  eliminarRol(index: number) {
    this.rolesAsignados.splice(index, 1);
  }
}
*/
