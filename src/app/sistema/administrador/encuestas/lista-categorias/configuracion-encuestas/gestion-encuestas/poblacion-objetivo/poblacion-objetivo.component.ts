import { Component } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { poblacionObjetivoColumns } from '../../config/tables/poblacion-objetivo'
import { ButtonModule } from 'primeng/button'
import { Router } from '@angular/router'

@Component({
    selector: 'app-poblacion-objetivo',
    standalone: true,
    imports: [AccordionModule, ButtonModule, TablePrimengComponent],
    templateUrl: './poblacion-objetivo.component.html',
    styleUrl: './poblacion-objetivo.component.scss',
})
export class PoblacionObjetivoComponent {
    perfilesObjetivos = [
        {
            nombre: 'Estudiante',
            descripcion: 'Estudiantes de la institución educativa',
        },
        {
            nombre: 'Docente',
            descripcion: 'Docentes de la institución educativa',
        },
        {
            nombre: 'Padre de familia',
            descripcion: 'Padres de familia de los estudiantes',
        },
        {
            nombre: 'Egresado',
            descripcion: 'Egresados de la institución educativa',
        },
        { nombre: 'Otro', descripcion: 'Otros' },
    ]

    poblacionObjetivoColumns = poblacionObjetivoColumns

    constructor(private router: Router) {}

    prevRoute() {
        this.router.navigate([
            '/encuestas/configuracion-encuesta/informacion-general',
        ])
    }

    nextRoute() {
        this.router.navigate(['/encuestas/configuracion-encuesta/resumen'])
    }
}
