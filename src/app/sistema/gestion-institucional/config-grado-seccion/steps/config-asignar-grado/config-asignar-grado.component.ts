import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-config-asignar-grado',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './config-asignar-grado.component.html',

  styleUrl: './config-asignar-grado.component.scss',
})
export class ConfigAsignarGradoComponent implements OnInit {
  iConfigId: number;
  perfil: any[] = [];
  iYAcadId: number;

  form: FormGroup;
  formBusqueda: FormGroup;

  ie_cursos: any[] = [];
  ie_cursos_filtrados: any[] = [];
  docente_cursos_historial: any[] = [];

  grado_seccion_turno: any[] = [];
  nivel_grados: any[] = null;
  secciones: any[] = [];
  docentes: any = [];

  visible: boolean = false;
  caption: string;
  c_accion: string;
  bEditar: boolean = false;
  bSoloVer: boolean = false;
  activeTab: number = 0;

  horas_asignadas: number;
  minimo: number = 0;

  itemSeleccionado: any;

  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private store: LocalStoreService,
    private route: ActivatedRoute,
    private confirmService: ConfirmationModalService
  ) {
    this.stepService.setActiveIndex(5);
    this.perfil = this.store.getItem('dremoPerfil');
    this.route.parent?.paramMap.subscribe(params => {
      this.iConfigId = params.get('id') ? Number(params.get('id')) : null;
    });
  }

  ngOnInit(): void {
    try {
      this.formBusqueda = this.fb.group({
        iNivelGradoId: [null],
        iSeccionId: [null],
      });
      this.form = this.fb.group({
        idDocCursoId: [null],
        iConfigId: [this.iConfigId, Validators.required],
        iDocenteId: [null, Validators.required],
        iIeCursoId: [null, Validators.required],
        iDetConfId: [null, [Validators.required]],
        cDocCursoObservaciones: [''],
        cSeccionNombre: [{ value: '', disabled: true }],
        cGradoNombre: [{ value: '', disabled: true }],
        cCursoNombre: [{ value: '', disabled: true }],
        iTotalHoras: [{ value: 0, disabled: true }],
      });
    } catch (error) {
      console.error('Error al inicializar el formulario:', error);
    }

    this.stepService
      .crearConfiguracion({
        iConfigId: this.iConfigId,
      })
      .subscribe((data: any) => {
        this.grado_seccion_turno = this.stepService.getGradoSeccionTurno(data?.grado_seccion_turno);
        this.nivel_grados = this.stepService.filterNivelGrados(data?.grado_seccion_turno);
      });

    this.formBusqueda.get('iNivelGradoId').valueChanges.subscribe(value => {
      this.filtrarTabla();
      this.secciones = [];
      this.formBusqueda.get('iSeccionId')?.setValue(null);
      if (value) {
        this.filterSecciones(value);
        if (this.secciones.length === 1) {
          this.formBusqueda.get('iSeccionId')?.setValue(this.secciones[0]['value']);
        }
      }
    });

    this.listarDocenteCurso();
    this.listarDocentePersonalIe();
  }

  filterSecciones(iNivelGradoId: any) {
    this.secciones = this.grado_seccion_turno.reduce((prev: any, current: any) => {
      const x = prev.find(
        item => item.value === current.iSeccionId && item.label === current.cSeccionNombre
      );
      if (!x && Number(current.iNivelGradoId) === Number(iNivelGradoId)) {
        return prev.concat([
          {
            value: current.iSeccionId,
            label: current.cSeccionNombre,
          },
        ]);
      } else {
        return prev;
      }
    }, []);
    if (this.secciones.length === 1) {
      this.formBusqueda.get('iSeccionId')?.setValue(this.secciones[0]['value']);
    }
  }

  listarDocentePersonalIe() {
    this.stepService
      .listarDocentePersonalIe({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.docentes = data.data.map(docente => ({
            value: Number(docente.iDocenteId),
            label: `${docente.cPersNombreCompleto} (${docente.iHorasAsignadas ?? 0}/${docente.iHorasLabora ?? 0} horas)`,
            iHorasRestantes: docente.iHorasAsignadas - docente.iHorasLabora,
          }));
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

  listarDocenteCurso() {
    this.stepService
      .listarDocenteCurso({
        iConfigId: this.iConfigId,
      })
      .subscribe({
        next: (data: any) => {
          this.ie_cursos = data.data;
          this.filtrarTabla();
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

  filtrarTabla() {
    const iNivelGradoId = Number(this.formBusqueda.value.iNivelGradoId);
    const iSeccionId = Number(this.formBusqueda.value.iSeccionId);
    if (!iNivelGradoId || Number(iNivelGradoId) == 0 || !iSeccionId || Number(iSeccionId) == 0) {
      this.ie_cursos_filtrados = [];
    } else {
      this.ie_cursos_filtrados = this.ie_cursos.filter(
        item =>
          Number(item.iSeccionId) === Number(iSeccionId) &&
          Number(item.iNivelGradoId) === Number(iNivelGradoId)
      );
    }
  }

  setForm(item): void {
    this.form.patchValue(item);
    this.form.reset({
      iConfigId: this.iConfigId,
      cSeccionNombre: this.itemSeleccionado?.cSeccionNombre,
      cCursoNombre: this.itemSeleccionado?.cCursoNombre,
      cGradoNombre: this.itemSeleccionado?.cGradoNombre,
      iDetConfId: this.itemSeleccionado?.iDetConfId,
      iIeCursoId: this.itemSeleccionado?.iIeCursoId,
      iTotalHoras: this.itemSeleccionado?.iTotalHoras,
    });
    this.form.get('iDocenteId').setValue(item.iDocenteId ? Number(item.iDocenteId) : null);
    this.form.updateValueAndValidity();
  }

  agregarDocenteCurso() {
    this.setForm({});
    this.bEditar = false;
    this.bSoloVer = false;
    this.caption = 'Asignar área curricular a docente';
    this.cambiarTab(1);
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.c_accion = accion;
        this.itemSeleccionado = item;
        this.caption = 'Editar áreas asignada a docente';
        this.visible = true;
        this.verDocenteCursoHistorial(item);
        break;
      case 'eliminar':
        this.confirmService.openConfirm({
          message: '¿Realmente desea eliminar este elemento?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.borrarDocentecurso(item);
          },
        });
        break;
    }
  }

  verDocenteCursoHistorial(item: any) {
    this.stepService.verDocenteCursoHistorial(item).subscribe({
      next: (data: any) => {
        this.docente_cursos_historial = data.data;
      },
      error: error => {
        console.error('Error al actualizar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  guardarDocenteCurso() {
    this.stepService.guardarDocenteCurso(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro guardado exitosamente',
        });
        this.cerrarDialogo();
        this.listarDocenteCurso();
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

  actualizarDocenteCurso() {
    this.stepService.actualizarDocenteCurso(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro actualizado exitosamente',
        });
        this.cerrarDialogo();
        this.listarDocenteCurso();
      },
      error: error => {
        console.error('Error al actualizar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  borrarDocentecurso(item: any) {
    this.stepService.borrarDocentecurso(item).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Docente eliminado exitosamente',
        });
        this.listarDocenteCurso();
      },
      error: error => {
        console.error('Error al eliminar docente:', error);
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
    this.cambiarTab(0);
    this.setForm({});
  }

  anterior() {
    this.router.navigate([`/gestion-institucional/config/${this.iConfigId}/hora-docente`]);
  }

  cambiarTab(index: number) {
    this.activeTab = index;
  }

  actions: IActionTable[] = [
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
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'N°',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cCursoNombre',
      header: 'Area curricular',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cPersNombreCompleto',
      header: 'Docente',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'iDocCursoHorasLectivas',
      header: 'Horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  accionBtnItemTableHistorial({ accion, item }) {
    switch (accion) {
      case 'ver':
        this.setForm(item);
        this.bSoloVer = true;
        this.cambiarTab(1);
        break;
    }
  }

  actionsHistorial: IActionTable[] = [
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  columnsHistorial = [
    {
      type: 'text',
      width: '35%',
      field: 'cPersNombreCompleto',
      header: 'Docente',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'iDocCursoHorasLectivas',
      header: 'Horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dInicioPeriodo',
      header: 'Desde',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dFinPeriodo',
      header: 'Hasta',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '15%',
      field: 'bActivo',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions_historial',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
