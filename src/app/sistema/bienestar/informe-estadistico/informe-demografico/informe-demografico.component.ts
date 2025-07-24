import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
@Component({
    selector: 'app-informe-demografico',
    standalone: true,
    imports: [PrimengModule, ChartModule, MultiChartComponent],
    templateUrl: './informe-demografico.component.html',
    styleUrl: './informe-demografico.component.scss',
})
export class InformeDemograficoComponent implements OnInit {
    reportes_demograficos: any

    constructor(private datosInformes: DatosInformeBienestarService) {
        this.datosInformes.setActiveIndex(7)
    }

    ngOnInit() {
        this.datosInformes.reportes$.subscribe((data) => {
            if (data?.data) {
                this.reportes_demograficos = {
                    genero: JSON.parse(data.data?.genero),
                    edad: JSON.parse(data.data?.edad),
                }
            }
        })
    }
}
