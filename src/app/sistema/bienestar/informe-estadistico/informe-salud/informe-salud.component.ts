import { Component, OnInit } from '@angular/core'
//import { ActivatedRoute } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { DatosInformeBienestarService } from '../../services/datos-infome-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
@Component({
    selector: 'app-informe-salud',
    standalone: true,
    imports: [PrimengModule, ChartModule, MultiChartComponent],
    templateUrl: './informe-salud.component.html',
    styleUrl: './informe-salud.component.scss',
})
export class InformeSaludComponent implements OnInit {
    reportes_salud: any

    constructor(private datosInformes: DatosInformeBienestarService) {}

    ngOnInit() {
        this.datosInformes.verReporte().subscribe((data) => {
            this.reportes_salud = {
                seguros_salud: JSON.parse(data.data?.seguros_salud),
                alergia_medicamentos: JSON.parse(
                    data.data?.alergia_medicamentos
                ),
                tipos_dolencias: JSON.parse(data.data?.tipos_dolencias),
            }
        })
    }
}
