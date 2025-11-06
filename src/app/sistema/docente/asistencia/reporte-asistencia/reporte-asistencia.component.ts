import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { ModalPrimengComponent } from '../../../../shared/modal-primeng/modal-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  imports: [ModalPrimengComponent, PrimengModule],
  templateUrl: './reporte-asistencia.component.html',
  styleUrl: './reporte-asistencia.component.scss',
})
export class ReporteAsistenciaComponent implements OnChanges {
  private GeneralService = inject(GeneralService);

  @Output() accionBtnItem = new EventEmitter();

  @Input() showModal: boolean = true;
  @Input() iCursoId: string;
  @Input() iDocenteId: string;
  @Input() iNivelGradoId: string;
  @Input() iSeccionId: string;
  @Input() iYAcadId: string;
  @Input() iGradoId: string;
  @Input() cCursoNombre: string = '';
  @Input() cGradoAbreviacion: string = '';
  @Input() cSeccion: string = '';
  @Input() cNivelTipoNombre: string = '';
  @Input() cNivelNombreCursos: string = '';
  @Input() nombrecompleto: string = '';
  @Input() cCicloRomanos: string = '';
  @Input() cSeccionNombre: string = '';
  @Input() cPersNombreLargo: string = '';
  @Input() iSedeId: string;
  @Input() iIieeId: string;
  @Input() cIieeNombre: string;
  @Input() year: string;
  @Input() idDocCursoId: string;
  @Input() datos: any;
  minimo: Date;
  maximo: Date;
  fechas: string;
  plugin = ChartDataLabels;
  sesiones = [{ severity: 'info', detail: 'Seleccione Personalizado para Graficos' }];
  asistencia: any;

  constructor(private messageService: MessageService) {}

  opcionDona: any = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#000',
        formatter: value => {
          return value ? value : '';
        },
        font: {
          weight: 'bold' as const,
          size: 14,
        },
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  generarGrafico() {
    const verificar = this.iDateRango.length;
    const asistencia: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      7: 0,
      9: 0,
    };

    if (verificar == 2) {
      this.datos.forEach(item => {
        const dato = item.tipoAsistencia;
        if (dato != '' && dato != null && dato != 0 && dato != '0') {
          const inicio = this.formateaFecha(this.iDateRango[0]);
          const fin = this.formateaFecha(this.iDateRango[1]);
          if (item.start >= inicio && item.start <= fin) {
            const filtrar = item.title.split(' : ');
            const cantidad = parseInt(filtrar[1]);
            asistencia[dato] = asistencia[dato] + cantidad;
          }
        }
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Mensaje',
        detail: 'Seleccione un rango de fechas',
      });
      return;
    }

    const tardanza = [];
    tardanza[0] = asistencia[1];
    tardanza[1] = asistencia[2];
    tardanza[2] = asistencia[3];
    tardanza[3] = asistencia[4];
    tardanza[4] = asistencia[7];
    tardanza[5] = asistencia[9];

