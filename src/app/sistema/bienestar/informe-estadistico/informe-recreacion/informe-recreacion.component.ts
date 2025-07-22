import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
@Component({
    selector: 'app-informe-recreacion',
    standalone: true,
    imports: [PrimengModule, ChartModule, MultiChartComponent],
    templateUrl: './informe-recreacion.component.html',
    styleUrl: './informe-recreacion.component.scss',
})
export class InformeRecreacionComponent implements OnInit {
    reportes_recreacion: any

    constructor(private datosInformes: DatosInformeBienestarService) {
        this.datosInformes.setActiveIndex(6)
    }

    ngOnInit() {
        this.datosInformes.reportes$.subscribe((data) => {
            if (data) {
                this.reportes_recreacion = {
                    deportes: JSON.parse(data.data?.deportes),
                    actividad_artistica: JSON.parse(
                        data.data?.actividades_artisticas
                    ),
                    pasatiempos: JSON.parse(data.data?.pasatiempos),
                    transportes: JSON.parse(data.data?.transportes),
                    familiar_acude: JSON.parse(data.data?.familiar_acude),
                    religion: JSON.parse(data.data?.religion),
                }
            }
        })
    }
}
