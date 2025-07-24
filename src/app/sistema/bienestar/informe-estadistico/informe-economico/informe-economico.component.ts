import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service'

@Component({
    selector: 'app-informe-econonomico',
    standalone: true,
    imports: [PrimengModule, MultiChartComponent],
    templateUrl: './informe-economico.component.html',
    styleUrl: './informe-economico.component.scss',
})
export class InformeEconomicoComponent implements OnInit {
    reportes_economico: any

    constructor(private datosInformes: DatosInformeBienestarService) {
        this.datosInformes.setActiveIndex(1)
    }

    ngOnInit() {
        this.datosInformes.reportes$.subscribe((data) => {
            if (data?.data) {
                this.reportes_economico = {
                    rango_ingresos_familiar: JSON.parse(
                        data.data?.rango_ingresos_familiar
                    ),
                    tiene_trabajo: JSON.parse(data.data?.tiene_trabajo),
                    apoyo_economico: JSON.parse(data.data?.apoyo_economico),
                    dependencia_economica: JSON.parse(
                        data.data?.dependencia_economica
                    ),
                    jornada_laboral: JSON.parse(data.data?.jornada_laboral),
                }
            }
        })
    }
}
