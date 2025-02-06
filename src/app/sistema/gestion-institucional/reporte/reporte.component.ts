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
    periodos: string[] = undefined
    trimestre: string[] = undefined
    anuales = undefined
    selectedCity = undefined

    ngOnInit() {
        this.periodos = ['1 bimestre', '2 bimestre', '3 bimestre', '4 bimestre']
        this.trimestre = ['1 trimestre', '2 trimestre', '3 trimestre']
        this.anuales = [2022, 2023, 2024]
    }
}