    this.asistencia = {
      labels: [
        'Asistencia',
        'Tardanza',
        'Inasistencia',
        'Inasistencia justificada',
        'Sin registro',
        'Tardanza justificada',
      ],
      datasets: [
        {
          data: tardanza,
          backgroundColor: [
            '#2bde76ff',
            '#e38945ff',
            '#e0524aff',
            '#4d84d7ff',
            '#4bc2d7ff',
            '#dab83dff',
          ],
          hoverBackgroundColor: ['#B3FFD3', '#FFC294', '#FF9B96', '#B5D2FF', '#8CEDFF', '#FFEDAB'],
        },
      ],
    };
  }
  formateaFecha(fecha: Date) {
    return (
      fecha.getFullYear() +
      '-' +
      (fecha.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      fecha.getDate().toString().padStart(2, '0')
    );
  }
  ngOnChanges(changes) {
    this.minimo = new Date(this.year + '/01/01');
    this.maximo = new Date(this.year + '/12/31');

    if (changes.showModal?.currentValue) {
      this.showModal = changes.showModal.currentValue;
    }
    if (changes.cCursoNombre?.currentValue) {
      this.cCursoNombre = changes.cCursoNombre.currentValue;
    }
    if (changes.cGradoAbreviacion?.currentValue) {
      this.cGradoAbreviacion = changes.cGradoAbreviacion.currentValue;
    }
    if (changes.cSeccion?.currentValue) {
      this.cSeccion = changes.cSeccion.currentValue;
    }
    if (changes.cNivelTipoNombre?.currentValue) {
      this.cNivelTipoNombre = changes.cNivelTipoNombre.currentValue;
    }
    if (changes.cNivelNombreCursos?.currentValue) {
      this.cNivelNombreCursos = changes.cNivelNombreCursos.currentValue;
    }
    if (changes.nombrecompleto?.currentValue) {
      this.nombrecompleto = changes.nombrecompleto.currentValue;
    }
    if (changes.cCicloRomanos?.currentValue) {
      this.cCicloRomanos = changes.cCicloRomanos.currentValue;
    }
    if (changes.iCursoId?.currentValue) {
      this.iCursoId = changes.iCursoId.currentValue;
    }
    if (changes.iNivelGradoId?.currentValue) {
      this.iNivelGradoId = changes.iNivelGradoId.currentValue;
    }
    if (changes.iYAcadId?.currentValue) {
      this.iYAcadId = changes.iYAcadId.currentValue;
    }
    if (changes.iGradoId?.currentValue) {
      this.iGradoId = changes.iGradoId.currentValue;
    }
    if (changes.iDocenteId?.currentValue) {
      this.iDocenteId = changes.iDocenteId.currentValue;
    }
    if (changes.iSeccionId?.currentValue) {
      this.iSeccionId = changes.iSeccionId.currentValue;
    }
  }

  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        this.accionBtnItem.emit({ accion, item });
        break;
    }
  }

  verReporte() {
    let data;
    switch (this.solicitarFecha) {
      case 1:
        data = {
          id: this.inputDia,
          opcion: 'reporte_personalizado',
          cSeccionNombre: this.cSeccionNombre,
          cGradoAbreviacion: this.cGradoAbreviacion,
          cNivelTipoNombre: this.cNivelTipoNombre,
          cNivelNombreCursos: this.cNivelNombreCursos,
          iCursoId: this.iCursoId,
          iDocenteId: this.iDocenteId,
          iSeccionId: this.iSeccionId,
          iGradoId: this.iGradoId,
          iNivelGradoId: this.iNivelGradoId,
          iYAcadId: this.iYAcadId,
          iIieeId: this.iIieeId,
          iSedeId: this.iSedeId,
          idDocCursoId: this.idDocCursoId,
        };
        this.rutas = 'reporte_diario';
        break;
      case 3:
        data = {
          id: this.iMesId,
          opcion: 'REPORTE_MENSUAL',
          cSeccionNombre: this.cSeccionNombre,
          cGradoAbreviacion: this.cGradoAbreviacion,
          cNivelTipoNombre: this.cNivelTipoNombre,
          cNivelNombreCursos: this.cNivelNombreCursos,
          cCicloRomanos: this.cCicloRomanos,
          iCursoId: this.iCursoId,
          iDocenteId: this.iDocenteId,
          iSeccionId: this.iSeccionId,
          iGradoId: this.iGradoId,
          iNivelGradoId: this.iNivelGradoId,
          iYAcadId: this.iYAcadId,
          iIieeId: this.iIieeId,
          iSedeId: this.iSedeId,
          idDocCursoId: this.idDocCursoId,
        };
        this.rutas = 'reporte_mensual';
        break;
      case 4:
        data = {
          id: this.iDateRango,
          opcion: 'reporte_personalizado',
          cSeccionNombre: this.cSeccionNombre,
          cGradoAbreviacion: this.cGradoAbreviacion,
          cNivelTipoNombre: this.cNivelTipoNombre,
          cNivelNombreCursos: this.cNivelNombreCursos,
          nombrecompleto: this.nombrecompleto,
          cCicloRomanos: this.cCicloRomanos,
          iCursoId: this.iCursoId,
          iDocenteId: this.iDocenteId,
          iSeccionId: this.iSeccionId,
          iGradoId: this.iGradoId,
          iNivelGradoId: this.iNivelGradoId,
          iYAcadId: this.iYAcadId,
          iIieeId: this.iIieeId,
          iSedeId: this.iSedeId,
          idDocCursoId: this.idDocCursoId,
        };
        this.rutas = 'reporte_personalizado';
        break;
    }

    this.getReportePdf(data);
  }

  meses = [
    { nombre: 'Enero', iMesId: 1 },
    { nombre: 'Febrero', iMesId: 2 },
    { nombre: 'Marzo', iMesId: 3 },
    { nombre: 'Abril', iMesId: 4 },
    { nombre: 'Mayo', iMesId: 5 },
    { nombre: 'Junio', iMesId: 6 },
    { nombre: 'Julio', iMesId: 7 },
    { nombre: 'Agosto', iMesId: 8 },
    { nombre: 'Setiembre', iMesId: 9 },
    { nombre: 'Octubre', iMesId: 10 },
    { nombre: 'Noviembre', iMesId: 11 },
    { nombre: 'Diciembre', iMesId: 12 },
  ];

  inputDia: Date = new Date();
  value1: number = 1;
  tipoReporte: number;
  solicitarFecha: number;
  iMesId: number;
  iDateRango;
  rutas = '';
  getReportePdf(data) {
    if (this.rutas == 'reporte_diario') {
      this.fechas =
        data['id'].getFullYear() + '-' + (data['id'].getMonth() + 1) + '-' + data['id'].getDate();
    }
    if (this.rutas == 'reporte_personalizado') {
      const inicio =
        data['id'][0].getFullYear() +
        '-' +
        (data['id'][0].getMonth() + 1) +
        '-' +
        data['id'][0].getDate();
      const fin =
        data['id'][1].getFullYear() +
        '-' +
        (data['id'][1].getMonth() + 1) +
        '-' +
        data['id'][1].getDate();
      this.fechas = inicio + '_' + fin;
    }
    if (this.rutas == 'reporte_mensual') {
      this.fechas = data['id'];
      const fecha = new Date(this.year + '-' + this.fechas); // Por ejemplo: 2025-04-11
      const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' });
      this.fechas = nombreMes;
    }

    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'reporte_asistencia',
      ruta: this.rutas,
      data: data,
      params: { skipSuccessMessage: true },
    };
    this.GeneralService.generarPdf(params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          'asistencia_' +
          this.cCursoNombre.toLocaleLowerCase() +
          '_' +
          this.cGradoAbreviacion.toLocaleLowerCase() +
          this.cSeccionNombre.toLocaleLowerCase() +
          '_' +
          this.fechas +
          '.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }
}
