import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-config-plan-estudios',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './config-plan-estudios.component.html',
  styleUrl: './config-plan-estudios.component.scss',
})
export class ConfigPlanEstudiosComponent implements OnInit {
  perfil: any[] = [];
  iConfigId: number;

  form: FormGroup;
  formBusqueda: FormGroup;

  mensajeTexto: string = 'Seleccione un grado para ver sus horas';
  mensajeSeverity: string = 'info';
  visible: boolean = false;
  bEditar: boolean = false;

  ie_cursos: any[] = [];
  ie_cursos_filtrado: any[] = [];

  iTotalHorasMinimo: number = 0;
  iTotalHorasAprobadas: number = 0;
  esCursoMinedu: boolean = false;

  nivel_grados: any[] = null;
  areas: any[] = [];
  areas_curricula: any[] = [];

  gradoSeleccionado: boolean = false;

  constructor(
    private _confirmService: ConfirmationModalService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private stepService: AdmStepGradoSeccionService,
    private route: ActivatedRoute,
    private store: LocalStoreService
  ) {
    this.stepService.setActiveIndex(3);
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.parent?.paramMap.subscribe(params => {
      this.iConfigId = params.get('id') ? Number(params.get('id')) : null;
    });
  }

  ngOnInit(): void {
    try {
      this.formBusqueda = this.fb.group({
        iNivelGradoId: [null],
      });
      this.form = this.fb.group({
        iIeCursoId: [null],
        iConfigId: [this.iConfigId],
        cGradoAbreviacionNombre: [{ value: null, disabled: true }],
        iCursosNivelGradId: [null, Validators.required],
        iHorasSemPresencial: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
        iHorasSemDomicilio: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
        iTotalHoras: [{ value: 0, disabled: true }],
        iHorasSemPresencialAporte: [{ value: null, disabled: true }],
        iHorasSemDomicilioAporte: [{ value: null, disabled: true }],
        iTotalHorasAporte: [null, [Validators.min(1)]],
        iHorasMiniminas: [0],
        iConfPlanId: [null],
        iPorcentajeAporte: [0, [Validators.min(0), Validators.max(100)]],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario:', error);
    }

    this.stepService
      .crearConfiguracion({
        iConfigId: this.iConfigId,
      })
      .subscribe((data: any) => {
        this.nivel_grados = this.stepService.getNivelGrados(data?.nivel_grados);
        this.areas = this.stepService.getCursos(data?.cursos);
        this.areas_curricula = this.stepService.getCursosCurricula(data?.cursos_curricula);
      });

    this.listarIeCursos();
  }

  listarIeCursos(iNivelGradoId: any = null) {
    this.stepService
      .listarIeCursos({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.ie_cursos = data.data;
          if (iNivelGradoId) {
            this.ie_cursos_filtrado = this.ie_cursos.filter(
              item => Number(item.iNivelGradoId) === Number(iNivelGradoId)
            );
          }
        },
        error: error => {
          console.error('Error al obtener datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  validarCursoMinedu() {
    const iConfPlanId = this.form.value.iConfPlanId;
    this.esCursoMinedu = iConfPlanId ? true : false;
    this.form.get('iPorcentajeAporte').setValue(iConfPlanId ? 100 : 0);
    this.validarHorasMinimas();
  }

  siguienteTab() {
    this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/seccion`]);
  }

  setForm(item: any) {
    this.form.patchValue(item);
    this.form
      .get('iCursosNivelGradId')
      .setValue(item.iCursosNivelGradId ? Number(item.iCursosNivelGradId) : null);
    this.form.get('iConfPlanId').setValue(item.iConfPlanId ? Number(item.iConfPlanId) : null);
    this.esCursoMinedu = item.iConfPlanId ? true : false;
  }

  agregarIeCurso() {
    this.bEditar = false;
    const iNivelGradoId = this.formBusqueda.value.iNivelGradoId;
    const grado = this.nivel_grados.filter(item => Number(item.value) === Number(iNivelGradoId));
    this.setForm({
      iConfigId: this.iConfigId,
      cGradoAbreviacionNombre: grado[0].label,
    });
    this.visible = true;
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.bEditar = true;
        this.areas_curricula = this.stepService.filtrarCursosCurricula(item.iNivelGradoId);
        this.visible = true;
        this.setForm(item);
        break;
      case 'activar':
        this._confirmService.openConfiSave({
          header: 'Confirmación',
          message: '¿Desea activar esta área curricular?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarEstado(item, 1);
          },
        });
        break;
      case 'desactivar':
        this._confirmService.openConfiSave({
          header: 'Confirmación',
          message: '¿Desea desactivar esta área curricular?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarEstado(item, 0);
          },
        });
        break;
    }
  }

  actualizarEstado(item: any, estado: number) {
    this.stepService
      .actualizarIeCursoEstado({
        iConfigId: this.iConfigId,
        iIeCursoId: item.iIeCursoId,
        bActivo: estado,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Registro actualizado exitosamente',
          });
          this.listarIeCursos();
        },
        error: error => {
          console.error('Error al actualizar estado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarTabla() {
    const iNivelGradoId = Number(this.formBusqueda.value.iNivelGradoId);
    if (!iNivelGradoId || Number(iNivelGradoId) == 0) {
      this.areas_curricula = this.stepService.filtrarCursosCurricula(null);
      this.areas = this.stepService.filtrarCursos(null);
      this.gradoSeleccionado = false;
      this.ie_cursos_filtrado = [];
      this.iTotalHorasMinimo = 0;
      this.mensajeSeverity = 'info';
      this.mensajeTexto = 'Seleccione un grado para ver sus horas';
    } else {
      this.areas_curricula = this.stepService.filtrarCursosCurricula(iNivelGradoId);
      this.areas = this.stepService.filtrarCursos(iNivelGradoId);
      this.gradoSeleccionado = true;
      this.ie_cursos_filtrado = this.ie_cursos.filter(
        item => Number(item.iNivelGradoId) === Number(iNivelGradoId)
      );
      const nivel_grado = this.nivel_grados.filter(
        item => Number(item.value) === Number(iNivelGradoId)
      );
      this.iTotalHorasMinimo = nivel_grado[0].iTotalHorasMinimo ?? 0;
      this.contarHorasMinedu();
    }
  }

  contarHorasMinedu() {
    this.iTotalHorasAprobadas = this.ie_cursos_filtrado.reduce((acc, item) => {
      return acc + Number(item.iTotalHorasAporte || 0);
    }, 0);
    if (this.iTotalHorasAprobadas < this.iTotalHorasMinimo) {
      this.mensajeSeverity = 'error';
      this.mensajeTexto = `No llega al mínimo de ${this.iTotalHorasMinimo} horas`;
    } else {
      this.mensajeSeverity = 'success';
      this.mensajeTexto = `Cumple el mínimo de ${this.iTotalHorasMinimo} horas`;
    }
  }

  validarHorasMinimas() {
    const iHorasSemPresencial = this.form.value.iHorasSemPresencial
      ? Number(this.form.value.iHorasSemPresencial)
      : 0;
    const iHorasSemDomicilio = this.form.value.iHorasSemDomicilio
      ? Number(this.form.value.iHorasSemDomicilio)
      : 0;
    this.form.get('iTotalHoras').setValue(iHorasSemPresencial + iHorasSemDomicilio);
    if (this.esCursoMinedu) {
      const iPorcentajeAporte = this.form.value.iPorcentajeAporte
        ? Number(this.form.value.iPorcentajeAporte)
        : 100;
      const iHorasSemPresencialAporte = (iHorasSemPresencial * iPorcentajeAporte) / 100;
      const iHorasSemDomicilioAporte = (iHorasSemDomicilio * iPorcentajeAporte) / 100;
      this.form.get('iHorasSemPresencialAporte').setValue(iHorasSemPresencialAporte);
      this.form.get('iHorasSemDomicilioAporte').setValue(iHorasSemDomicilioAporte);
      this.form
        .get('iTotalHorasAporte')
        .setValue(iHorasSemPresencialAporte + iHorasSemDomicilioAporte);
    } else {
      this.form.get('iHorasSemPresencialAporte').setValue(iHorasSemPresencial);
      this.form.get('iHorasSemDomicilioAporte').setValue(iHorasSemDomicilio);
      this.form.get('iTotalHorasAporte').setValue(iHorasSemPresencial + iHorasSemDomicilio);
    }
    this.form.updateValueAndValidity();
  }

  guardar() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: 'Por favor revise las indicaciones de cada campo',
      });
      return;
    }
    this.stepService.guardarIeCurso(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Registro guardado exitosamente',
        });
        this.cerrarDialogo();
        const iNivelGradoId = this.formBusqueda.value.iNivelGradoId;
        this.listarIeCursos(iNivelGradoId);
      },
      error: error => {
        console.error('Error al guardar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  actualizar() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Advertencia',
        detail: 'Por favor revise las indicaciones de cada campo',
      });
      return;
    }
    this.stepService.actualizarIeCurso(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Registro actualizado exitosamente',
        });
        this.cerrarDialogo();
        const iNivelGradoId = this.formBusqueda.value.iNivelGradoId;
        this.listarIeCursos(iNivelGradoId);
      },
      error: error => {
        console.error('Error al actualizar estado:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  cerrarDialogo() {
    this.visible = false;
    this.form.reset();
    this.setForm({ iConfigId: this.iConfigId });
  }

  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Desactivar',
      icon: 'pi pi-times',
      accion: 'desactivar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: rowData => {
        return Number(rowData.bActivo) === 1;
      },
    },
    {
      labelTooltip: 'Activar',
      icon: 'pi pi-check',
      accion: 'activar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: rowData => {
        return Number(rowData.bActivo) === 0;
      },
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  columns = [
    {
      type: 'text',
      width: '15%',
      field: 'cGradoAbreviacionNombre',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cCursoNombre',
      header: 'Área IE',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iTotalHoras',
      header: 'Horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cCursoNombreMinedu',
      header: 'Área MINEDU',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iTotalHorasAporte',
      header: 'Horas MINEDU',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'bActivo',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'right',
    },
  ];
}
