import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service'
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component'
@Component({
    selector: 'app-informe-familia',
    standalone: true,
    imports: [PrimengModule, MultiChartComponent],
    templateUrl: './informe-familia.component.html',
    styleUrl: './informe-familia.component.scss',
})
export class InformeFamiliaComponent implements OnInit {
    reportes_familia: any

    constructor(private datosInformes: DatosInformeBienestarService) {
        this.datosInformes.setActiveIndex(0)
    }

    ngOnInit() {
        this.datosInformes.verReporte().subscribe((data) => {
            this.reportes_familia = {
                padre_vive: JSON.parse(data.data?.padre_vive),
                madre_vive: JSON.parse(data.data?.madre_vive),
                padres_viven_juntos: JSON.parse(data.data?.padres_viven_juntos),
                tiene_hijos: JSON.parse(data.data?.tiene_hijos),
            }
        })
    }
}
