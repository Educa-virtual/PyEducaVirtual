import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { RegistrarLogroAlcanzadoComponent } from './../registrar-logro-alcanzado/registrar-logro-alcanzado.component';
import { BoletaLogroComponent } from './../boleta-logro/boleta-logro.component';
import { MenuItem, MessageService } from 'primeng/api';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogroAlcanzadoService } from '../../services/logro-alcanzado.service';

@Component({
  selector: 'app-estudiantes-logro-alcanzado',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    RegistrarLogroAlcanzadoComponent,
    BoletaLogroComponent,
  ],
  templateUrl: './estudiantes-logro-alcanzado.component.html',
  styleUrl: './estudiantes-logro-alcanzado.component.scss',
})
export class EstudiantesLogroAlcanzadoComponent implements OnInit {
  dialogRegistrarLogroAlcanzado: boolean = false;
  registroTitleModal: string;
  registroSubTitleModal: string;

  dialogBoletaLogroAlcanzado: boolean = false;
  boletaTitleModal: string;

  // Estudiante seleccionado
  selectedItem: any;
  estudiante: any;
  iDetMatrId: number;

  // Area curricular seleccionada
  idDocCursoId: number;
  ie_curso: {
    iIeCursoId: string;
    cCursoNombre: string;
    cGradoAbreviacion: string;
    cSeccionNombre: string;
  };

  // Periodo seleccionado
  iPeriodoId: string = '1';

  // Listados de datos
  areas: any[] = [];
  estudiantes: any[] = [];
  periodos: any[] = [];
  competencias: any[] = [];
  escalas: any[] = [];

  perfil: any;
  usuario: any;
  iYAcadId: number;
  iCredId: number;

