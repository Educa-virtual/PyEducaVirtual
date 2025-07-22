import { Component, OnInit } from '@angular/core'
//import { ActivatedRoute } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { DatosInformeBienestarService } from '../../services/datos-infome-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
@Component({
    selector: 'app-informe-discapacidad',
    standalone: true,
    imports: [PrimengModule, ChartModule, MultiChartComponent],
    templateUrl: './informe-discapacidad.component.html',
    styleUrl: './informe-discapacidad.component.scss',
})
export class InformeDiscapacidadComponent implements OnInit {
    reportes_discapacidad: any
    cantidad_con_discapacidad: number

    constructor(private datosInformes: DatosInformeBienestarService) {}

    ngOnInit() {
        this.datosInformes.verReporte().subscribe((data) => {
            this.cantidad_con_discapacidad =
                data.data?.cantidad_con_discapacidad
            this.reportes_discapacidad = {
                seguros_discapacidad: JSON.parse(
                    data.data?.tipos_discapacidades
                ),
            }
        })
    }
}
