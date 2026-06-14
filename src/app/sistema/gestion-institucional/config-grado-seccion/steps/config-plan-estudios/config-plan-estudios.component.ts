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

  ie_cursos: any[] = [];
  ie_cursos_filtrado: any[] = [];

  iTotalHorasMinimo: number = 0;
  iTotalHorasAprobadas: number = 0;

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
        iCursosNivelGradId: [null, Validators.required],
        iCursoId: [null, Validators.required],
        iHorasSemPresencial: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
        iHorasSemDomicilio: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
        iTotalHoras: [{ value: 0, disabled: true }, Validators.required],
        iHorasSemPresencialMinedu: [{ value: null, disabled: true }],
        iHorasSemDomicilioMinedu: [{ value: null, disabled: true }],
        iTotalHorasMinedu: [{ value: null, disabled: true }],
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
    const curso_minedu = this.ie_cursos_filtrado.filter(
      item => Number(item.iConfPlanId) === Number(iConfPlanId)
    );
    this.form.patchValue({
      iHorasSemPresencialMinedu:
        curso_minedu.length > 0 ? curso_minedu[0].iHorasSemPresencial : null,
      iHorasSemDomicilioMinedu: curso_minedu.length > 0 ? curso_minedu[0].iHorasSemDomicilio : null,
      iTotalHorasMinedu: curso_minedu.length > 0 ? curso_minedu[0].iTotalHoras : null,
    });
  }

  siguienteTab() {
    this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/seccion`]);
  }

  setForm(item: any) {
    this.form.patchValue(item);
    this.form.get('iCursoId').setValue(item.iCursoId ? Number(item.iCursoId) : null);
    this.form.get('iConfPlanId').setValue(item.iConfPlanId ? Number(item.iConfPlanId) : null);
  }

  agregarIeCurso() {
    this.setForm({ iConfigId: this.iConfigId });
    this.visible = true;
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
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
        iEstado: estado,
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
      this.gradoSeleccionado = false;
      this.ie_cursos_filtrado = [];
      this.iTotalHorasMinimo = 0;
      this.mensajeSeverity = 'info';
      this.mensajeTexto = 'Seleccione un grado para ver sus horas';
    } else {
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
      return acc + Number(item.iTotalHorasMinedu || 0);
    }, 0);
    if (this.iTotalHorasAprobadas < this.iTotalHorasMinimo) {
      this.mensajeSeverity = 'error';
      this.mensajeTexto = `No llega al mínimo de ${this.iTotalHorasMinimo} horas`;
    } else {
      this.mensajeSeverity = 'success';
      this.mensajeTexto = `Cumple el mínimo de ${this.iTotalHorasMinimo} horas`;
    }
  }

  validarPorcentajeAporte() {
    const iPorcentajeAporte = Number(this.form.value.iPorcentajeAporte);
    const iPorcentajeActual = this.ie_cursos_filtrado.reduce((acc, item) => {
      return acc + Number(item.iPorcentajeAporte || 0);
    }, 0);
    const diferencia = 100 - iPorcentajeActual;
    if (iPorcentajeAporte > diferencia) {
      this.form.get('iPorcentajeAporte').setValidators(Validators.max(diferencia));
      this.form.get('iPorcentajeAporte').markAsDirty();
      this.form.get('iPorcentajeAporte').updateValueAndValidity();
    }
  }

  validarHorasMinimas() {
    const iHorasSemPresencial = this.form.value.iHorasSemPresencial ?? 0;
    const iHorasSemDomicilio = this.form.value.iHorasSemDomicilio ?? 0;
    this.form.get('iTotalHoras').setValue(iHorasSemPresencial + iHorasSemDomicilio);
  }

  guardar() {
    this.stepService.guardarIeCurso(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Registro guardado exitosamente',
        });
        this.cerrarDialogo();
        const iNivelGradoId = this.form.value.iNivelGradoId;
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
    this.stepService.actualizarIeCursoEstado(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Registro actualizado exitosamente',
        });
        this.cerrarDialogo();
        const iNivelGradoId = this.form.value.iNivelGradoId;
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
    this.setForm({ iConfigId: this.iConfigId });
  }

  selectedItems = [];

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Desactivar',
      icon: 'pi pi-times',
      accion: 'desactivar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: rowData => {
        return Number(rowData.bActive) === 1;
      },
    },
    {
      labelTooltip: 'Activar',
      icon: 'pi pi-check',
      accion: 'activar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: rowData => {
        return Number(rowData.bActive) === 0;
      },
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
      width: '20%',
      field: 'cCursoNombre',
      header: 'Área MINEDU',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iTotalHoras',
      header: 'Total',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iTotalHorasMinedu',
      header: 'Total',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '10%',
      field: 'iEstado',
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