  REPORTE_BOLETAS = this.logroService.REPORTE_BOLETAS;
  REPORTE_EXCEL = this.logroService.REPORTE_EXCEL;
  REPORTE_FORMATO_SIAGIE = this.logroService.REPORTE_FORMATO_SIAGIE;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private logroService: LogroAlcanzadoService,
    private messageService: MessageService,
    private router: Router,
    private store: LocalStoreService,
    private route: ActivatedRoute
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.route.params.subscribe(params => {
      this.idDocCursoId = params['idDocCursoId'];
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    if (this.idDocCursoId) {
      this.obtenerDatosCursoDocente();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se pudo obtener los datos del curso, redirigiendo al listado de cursos...',
      });
      setTimeout(() => {
        this.router.navigate(['/evaluaciones/logro-alcanzado']);
      }, 3000);
    }
  }

  obtenerDatosCursoDocente() {
    this.logroService
      .obtenerDatosCursoDocente({
        idDocCursoId: this.idDocCursoId,
      })
      .subscribe({
        next: (data: any) => {
          const ie_curso = data.data?.ie_curso;
          const estudiantes = data.data?.estudiantes;
          this.ie_curso = ie_curso ? JSON.parse(ie_curso.replace(/^"(.*)"$/, '$1'))[0] : [];
          this.estudiantes = estudiantes ? JSON.parse(estudiantes.replace(/^"(.*)"$/, '$1')) : [];
          this.periodos = this.logroService.getPeriodosEvaluacion(data.data?.periodos_evaluacion);
          this.escalas = this.logroService.getEscalaCalificacion(data.data?.escalas_calificacion);
          this.setBreadCrumbs();
        },
        error: (error: any) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'No se pudo obtener los datos del curso, redirigiendo al listado de cursos...',
          });
          setTimeout(() => {
            this.router.navigate(['/evaluaciones/logro-alcanzado']);
          }, 3000);
        },
      });
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Reportar Logros Alcanzados',
        routerLink: `/evaluaciones/registro-logro`,
      },
      {
        label: this.ie_curso
          ? this.ie_curso.cCursoNombre +
            ' ' +
            this.ie_curso.cGradoAbreviacion +
            ' ' +
            this.ie_curso.cSeccionNombre
          : 'Área´y Sección',
      },
      {
        label: 'Estudiantes',
      },
    ];
  }

  registrarLogroAlcanzado(estudiante: any) {
    this.iDetMatrId = null;
    const nombreEstudiante = estudiante?.cPersApeNombres || 'ESTUDIANTE';
    const gradoEstudiante = this.ie_curso.cGradoAbreviacion || 'GRADO';
    const seccionEstudiante = this.ie_curso.cSeccionNombre || 'SECCIÓN';
    this.registroTitleModal = `REGISTRO : ${nombreEstudiante}`;
    this.registroSubTitleModal = `GRADO: ${gradoEstudiante} - SECCIÓN: ${seccionEstudiante}`;
    setTimeout(() => {
      this.iDetMatrId = estudiante?.iDetMatrId;
      this.dialogRegistrarLogroAlcanzado = true;
    }, 100);
  }

  listenDialogRegistrarLogro(event: boolean) {
    if (event == false) {
      this.dialogRegistrarLogroAlcanzado = false;
    }
  }

  boletaLogroImprimir() {
    this.boletaTitleModal = 'BOLETA DE LOGROS DE';
    this.dialogBoletaLogroAlcanzado = true;
  }

  listenDialogBoleta(event: boolean) {
    if (event == false) {
      this.dialogBoletaLogroAlcanzado = false;
    }
  }

  obtenerPeriodos() {
    this.logroService
      .obtenerPeriodosEvaluacionSede({
        iYAcadId: this.iYAcadId,
        iSedeId: this.perfil.iSedeId,
      })
      .subscribe({
        next: (response: any) => {
          this.periodos = response.data;
        },
        error: error => {
          console.error('Error obteniendo periodos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail:
              'No se pudo obtener la información de periodos. Redirigiendo al listado de áreas...',
          });
          setTimeout(() => {
            this.router.navigate(['/evaluaciones/registro-logro']);
          }, 2000);
        },
      });
  }

  listarAreas() {
    this.router.navigate(['/evaluaciones/registro-logro']);
  }

  exportar(tipo: number) {
    switch (tipo) {
      case this.REPORTE_BOLETAS:
        this.exportarBoletas();
        break;
      case this.REPORTE_EXCEL:
        this.exportarExcel();
        break;
      case this.REPORTE_FORMATO_SIAGIE:
        this.exportarFormatoSiagie();
        break;
    }
  }

  exportarBoletas() {
    this.logroService
      .exportarBoletas({
        idDocCursoId: this.idDocCursoId,
      })
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();
        },
        error: error => {
          console.error('Error al exportar boletas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo exportar las boletas.',
          });
        },
      });
  }

  exportarExcel() {
    this.logroService
      .exportarExcel({
        idDocCursoId: this.idDocCursoId,
      })
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const nombre = `${this.ie_curso.cCursoNombre}-${this.ie_curso.cGradoAbreviacion}-${this.ie_curso.cSeccionNombre}`;
          link.download = `registro-notas-${nombre}.xlsx`;
          link.target = '_blank';
          link.click();
        },
        error: error => {
          console.error('Error al exportar Excel:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo exportar el archivo Excel.',
          });
        },
      });
  }

  exportarFormatoSiagie() {
    this.logroService
      .exportarFormatoSiagie({
        idDocCursoId: this.idDocCursoId,
        iPeriodoId: this.iPeriodoId,
      })
      .subscribe({
        next: (response: any) => {
          const blob = new Blob([response], {
            type: 'application/vnd.ms-excel',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          console.error('Error al exportar formato SIAGIE:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Ocurrió un error',
            detail: error.message ?? 'No se pudo exportar el formato SIAGIE.',
          });
        },
      });
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'Resistrar':
        this.registrarLogroAlcanzado(item);
        break;
      case 'Imprimir':
        this.selectedItem = item;
        this.boletaLogroImprimir();
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Resistrar logro',
      icon: 'pi pi-file-edit',
      accion: 'Resistrar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
    {
      labelTooltip: 'Imprimir Informe de Progreso',
      icon: 'pi pi-print',
      accion: 'Imprimir',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
    },
  ];

  columnsEstudiantes = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cPersDocumentoTipo',
      header: 'Documento',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '60%',
      field: 'cPersApeNombres',
      header: 'Apellidos y Nombres',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  btn_exportar: Array<MenuItem> = [
    {
      label: 'Boletas (Todos los periodos)',
      icon: 'pi pi-fw pi-file-pdf',
      command: () => {
        this.exportar(this.REPORTE_BOLETAS);
      },
    },
    {
      label: 'Resumen en Excel (Todos los periodos)',
      icon: 'pi pi-fw pi-file-excel',
      command: () => {
        this.exportar(this.REPORTE_EXCEL);
      },
    },
    {
      label: 'Formato SIAGIE en Excel (Periodo seleccionado)',
      icon: 'pi pi-fw pi-file-export',
      command: () => {
        this.exportar(this.REPORTE_FORMATO_SIAGIE);
      },
    },
  ];
}
