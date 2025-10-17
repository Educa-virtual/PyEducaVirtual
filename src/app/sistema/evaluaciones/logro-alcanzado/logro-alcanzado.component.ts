import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { RegistrarLogroAlcanzadoComponent } from './registrar-logro-alcanzado/registrar-logro-alcanzado.component';
import { BoletaLogroComponent } from './boleta-logro/boleta-logro.component';
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { MenuItem, MessageService } from 'primeng/api';
import { CursoCardComponent } from '../../aula-virtual/sub-modulos/cursos/components/curso-card/curso-card.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ConstantesService } from '@/app/servicios/constantes.service';

@Component({
  selector: 'app-logro-alcanzado',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    RegistrarLogroAlcanzadoComponent,
    BoletaLogroComponent,
    CursoCardComponent,
  ],
  templateUrl: './logro-alcanzado.component.html',
  styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
  dialogRegistrarLogroAlcanzado: boolean = false;
  registroTitleModal: string;
  registroSubTitleModal: string;

  dialogBoletaLogroAlcanzado: boolean = false;
  boletaTitleModal: string;

  // Estudiante seleccionado
  selectedItem: any;
  estudiante: any;

  // Area curricular seleccionada
  area: any;
  cCursoNombre: string = '';
  cGradoAbreviacion: string = '';
  cSeccionNombre: string = '';
  area_seleccionada: boolean = false;

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
    private evaluacionesService: ApiEvaluacionesService,
    private messageService: MessageService,
    private periodosService: CalendarioPeriodosEvalacionesService,
    private constantes: ConstantesService,
    private store: LocalStoreService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
    this.usuario = this.store.getItem('dremoUser');
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.iCredId = this.perfil.iCredId;
  }

  ngOnInit() {
    this.setBreadCrumbs();
    this.listarCursos();
    this.obtenerPeriodos();
  }

  setBreadCrumbs() {
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [{ label: 'Evaluaciones' }, { label: 'Logros' }];
  }

  listarCursos(mostrarTotalAlumnos: number = 2) {
    this.evaluacionesService
      .listarCursos({
        opcion: mostrarTotalAlumnos,
        iDocenteId: this.constantes.iDocenteId, // Id de docente encriptado
        iYAcadId: this.iYAcadId,
        iSedeId: this.perfil.iSedeId,
        iIieeId: this.perfil.iIieeId,
      })
      .subscribe({
        next: (data: any) => {
          this.areas = data.data;
        },
        error: error => {
          console.error('Error obteniendo cursos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: error.error.message ?? 'No se pudo obtener la información de cursos.',
          });
        },
      });
  }

  registroLogroAlcanzado() {
    let areas: any[] = [];

    try {
      // Parsear el string a un array real
      areas = JSON.parse(this.estudiante?.json_cursos || '[]');
    } catch (e) {
      console.error('Error parseando json_cursos:', e);
      return;
    }

    // Filtrar por el curso seleccionado
    const curso = areas.filter((item: any) => item.cCursoNombre === this.area.cCursoNombre);

    this.selectedItem = curso;

    const nombreEstudiante = this.estudiante?.Estudiante || 'Estudiante';
    const gradoEstudiante = this.estudiante?.cGradoAbreviacion || 'cGradoAbreviacion';
    const secciconEstudiante = this.estudiante?.cSeccionNombre || 'cSeccionNombre';
    this.registroTitleModal = `REGISTRO : ${nombreEstudiante}`;
    this.registroSubTitleModal = `GRADO: ${gradoEstudiante} - SECCIÓN: ${secciconEstudiante}`;
    //Generar competencias
    this.cargarCompetencias(curso);
  }

  listenDialogRegistrarLogro(event: boolean) {
    if (event == false) {
      this.dialogRegistrarLogroAlcanzado = false;
    }
  }

  cargarCompetencias(curso: any) {
    const params = {
      iCursoId: Number(this.area?.iCursoId), // Evitar error si no encuentra
      iNivelTipoId: Number(this.perfil?.iNivelTipoId), // Evitar error si no encuentra
      iDetMatrId: Number(curso[0].iDetMatrId),
    };

    this.evaluacionesService.competenciasXCursoIdXCurricula(params).subscribe({
      next: respuesta => {
        this.competencias = respuesta; // Guardamos los datos en nuestra variable local.
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'No se pudo generar competencias asignadas al estudiante' + err.message,
        });
      },
      complete: () => {
        this.dialogRegistrarLogroAlcanzado = true;
      },
    });
  }

  boletaLogroImprimir() {
    this.boletaTitleModal = 'Boleta de Logros de';
    this.dialogBoletaLogroAlcanzado = true;
  }
  listenDialogBoleta(event: boolean) {
    if (event == false) {
      this.dialogBoletaLogroAlcanzado = false;
    }
  }

  seleccionarArea() {
    this.area_seleccionada = false;
  }

  obtenerPeriodos() {
    const params = { iCredId: this.iCredId };
    //this.cargandoPeriodos = true;
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

  filtrarCurso($event) {
    this.generarListaEstudiante($event);
    this.area = $event;
  }

  generarListaEstudiante(area: any) {
    this.estudiantes = [];
    // 2. Aquí, el método del componente (`generarListaEstudiante`)
    //    llama al método del servicio (`generarListaEstudiantesSedeSeccionGrado`).
    const params = {
      iSedeId: this.perfil.iSedeId,
      iSeccionId: area.iSeccionId,
      iYAcadId: this.iYAcadId,
      iNivelGradoId: area.iGradoId,
    };

    this.evaluacionesService.generarListaEstudiantesSedeSeccionGrado(params).subscribe({
      // 3. Esto se ejecuta cuando el servicio devuelve una respuesta exitosa.
      next: respuesta => {
        this.estudiantes = respuesta; // Guardamos los datos en nuestra variable local.
      },

      // 4. Esto se ejecuta si hubo un error en la llamada.
      error: err => {
        // console.error('El servicio falló al generar la lista:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje del sistema',
          detail: 'No se pudo generar la lista de estudiantes' + err.message,
        });
      },
      complete: () => {
        this.area_seleccionada = true;
        this.cCursoNombre = area.cCursoNombre || '';
        this.cGradoAbreviacion = this.area?.cGradoAbreviacion || '';
        this.cSeccionNombre = this.area?.cSeccionNombre || '';
        this.estudiantes = this.estudiantes.map(estudiante => ({
          ...estudiante, // Mantener todas las propiedades originales
          cGradoAbreviacion: this.area?.cGradoAbreviacion || '', // Evitar error si no encuentra
          cSeccionNombre: this.area?.cSeccionNombre || '', // Evitar error si no encuentra
          cCursoNombre: this.area?.cCursoNombre || '', // Evitar error si no encuentra
          iCursoId: this.area?.iCursoId || '', // Evitar error si no encuentra
          iNivelTipoId: this.perfil?.iNivelTipoId || '', // Evitar error si no encuentra
        }));

        // this._messageService.add({
        //   severity: 'success',
        //   summary: 'Mensaje del sistema',
        //   detail: 'Se selecciono con exito el área curricular',
        // });
      },
    });
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'Resistrar':
        this.estudiante = item;
        this.registroLogroAlcanzado();
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
      field: 'cPersDocumento',
      header: 'DNI/CE',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '60%',
      field: 'Estudiante',
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
