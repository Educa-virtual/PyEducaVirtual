import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { DIRECTOR_IE, SUBDIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { SeccionComponent } from './seccion/seccion.component';
import { PreguntaComponent } from './pregunta/pregunta.component';
import { EncuestasService } from '../services/encuestas.services';
import { SlicePipe } from '@angular/common';
import { TutorialPreguntasComponent } from '../tutoriales/tutorial-preguntas/tutorial-preguntas.component';

@Component({
  selector: 'app-llenado-preguntas-encuesta',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    SeccionComponent,
    PreguntaComponent,
    TutorialPreguntasComponent,
  ],
  templateUrl: './llenado-preguntas-encuesta.component.html',
  styleUrl: './llenado-preguntas-encuesta.component.scss',
  providers: [SlicePipe],
})
export class LlenadoPreguntasEncuestaComponent implements OnInit {
  breadCrumbItems: MenuItem[] = [];
  breadCrumbHome: MenuItem;

  perfil: any;
  iYAcadId: number;
  es_director: boolean = false;
  encuesta: any;
  iEncuId: number;
  iCateId: number;
  iSeccionId: number;
  iPregId: number;
  encuesta_bloqueada: boolean = true;

  selectedItem: any;
  totalPreguntas: number = 0;
  mostrarDialogoSeccion: boolean = false;
  mostrarDialogoPregunta: boolean = false;
  visibleDialogTutorial: boolean = false;

  secciones: any[] = [];
  pregunta: any;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;

  constructor(
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService,
    private route: ActivatedRoute,
    private router: Router,
    private store: LocalStoreService,
    private encuestasService: EncuestasService,
    private slicePipe: SlicePipe
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_director = [DIRECTOR_IE, SUBDIRECTOR_IE].includes(this.perfil?.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iEncuId = params.params.iEncuId || null;
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    this.calcularTotalPreguntas();
    if (this.iEncuId) {
      this.verEncuesta();
    }
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorias', routerLink: `/encuestas/categorias` },
      {
        label: this.encuesta?.cCateNombre
          ? String(this.slicePipe.transform(this.encuesta?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Gestionar encuestas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-encuestas`,
      },
      {
        label: this.encuesta?.cEncuNombre
          ? String(this.slicePipe.transform(this.encuesta?.cEncuNombre, 0, 20))
          : 'Encuesta',
      },
      { label: 'Preguntas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  verEncuesta() {
    this.encuestasService
      .verEncuesta({
        iEncuId: this.iEncuId,
        iTipoUsuario: 2,
      })
      .subscribe({
        next: (data: any) => {
          this.encuesta = data.data;
          this.setBreadCrumbs();
          this.listarSecciones();
          this.encuesta_bloqueada =
            Number(this.encuesta?.iEstado) === this.ESTADO_APROBADA ||
            Number(this.encuesta?.puede_editar) === 0;
        },
        error: error => {
          console.error('Error obteniendo encuesta:', error);
        },
      });
  }

  listarSecciones() {
    this.encuestasService
      .listarSecciones({
        iEncuId: this.iEncuId,
      })
      .subscribe({
        next: (data: any) => {
          this.secciones = data.data;
          this.secciones.forEach((seccion: any) => {
            seccion.preguntas = seccion?.json_preguntas ? JSON.parse(seccion.json_preguntas) : [];
          });
          this.encuestasService.getSeccionesEncuesta(this.secciones);
          this.calcularTotalPreguntas();
        },
        error: error => {
          console.error('Error obteniendo lista de preguntas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  salir() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-encuestas`]);
  }

  calcularTotalPreguntas() {
    this.totalPreguntas = this.secciones.reduce(
      (total, seccion) => total + seccion.preguntas.length,
      0
    );
  }

  editarSeccion(iSeccionId: any) {
    this.iSeccionId = null;
    this.mostrarDialogoSeccion = false;
    setTimeout(() => {
      this.iSeccionId = iSeccionId;
      this.abrirDialogoSeccion();
    }, 0);
  }

  eliminarSeccion(seccion: any) {
    if (seccion.preguntas.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No puede eliminar una sección con preguntas asociadas',
      });
      return;
    }
    this.confirmationModalService.openConfirm({
      header: `¿Está seguro de eliminar la sección seleccionada #${seccion?.iSeccionOrden}?`,
      accept: () => {
        this.encuestasService
          .borrarSeccion({
            iSeccionId: seccion?.iSeccionId,
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sección eliminada',
                detail: 'La sección ha sido eliminada correctamente',
              });
              this.listarSecciones();
            },
            error: error => {
              console.error('Error eliminando la sección:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message,
              });
            },
          });
      },
    });
  }

  eliminarPregunta(iPregId: any) {
    this.confirmationModalService.openConfirm({
      header: `¿Está seguro de eliminar la pregunta seleccionada?`,
      accept: () => {
        this.encuestasService
          .borrarPregunta({
            iPregId: iPregId,
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Pregunta eliminada',
                detail: 'La pregunta ha sido eliminada correctamente',
              });
              this.listarSecciones();
            },
            error: error => {
              console.error('Error eliminando la pregunta:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message,
              });
            },
          });
      },
    });
  }

  agregarPregunta(seccion: any) {
    this.iSeccionId = seccion.iSeccionId;
    this.iPregId = null;
    this.abrirDialogoPregunta();
  }

  editarPregunta(iPregId: any) {
    this.iPregId = null;
    this.mostrarDialogoPregunta = false;
    setTimeout(() => {
      this.iPregId = iPregId;
      this.abrirDialogoPregunta();
    }, 0);
  }

  abrirDialogoPregunta() {
    this.mostrarDialogoPregunta = true;
  }

  cerrarDialogoPregunta() {
    this.mostrarDialogoPregunta = false;
  }

  guardarPregunta(pregunta: any) {
    if (!pregunta.cPregunta || pregunta.cPregunta.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La pregunta no puede estar vacía',
      });
      return;
    }
    if (
      pregunta.alternativas.some(
        (alt: any) => !alt.cAlternativaDescripcion || alt.cAlternativaDescripcion.trim() === ''
      )
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todas las alternativas deben tener descripción',
      });
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Pregunta guardada',
      detail: 'La pregunta ha sido guardada correctamente',
    });

    pregunta.expandida = false;
  }

  abrirDialogoSeccion() {
    this.mostrarDialogoSeccion = true;
  }

  cerrarDialogoSeccion() {
    this.mostrarDialogoSeccion = false;
  }

  vistaPrevia() {
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${this.iEncuId}/ver`,
    ]);
  }

  verTutorial(visible: boolean) {
    this.visibleDialogTutorial = visible;
  }
}
