import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-reporte',
    standalone: true,
    imports: [PrimengModule, CommonModule],
    templateUrl: './reporte.component.html',
    styleUrl: './reporte.component.scss',
})
export class ReporteComponent implements OnInit {
    productService = undefined
    identidad: any
    nota: any
    nivel: any
    ngOnInit() {
        this.identidad = [{ nombre: 'car', paterno: 'chu', materno: 'flo' }]
        this.nota = [
            {
                indice: '1',
                curricular: 'matematica',
                year1: '11',
                year2: '12',
                year3: '12',
                year4: '12',
                year5: '12',
            },
            {
                indice: '2',
                curricular: 'ingles',
                year1: '11',
                year2: '12',
                year3: '12',
                year4: '12',
                year5: '12',
            },
            {
                indice: '3',
                curricular: 'comunicaicon',
                year1: '11',
                year2: '12',
                year3: '12',
                year4: '12',
                year5: '12',
            },
            {
                indice: '4',
                curricular: 'situacion final',
                year1: 'aprobado',
                year2: 'aprobado',
                year3: 'aprobado',
                year4: 'aprobado',
                year5: 'aprobado',
            },
        ]
        this.nivel = [{ name: 'Primaria' }, { name: 'Secundaria' }]
    }
}
