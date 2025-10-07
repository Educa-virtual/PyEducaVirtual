import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { PlantillaSeccionComponent } from './plantilla-seccion/plantilla-seccion.component';
import { EncuestasService } from '../../services/encuestas.services';
import { SlicePipe } from '@angular/common';
import { PlantillaPreguntaComponent } from './plantilla-pregunta/plantilla-pregunta.component';

@Component({
  selector: 'app-llenado-preguntas-plantilla',
  standalone: true,
  imports: [PrimengModule, FormsModule, PlantillaSeccionComponent, PlantillaPreguntaComponent],
  templateUrl: './llenado-preguntas-plantilla.component.html',
  styleUrl: './llenado-preguntas-plantilla.component.scss',
  providers: [SlicePipe],
})
export class LlenadoPreguntasPlantillaComponent implements OnInit {
  breadCrumbItems: MenuItem[] = [];
  breadCrumbHome: MenuItem;

  perfil: any;
  iYAcadId: number;
  es_director: boolean = false;
  plantilla: any;
  iPlanId: number;
  iCateId: number;
  iPlanSeccionId: number;
  iPlanPregId: number;
  plantilla_bloqueada: boolean = true;

  selectedItem: any;
  totalPreguntas: number = 0;
  mostrarDialogoSeccion: boolean = false;
  mostrarDialogoPregunta: boolean = false;

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
    this.es_director = [DIRECTOR_IE].includes(this.perfil?.iPerfilId);
    this.route.paramMap.subscribe((params: any) => {
      this.iCateId = params.params.iCateId || null;
      this.iPlanId = params.params.iPlanId || null;
    });
    this.setBreadCrumbs();
  }

  ngOnInit() {
    this.calcularTotalPreguntas();
    if (this.iPlanId) {
      this.verPlantilla();
    }
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorias', routerLink: `/encuestas/categorias` },
      {
        label: this.plantilla?.cCateNombre
          ? String(this.slicePipe.transform(this.plantilla?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      {
        label: 'Plantillas',
        routerLink: `/encuestas/categorias/${this.iCateId}/gestion-plantillas`,
      },
      {
        label: this.plantilla?.cPlanNombre
          ? String(this.slicePipe.transform(this.plantilla?.cPlanNombre, 0, 20))
          : 'Plantilla',
      },
      { label: 'Preguntas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  verPlantilla() {
    this.encuestasService
      .verPlantilla({
        iPlanId: this.iPlanId,
        iTipoUsuario: 2,
      })
      .subscribe({
        next: (data: any) => {
          this.plantilla = data.data;
          if (!this.plantilla) {
            this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
          }
          this.setBreadCrumbs();
          this.listarSecciones();
          this.plantilla_bloqueada =
            Number(this.plantilla?.iEstado) === this.ESTADO_APROBADA ||
            Number(this.plantilla?.puede_editar) === 0;
        },
        error: error => {
          if (!this.plantilla) {
            this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
          }
          console.error('Error obteniendo plantilla:', error);
        },
      });
  }

  listarSecciones() {
    this.encuestasService
      .listarPlantillaSecciones({
        iPlanId: this.iPlanId,
      })
      .subscribe({
        next: (data: any) => {
          this.secciones = data.data;
          this.secciones.forEach((seccion: any) => {
            seccion.preguntas = seccion?.json_preguntas ? JSON.parse(seccion.json_preguntas) : [];
          });
          this.encuestasService.getSeccionesPlantilla(this.secciones);
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
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/gestion-plantillas/${this.iPlanId}`,
    ]);
  }

  calcularTotalPreguntas() {
    this.totalPreguntas = this.secciones.reduce(
      (total, seccion) => total + seccion.preguntas.length,
      0
    );
  }

  editarSeccion(iPlanSeccionId: any) {
    this.iPlanSeccionId = null;
    this.mostrarDialogoSeccion = false;
    setTimeout(() => {
      this.iPlanSeccionId = iPlanSeccionId;
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
      header: `¿Está seguro de eliminar la sección seleccionada #${seccion?.iPlanSeccionOrden}?`,
      accept: () => {
        this.encuestasService
          .borrarPlantillaSeccion({
            iPlanSeccionId: seccion?.iPlanSeccionId,
          })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sección eliminada',
                detail: 'La sección ha sido eliminada correctamente',
              });
              this.secciones = this.secciones.filter(
                (sec: any) => sec.iPlanSeccionId !== seccion?.iPlanSeccionId
              );
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

  eliminarPregunta(iPlanPregId: any) {
    this.confirmationModalService.openConfirm({
      header: `¿Está seguro de eliminar la pregunta seleccionada?`,
      accept: () => {
        this.encuestasService
          .borrarPlantillaPregunta({
            iPlanPregId: iPlanPregId,
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
    this.iPlanSeccionId = seccion.iPlanSeccionId;
    this.iPlanPregId = null;
    this.abrirDialogoPregunta();
  }

  editarPregunta(iPlanPregId: any) {
    this.iPlanPregId = null;
    this.mostrarDialogoPregunta = false;
    setTimeout(() => {
      this.iPlanPregId = iPlanPregId;
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
    if (!pregunta.cPlanPregunta || pregunta.cPlanPregunta.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La pregunta no puede estar vacía',
      });
      return;
    }
    if (
      pregunta.alternativas.some(
        (alt: any) =>
          !alt.cPlanAlternativaDescripcion || alt.cPlanAlternativaDescripcion.trim() === ''
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
}
