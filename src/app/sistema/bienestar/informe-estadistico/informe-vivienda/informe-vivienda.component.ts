import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
//import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-informe-vivienda',
    standalone: true,
    imports: [PrimengModule, ChartModule, MultiChartComponent],
    templateUrl: './informe-vivienda.component.html',
    styleUrl: './informe-vivienda.component.scss',
})
export class InformeViviendaComponent implements OnInit {
    reportes_vivienda: any

    constructor(private datosInformes: DatosInformeBienestarService) {
        this.datosInformes.setActiveIndex(2)
    }

    ngOnInit() {
        this.datosInformes.verReporte().subscribe((data) => {
            this.reportes_vivienda = {
                ocupacion_vivienda: JSON.parse(data.data?.ocupacion_vivienda),
                estado_vivienda: JSON.parse(data.data?.estado_vivienda),
                material_paredes: JSON.parse(data.data?.material_paredes),
                suministro_agua: JSON.parse(data.data?.suministro_agua),
                tipo_vivienda: JSON.parse(data.data?.tipo_vivienda),
                tipo_sshh: JSON.parse(data.data?.tipo_sshh),
                tipo_alumbrado: JSON.parse(data.data?.tipo_alumbrado),
                elementos_vivienda: JSON.parse(data.data?.elementos_vivienda),
            }
        })
    }
}
