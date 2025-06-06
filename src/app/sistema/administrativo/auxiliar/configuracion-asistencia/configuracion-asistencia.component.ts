import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-configuracion-asistencia',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './configuracion-asistencia.component.html',
    styleUrl: './configuracion-asistencia.component.scss',
})
export class ConfiguracionAsistenciaComponent {
    selRol: any
    roles: any = [
        { id: 1, cNombre: 'Docente' },
        { id: 2, cNombre: 'Administrativo' },
        { id: 3, cNombre: 'Estudiante' },
    ]
}
