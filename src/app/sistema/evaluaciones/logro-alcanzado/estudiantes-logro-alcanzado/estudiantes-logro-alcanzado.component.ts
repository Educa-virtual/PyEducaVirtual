import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { RegistrarLogroAlcanzadoComponent } from './../registrar-logro-alcanzado/registrar-logro-alcanzado.component';
import { BoletaLogroComponent } from './../boleta-logro/boleta-logro.component';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
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
  idDocCursoId: string;
  area: any;
  cCursoNombre: string = '';
  cGradoAbreviacion: string = '';
  cSeccionNombre: string = '';

  // Periodo seleccionado
  iPeriodoId: string;

  // Listados de datos
  areas: any[] = [];
  estudiantes: any[] = [];
  periodos: any[] = [];
  competencias: any[] = [];

  perfil: any;
  usuario: any;
  iYAcadId: number;
  iCredId: number;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private logroAlcanzadoService: LogroAlcanzadoService,
    private messageService: MessageService,
    private periodosService: CalendarioPeriodosEvalacionesService,
    private router: Router,
    private store: LocalStoreService,
    private route: ActivatedRoute
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.route.params.subscribe(params => {
      this.idDocCursoId = params['idDocCursoId'];
    });
  }

  ngOnInit() {
    this.setBreadCrumbs();
    this.obtenerPeriodos();
    if (this.idDocCursoId) {
      this.obtenerDatosCursoDocente();
    }
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      { label: 'Evaluaciones' },
      { label: 'Logros' },
      {
        label: 'Listar areas',
        routerLink: `/evaluaciones/registro-logro`,
      },
    ];
  }

  obtenerDatosCursoDocente() {
    this.logroAlcanzadoService
      .obtenerDatosCursoDocente({
        idDocCursoId: this.idDocCursoId,
      })
      .subscribe({
        next: (data: any) => {
          this.cCursoNombre = data.data.cCursoNombre;
          this.cGradoAbreviacion = data.data.cGradoAbreviacion;
          this.cSeccionNombre = data.data.cSeccionNombre;
          this.competencias = data.data.json_competencias
            ? JSON.parse(data.data.json_competencias)
            : [];
          this.estudiantes = data.data.json_estudiantes
            ? JSON.parse(data.data.json_estudiantes)
            : [];
        },
        error: error => {
          console.error('Error obteniendo cursos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'No se pudo obtener la información de cursos.',
          });
        },
      });
  }

  registrarLogroAlcanzado(estudiante: any) {
    this.iDetMatrId = null;
    const nombreEstudiante = estudiante?.cPersApeNombres || 'ESTUDIANTE';
    const gradoEstudiante = this.cGradoAbreviacion || 'GRADO';
    const seccionEstudiante = this.cSeccionNombre || 'SECCIÓN';
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
    const params = { iCredId: this.perfil.iCredId };
    this.periodosService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(this.iYAcadId, this.perfil.iSedeId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.periodos = resp.data;
            if (this.periodos.length > 0) {
              this.iPeriodoId = '1';
            }
          }
        },
        complete: () => {
          this.periodos.push({
            cNombrePeriodo: 'Logro final',
            cPeriodoEvalNombre: '',
            iEstado: '0',
            iNumeroPeriodo: Number(this.periodos?.length) + 1,
            iPeriodoEvalAperId: '',
          });
        },
        error: error => {
          console.error('Error obteniendo periodos:', error);
        },
      });
  }

  listarAreas() {
    this.router.navigate(['/evaluaciones/registro-logro']);
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
}
