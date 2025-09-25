import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MultiChartComponent } from '../../shared/multi-chart/multi-chart.component';
import { DatosInformeBienestarService } from '../../services/datos-informe-bienestar.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-informe-econonomico',
  standalone: true,
  imports: [PrimengModule, MultiChartComponent],
  templateUrl: './informe-economico.component.html',
  styleUrl: './../informe-estadistico.component.scss',
})
export class InformeEconomicoComponent implements OnInit {
  reportes_economico: any;
  perfil: any;
  es_estudiante_apoderado: boolean = false;

  constructor(
    private datosInformes: DatosInformeBienestarService,
    private store: LocalStoreService
  ) {
    this.datosInformes.setActiveIndex(1);
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit() {
    this.datosInformes.reportes$.subscribe(data => {
      if (data?.data) {
        this.reportes_economico = {
          rango_ingresos_familiar: JSON.parse(data.data?.rango_ingresos_familiar),
          tiene_trabajo: JSON.parse(data.data?.tiene_trabajo),
          apoyo_economico: JSON.parse(data.data?.apoyo_economico),
          dependencia_economica: JSON.parse(data.data?.dependencia_economica),
          jornada_laboral: JSON.parse(data.data?.jornada_laboral),
        };
      }
    });
  }
}
