import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';

import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { MenuItem, MessageService } from 'primeng/api';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { TabsPrimengComponent } from '@/app/shared/tabs-primeng/tabs-primeng.component';
import { TabDescripcionActividadesComponent } from '../../components/tab-descripcion-actividades/tab-descripcion-actividades.component';
import { EvaluacionesService } from '@/app/servicios/eval/evaluaciones.service';
import { EvaluacionPreguntasComponent } from '../evaluacion-preguntas/evaluacion-preguntas.component';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionRoomCalificacionComponent } from './evaluacion-room-calificacion/evaluacion-room-calificacion.component';
import { EvaluacionEstudiantesComponent } from '../evaluacion-estudiantes/evaluacion-estudiantes.component';
import { RubricaEvaluacionComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-evaluacion/rubrica-evaluacion.component';
import { RubricasComponent } from '@/app/sistema/aula-virtual/features/rubricas/rubricas.component';
import { RubricaCalificarComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-calificar/rubrica-calificar.component';
import { Location } from '@angular/common';
import { INSTRUCTOR, PARTICIPANTE } from '@/app/servicios/seg/perfiles';

@Component({
  selector: 'app-evaluacion-room',
  standalone: true,
  imports: [
    PrimengModule,
    TabsPrimengComponent,
    TabDescripcionActividadesComponent,
    EvaluacionPreguntasComponent,
    EvaluacionRoomCalificacionComponent,
    EvaluacionEstudiantesComponent,
    RubricaEvaluacionComponent,
    RubricasComponent,
    RubricaCalificarComponent,
  ],
  templateUrl: './evaluacion-room.component.html',
  styleUrl: './evaluacion-room.component.scss',
  providers: [ApiEvaluacionesService],
})
export class EvaluacionRoomComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem | undefined;

  @Input() ixActivadadId: string; //iEvaluacionId
  @Input() iProgActId: string;
  @Input() iActTopId: tipoActividadesKeys;

  private _ConstantesService = inject(ConstantesService);
  private _evaluacionService = inject(ApiEvaluacionesService);
  private _EvaluacionesService = inject(EvaluacionesService);
  private _MessageService = inject(MessageService);
  private _ActivatedRoute = inject(ActivatedRoute);

  rubricas = [
    // {
    //     iInstrumentoId: 0,
    //     cInstrumentoNombre: 'Sin instrumento de evaluación',
    // },
  ];

  isDocente: boolean =
    this._ConstantesService.iPerfilId === DOCENTE ||
    this._ConstantesService.iPerfilId === INSTRUCTOR;

  isEstudiante: boolean =
    this._ConstantesService.iPerfilId === ESTUDIANTE ||
    this._ConstantesService.iPerfilId === PARTICIPANTE;

  tabs = [
    {
      title: 'Descripción',
      icon: 'pi pi-list',
      tab: 'descripcion',
      //tab:0
    },
    {
      title: 'Preguntas',
      icon: 'pi-pen-to-square',
      tab: 'preguntas',
      isVisible: !this.isDocente,
      //tab:1
    },
    {
      title: 'Calificar',
      icon: 'pi-list-check',
      tab: 'calificar',
      isVisible: !this.isDocente,
      //tab:2
    },
    {
      title: 'Rendir Evaluación',
      icon: 'pi-check-circle',
      tab: 'rendir-examen',
      isVisible: !this.isEstudiante,
      //tab:3
    },
  ];

  activeIndex: number = 0;
  tabSeleccionado: string = 'descripcion';
  obtenerIndex(event) {
    this.tabSeleccionado = event.tab;
  }

  obtenerRubricas() {
    const params = {
      iDocenteId: this._ConstantesService.iDocenteId,
    };
    this._evaluacionService.obtenerRubricas(params).subscribe({
      next: data => {
        this.rubricas = data;
        // data.forEach((element) => {
        //     this.rubricas.push(element)
        // })
      },
    });
  }

  accionRubrica(elemento): void {
    if (!elemento) return;
    this.obtenerRubricas();
  }

  dialogRubricaInfo = {
    visible: false,
    header: undefined,
  };

  showRubrica(data) {
    this.dialogRubricaInfo.visible = true;
    this.dialogRubricaInfo.header = data;
  }

  public iPerfilId = this._ConstantesService.iPerfilId;
  public evaluacion;
  public cEvaluacionInstrucciones;

  iNivelCicloId: string | number;
  iCursoId: string | number;

  params = {
    iCursoId: null,
    iDocenteId: null,
    idDocCursoId: null,
    iEvaluacionId: null,
  };
  constructor(private location: Location) {}

  comentarioDocente: string;

  ngOnInit() {
    this.items = [
      {
        label: 'Mis Áreas Curriculares',
        routerLink: '/aula-virtual/areas-curriculares',
      },
      {
        label: 'Contenido',
        command: () => this.goBack(),
        routerLink: '/',
      },
      { label: 'Evaluaciones' },
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.iNivelCicloId = this._ActivatedRoute.snapshot.queryParamMap.get('iNivelCicloId');
    this.iCursoId = this._ActivatedRoute.snapshot.queryParamMap.get('iCursoId');
    this.obtenerEvaluacion(this.ixActivadadId);
    this.params.iCursoId = this.iCursoId;
    this.params.iDocenteId = this._ConstantesService.iDocenteId;
    this.params.iEvaluacionId = this.ixActivadadId;
    this.params.idDocCursoId = this._ActivatedRoute.snapshot.queryParamMap.get('idDocCursoId');

    //this.obtenerRubricas()
  }
  goBack() {
    this.location.back();
  }
  // obtiene la evalución
  obtenerEvaluacion(iEvaluacionId: string | number) {
    const params = {
      iCredId: this._ConstantesService.iCredId,
      iEstudiante: this.iPerfilId === ESTUDIANTE ? this._ConstantesService.iEstudianteId : null,
    };
    this._EvaluacionesService.obtenerEvaluacionesxiEvaluacionId(iEvaluacionId, params).subscribe({
      next: resp => {
        if (resp.validated) {
          let data = resp.data;
          data = data.length ? data[0] : [];
          data.cEvaluacionArchivoAdjunto = data.cEvaluacionArchivoAdjunto
            ? JSON.parse(data.cEvaluacionArchivoAdjunto)
            : [];
          this.evaluacion = {
            cTitle: 'Evaluación Formativa: ' + (data.cEvaluacionTitulo || '-'),
            cHeader: data.cEvaluacionTitulo || '-',
            dInicio: data.dtEvaluacionInicio,
            dFin: data.dtEvaluacionFin,
            iEstado: Number(data.iEstado || 0),
            cDescripcion: data.cEvaluacionDescripcion,
            cDocumentos: data.cEvaluacionArchivoAdjunto,
            iEvaluacionId: this.ixActivadadId,
            iNivelCicloId: this.iNivelCicloId,
            iCursoId: this.iCursoId,
          };

          this.comentarioDocente = data.cConclusionDescriptiva || null;
          if (this.comentarioDocente) {
            this.tabs = [
              {
                title: 'Descripción',
                icon: 'pi pi-list',
                tab: 'descripcion',
                //tab:0
              },
              {
                title: 'Preguntas',
                icon: 'pi-pen-to-square',
                tab: 'preguntas',
                isVisible: !(this._ConstantesService.iPerfilId === DOCENTE),
                //tab:1
              },
              {
                title: 'Calificar',
                icon: 'pi-list-check',
                tab: 'calificar',
                isVisible: !(this._ConstantesService.iPerfilId === DOCENTE),
                //tab:2
              },
              // {
              //     title: 'Rendir Evaluación',
              //     icon: 'pi-check-circle',
              //     tab: 'rendir-examen',
              //     isVisible: !(this._ConstantesService.iPerfilId === ESTUDIANTE),
              //     //tab:3
              // },
            ];
          }
        }
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.mostrarMensajeToast({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
