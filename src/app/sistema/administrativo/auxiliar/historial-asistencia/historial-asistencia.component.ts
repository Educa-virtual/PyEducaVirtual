import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-historial-asistencia',
    standalone: true,
    imports: [FormsModule, CommonModule, PrimengModule],
    templateUrl: './historial-asistencia.component.html',
    styleUrl: './historial-asistencia.component.scss',
})
export class HistorialAsistenciaComponent implements OnInit {
    selectedRol: any
    personal: any = []

    grupo = []

    roles: any = [
        { id: 1, cNombre: 'Todos' },
        { id: 2, cNombre: 'Auxiliar' },
        { id: 3, cNombre: 'Estudiante' },
        { id: 4, cNombre: 'Docente' },
        { id: 5, cNombre: 'Administrativo' },
    ]

    headers: any = [
        { campo: '#' },
        { campo: 'Nombre y Apellidos' },
        { campo: 'Grupo' },
        { campo: 'Hora de Ingreso' },
        { campo: 'Acciones' },
    ]

    ngOnInit() {
        this.grupo = []

        this.roles = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ]
    }
}
