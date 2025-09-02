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

@Component({
  selector: 'app-llenado-preguntas-encuesta',
  standalone: true,
  imports: [PrimengModule, FormsModule, SeccionComponent, PreguntaComponent],
  templateUrl: './llenado-preguntas-encuesta.component.html',
  styleUrl: './../lista-categorias/lista-categorias.component.scss',
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

  selectedItem: any;
  totalPreguntas: number = 0;
  nIndexAcordionTab: number = null;
  mostrarDialogoSeccion: boolean = false;
  mostrarDialogoPregunta: boolean = false;

  isDisabled: boolean = false;

  secciones: any[] = [];

  pregunta: any;

  constructor(
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService,
    private route: ActivatedRoute,
    private router: Router,
    private store: LocalStoreService,
    private encuestasService: EncuestasService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.es_director = [DIRECTOR_IE, SUBDIRECTOR_IE].includes(this.perfil?.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iEncuId = params.params.iEncuId || null;
    });
    this.breadCrumbItems = [
      {
        label: 'Encuestas',
      },
      {
        label: 'Categorias',
        routerLink: `/encuestas/categorias`,
      },
      {
        label: 'Encuestas',
        routerLink: `/encuestas/categorias/${this.iCateId}/encuestas`,
      },
      {
        label: 'Nueva encuesta',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit() {
    this.calcularTotalPreguntas();

    if (this.iEncuId) {
      this.verEncuesta();
    }
  }

  verEncuesta() {
    this.encuestasService
      .verEncuesta({
        iEncuId: this.iEncuId,
        iTipoUsuario: 1,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización exitosa',
            detail: 'Se actualizó la encuesta',
          });
          this.listarSecciones();
        },
        error: error => {
          console.error('Error actualizando encuesta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
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
            seccion.preguntas = seccion?.preguntas ? JSON.parse(seccion.preguntas) : [];
          });
          console.log(this.secciones, 'secciones');
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
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/encuestas/${this.iEncuId}`]);
  }

  calcularTotalPreguntas() {
    this.totalPreguntas = this.secciones.reduce(
      (total, seccion) => total + seccion.preguntas.length,
      0
    );
  }

  editarSeccion(seccion: any) {
    this.iSeccionId = seccion.iSeccionId;
    this.abrirDialogoSeccion();
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
      header: `¿Está seguro de eliminar la sección seleccionada #${seccion.iSeccionOrden}?`,
      accept: () => {
        this.encuestasService
          .borrarSeccion({
            iSeccionId: seccion.iSeccionId,
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sección eliminada',
                detail: 'La sección ha sido eliminada correctamente',
              });
              this.secciones = this.secciones.filter(
                (seccion: any) => seccion.iSeccionId !== seccion.iSeccionId
              );
              this.calcularTotalPreguntas();
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

  editarPregunta(pregunta: any) {
    console.log(pregunta);
  }

  eliminarPregunta(pregunta: any) {
    this.confirmationModalService.openConfirm({
      header: `¿Está seguro de eliminar la pregunta seleccionada?`,
      accept: () => {
        const seccion = null;
        if (seccion) {
          const index = seccion.preguntas.findIndex(p => p.id === pregunta.id);
          if (index !== -1) {
            seccion.preguntas.splice(index, 1);
            this.calcularTotalPreguntas();
            this.messageService.add({
              severity: 'success',
              summary: 'Pregunta eliminada',
              detail: 'La pregunta ha sido eliminada correctamente',
            });
          }
        }
      },
    });
  }

  agregarPregunta(seccion: any) {
    console.log(seccion, 'seccion');
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

  vistaPrevia() {
    this.messageService.add({
      severity: 'info',
      summary: 'Vista previa',
      detail: 'Cargando vista previa de la encuesta...',
    });
  }

  configuracion() {
    this.messageService.add({
      severity: 'info',
      summary: 'Configuración',
      detail: 'Abriendo configuración de la encuesta...',
    });
  }

  toggleEditorState() {
    this.isDisabled = !this.isDisabled;
  }

  abrirDialogoSeccion() {
    this.mostrarDialogoSeccion = true;
  }

  cerrarDialogoSeccion() {
    this.mostrarDialogoSeccion = false;
  }
}
