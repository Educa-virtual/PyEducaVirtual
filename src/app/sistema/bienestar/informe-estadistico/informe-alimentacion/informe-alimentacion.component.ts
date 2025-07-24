import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
@Component({
    selector: 'app-informe-alimentacion',
    standalone: true,
    imports: [PrimengModule, ChartModule, MultiChartComponent],
    templateUrl: './informe-alimentacion.component.html',
    styleUrl: './informe-alimentacion.component.scss',
})
export class InformeAlimentacionComponent implements OnInit {
    reportes_alimentacion: any

    constructor(private datosInformes: DatosInformeBienestarService) {
        this.datosInformes.setActiveIndex(3)
    }

    ngOnInit() {
        this.datosInformes.reportes$.subscribe((data) => {
            if (data?.data) {
                this.reportes_alimentacion = {
                    programas_alimentacion: JSON.parse(
                        data.data?.programas_alimentacion
                    ),
                    lugar_desayuno: JSON.parse(data.data?.lugar_desayuno),
                    lugar_almuerzo: JSON.parse(data.data?.lugar_almuerzo),
                    lugar_cena: JSON.parse(data.data?.lugar_cena),
                    tiene_dietas: JSON.parse(data.data?.tiene_dietas),
                    alergia_alimentos: JSON.parse(data.data?.alergia_alimentos),
                    dificultad_conseguir_alimentos: JSON.parse(
                        data.data?.dificultad_conseguir_alimentos
                    ),
                }
            }
        })
    }
}
