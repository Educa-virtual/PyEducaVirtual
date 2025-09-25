import { Component, inject, OnInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem, MessageService, TreeNode } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';
import { StepConfirmationService } from '@/app/servicios/confirm.service';
//import { TreeModule } from 'primeng/tree'
import { MultiSelectModule } from 'primeng/multiselect';
//import { TreeViewPrimengComponent } from '@/app/shared/tree-view-primeng/tree-view-primeng.component'
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';

@Component({
  selector: 'app-config-seccion',
  standalone: true,
  imports: [
    StepsModule,
    PrimengModule,
    ContainerPageComponent,
    TablePrimengComponent,
    ReactiveFormsModule,
    //  TreeModule,
    MultiSelectModule,
    // TreeViewPrimengComponent,
  ],
  templateUrl: './config-seccion.component.html',
  styleUrl: './config-seccion.component.scss',
  providers: [],
})
export class ConfigSeccionComponent implements OnInit {
  items: MenuItem[];
  caption: string;
  visible: boolean = false;
  iServId: number;
  form: FormGroup;

  files!: TreeNode[];
  selectedFiles!: TreeNode[];
  perfil: [];
  serv_atencion: [];
  configuracion: any[];

  grados: any[] = [];
  ciclos: any[];
  ambientes: any[];

  secciones: any[];
  seccionesAsignadas: any[];
  uso: any[];
  sede: any[];

  diasSelecionados: any[];
  tutores: any[];
  formValues: any[];
  rawData: any[] = [];
  lista: any = {};
  bActualizar: boolean = false;

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService,
    private msg: StepConfirmationService
    // private nodeService: NodeService
  ) {
    this.items = this.stepService.itemsStep;
    this.perfil = this.stepService.perfil;
    this.configuracion = this.stepService.configuracion;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.form = this.fb.group({
        iDetConfId: [0],
        iConfigId: [this.configuracion[0].iConfigId],
        iTurnoId: [this.configuracion[0].iTurnoId],

        iServEdId: [{ value: this.configuracion[0].iServEdId, disabled: true }],
        iIieeAmbienteId: [null, Validators.required],

        iAmbienteAforo: [{ value: '', disabled: true }],
        iUsoAmbId: [{ value: '', disabled: true }],

        iYAcadId: [{ value: this.configuracion[0].iYAcadId, disabled: true }],
        iSeccionId: [null, Validators.required],
        iNivelGradoId: [null, Validators.required],

        cDiasLaborables: [{ value: '', disabled: true }],

        cModalServId: [
          {
            value: this.configuracion[0].cModalServId,
            disabled: true,
          },
        ],
        cPrograma: [{ value: 'No APLICA', disabled: true }],
        cServEdNombre: [
          {
            value: this.configuracion[0].cServEdNombre,
            disabled: true,
          },
        ],
        cCicloNombre: [{ value: '', disabled: true }],
        cFase: [{ value: 'FASE REGULAR', disabled: true }],
        cNivelNombre: [{ value: '', disabled: true }], //modalidad de servicio
        cNivelTipoNombre: [{ value: '', disabled: true }],
        cAmbienteDescripcion: [{ value: '', disabled: true }],
        cDetConfNombreSeccion: ['', Validators.required],
        iDetConfCantEstudiantes: [0, Validators.required],
        cDetConfObs: [''],
        cTurnoNombre: [
          {
            value: this.configuracion[0].cTurnoNombre,
            disabled: true,
          },
        ],
        cYAcadNombre: [
          {
            value: this.configuracion[0].cYAcadNombre,
            disabled: true,
          },
        ], // Control para "Descripcion año"
      });
    } catch (error) {
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }

    this.grados = await this.stepService.getGrado();

    //this.stepService.getFilesPrimaria().then((data) => (this.files = data));
    this.ambientes = this.stepService.ambientes ?? (await this.stepService.getAmbientes());
    //this.serv_atencion = this.stepService.serv_atencion
    this.uso = this.stepService.uso_ambientes ?? (await this.stepService.getUsoAmbiente()); // this.getUsoAmbientes()
    this.secciones = this.stepService.secciones ?? (await this.stepService.getSecciones());
    this.seccionesAsignadas =
      this.stepService.seccionesAsignadas ?? (await this.stepService.getSeccionesAsignadas());
    const dias = await this.stepService.getDiasCalendario();
    this.form.get('cDiasLaborables').setValue(dias);
    //this.getTutor()

    // this.rawData = this.stepService.listaGrados
    //  this.updateData() ;
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'agregar') {
      this.visible = true;
      this.bActualizar = false;
      this.caption = 'Configurar grados y secciones';
      this.form.get('iNivelGradoId')?.enable();
      this.form.get('iSeccionId')?.enable();
    }
    if (accion === 'retornar') {
      this._confirmService.openConfiSave({
        message: '¿Estás seguro de que deseas regresar al paso anterior?',
        header: 'Advertencia de autoguardado',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.router.navigate(['/gestion-institucional/ambiente']);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }

    if (accion === 'editar') {
      this.visible = true;
      this.bActualizar = true;
      this.caption = 'Actualizar grados y secciones';
      // +++++++++++++++++++++++actualizar
      const found1 = this.grados.find(item1 => item1.iNivelGradoId === item.iNivelGradoId);
      this.form.get('cCicloNombre')?.setValue(found1.cCicloNombre);
      this.form.get('cNivelNombre')?.setValue(found1.cNivelNombre);
      this.form.get('cNivelTipoNombre')?.setValue(found1.cNivelTipoNombre);
      const found2 = this.ambientes.find(item2 => item2.iIieeAmbienteId === item.iIieeAmbienteId);

      this.form.get('iAmbienteAforo')?.setValue(found2.iAmbienteAforo);
      this.form.get('cAmbienteDescripcion')?.setValue(found2.cAmbienteDescripcion);
      this.form.get('iUsoAmbId')?.setValue(found2.iUsoAmbId);

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
      this.form.patchValue({
        iDetConfId: item.iDetConfId,
        //iConfigId: item.iConfigId,
        // iTurnoId: item.iTurnoId,
        iIieeAmbienteId: item.iIieeAmbienteId,
        cDetConfNombreSeccion: item.cDetConfNombreSeccion,
        iDetConfCantEstudiantes: item.iDetConfCantEstudiantes,
        cDetConfObs: item.cDetConfObs,
        iSeccionId: item.iSeccionId,
        iNivelGradoId: item.iNivelGradoId,
        cPrograma: 'No APLICA',
        // iServEdId: this.configuracion[0].iServEdId,
        cCicloNombre: item.cCicloNombre,
        cFase: 'FASE REGULAR',
        iYAcadId: this.configuracion[0].iYAcadId,
        cYAcadNombre: this.configuracion[0].cYAcadNombre,
      });

      this.form.get('iNivelGradoId')?.disable();
      this.form.get('iSeccionId')?.disable();
    }
    if (accion === 'eliminar') {
      const id = Number(item.iIieeAmbienteId);
      this._confirmService.openConfiSave({
        header: 'Advertencia de autoguardado',
        message:
          'No podrá eliminar si existen grados asignados al ambiente. ¿Estás seguro de que deseas eliminar ambiente?,',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.deleteAmbiente(id);
        },
        reject: () => {
          // Mensaje de cancelación (opcional)
          this.messageService.add({
            severity: 'error',
            summary: 'Cancelado',
            detail: 'Acción cancelada',
          });
        },
      });
    }
  }

  validarSeccion() {
    //comparar la lista de secciones
    const iNivelGradoId: number = this.form.value.iNivelGradoId;
    const iSeccionId: number = this.form.value.iSeccionId;

    const registro = this.seccionesAsignadas.some(
      item =>
        Number(item.iNivelGradoId) === Number(iNivelGradoId) &&
        Number(item.iSeccionId) === Number(iSeccionId)
    );
    return registro;
  }

  accionBtnItem(accion) {
    if (accion === 'guardar') {
      if (this.validarSeccion()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje de sistema',
          detail: 'Ya existe nivel grado y sección en la IE',
        });
        return;
      }
      if (this.form.valid) {
        this.formValues = this.form.getRawValue();
        //ALMACENAR LA INFORMACION
        this.query
          .addAmbienteAcademico({
            json: JSON.stringify(this.formValues),
            _opcion: 'addDetGradoSecciones',
          })
          .subscribe({
            next: (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje de sistema',
                detail: 'Se guardó correctamente la sección asignada. ' + data.data[0].id,
              });
            },
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Mensaje de sistema',
                detail: 'Error. No se proceso petición: ' + error.error.message,
              });
            },
            complete: async () => {
              this.seccionesAsignadas = await this.stepService.getSeccionesAsignadas();
              this.visible = false;
              // this.clearForm()
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Proceso exitoso',
              });
            },
          });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje',
          detail: 'Llenado incorrecto de formulario',
        });
      }
    }
    if (accion === 'editar') {
      if (this.form.valid) {
        this.formValues = this.form.getRawValue();
        //ALMACENAR LA INFORMACION

        this.query
          .addAmbienteAcademico({
            json: JSON.stringify(this.formValues),
            _opcion: 'addDetGradoSecciones',
          })
          .subscribe({
            next: (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje de sistema',
                detail: 'Se guardó correctamente la sección asignada. ' + data.data[0].id,
              });
            },
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Mensaje de sistema',
                detail: 'Error. No se proceso petición: ' + error.error.message,
              });
            },
            complete: async () => {
              this.seccionesAsignadas = await this.stepService.getSeccionesAsignadas();
              this.visible = false;
              // this.clearForm()
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Proceso exitoso',
              });
            },
          });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje',
          detail: 'Llenado incorrecto de formulario',
        });
      }
    }
  }

  //evento del dropdown
  onChange(event: any, cbo: string): void {
    // Captura el valor seleccionado
    const selected = event.value;
    if (cbo === 'grado') {
      // Encuentra el objeto
      const found = this.grados.find(item => item.iNivelGradoId === selected);
      // Encuentra el índice del objeto si existe
      this.form.get('cCicloNombre')?.setValue(found.cCicloNombre);
      this.form.get('cNivelNombre')?.setValue(found.cNivelNombre);
      this.form.get('cNivelTipoNombre')?.setValue(found.cNivelTipoNombre);
    }

    if (cbo === 'ambiente') {
      const found = this.ambientes.find(item => item.iIieeAmbienteId === selected);
      // Encuentra el índice del objeto si existe

      this.form.get('iAmbienteAforo')?.setValue(found.iAmbienteAforo);
      this.form.get('cAmbienteDescripcion')?.setValue(found.cAmbienteDescripcion);
      this.form.get('iUsoAmbId')?.setValue(found.iUsoAmbId);
    }
  }

  /*getGrado() {
    
    this.query
      .searchGradoCiclo({
        iNivelTipoId: this.stepService.iNivelTipoId,
      })
      .subscribe({
        next: (data: any) => {
          this.grados = data.data;
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar los grados:' + error.error.message,
          });
        },
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Mensaje de sistema',
            detail: 'Se cargaron los grados correctamente',
          });

          this.stepService.grados = this.grados;
        },
      });
  }*/
  confirm() {
    this._confirmService.openConfiSave({
      message: '¿Estás seguro de que deseas guardar y continuar?',
      header: 'Advertencia de autoguardado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.router.navigate(['/gestion-institucional/plan-estudio']);
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }

  deleteAmbiente(id: number) {
    const params = {
      esquema: 'acad',
      tabla: 'iiee_ambientes',
      campo: 'iIieeAmbienteId',
      valorId: id,
    };
    this.query.deleteAcademico(params).subscribe({
      next: (data: any) => {
        const registro = data.data[0];
        if (registro.result > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Registro eliminado correctamente',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del sistema',
            detail: 'No se puede eliminar, ya existen matrículas relacionadas.', //registro.mensaje,
          });
        }
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje de error',
          detail: 'No se pudo eliminar registro' + error.error.message,
        });
      },
      // complete: () => {
      //   console.log('Request completed');
      // },
    });
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Retornar',
      text: 'Retornar',
      icon: 'pi pi-arrow-circle-left',
      accion: 'retornar',
      class: 'p-button-warning',
    },
    {
      labelTooltip: 'Agregar sección',
      text: 'Agregar Sección',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
    },
    // {
    //     labelTooltip: 'Generar reporte',
    //     text: 'Reporte',
    //     icon: 'pi pi-file-pdf',
    //     accion: 'reporte',
    //     class: 'p-button-danger',
    // },
  ];

  accionesTable: IActionContainer[] = [
    //
  ];

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
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
    },
  ];

  actionsLista: IActionTable[];
  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '',
      text_header: 'left',
      text: 'left',
    },
    // {
    //     type: 'arrayColumn',
    //     width: '35%',
    //     field: 'arrayAmbientes',
    //     header: 'Ambiente',
    //     text_header: 'center',
    //     text: 'center',
    // },
    {
      type: 'text',
      width: '5rem',
      field: 'cAmbienteNombre',
      header: 'Ambiente',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '5rem',
      field: 'cGradoNombre',
      header: 'Grado',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '5rem',
      field: 'cCicloRomanos',
      header: 'Ciclo',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '5rem',
      field: 'cSeccionNombre',
      header: 'Sección',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '5rem',
      field: 'iDetConfCantEstudiantes',
      header: 'Vacantes',
      text_header: 'center',
      text: 'center',
    },

    // {
    //   type: 'text',
    //   width: '30%',
    //   field: 'nombres',
    //   header: 'Tutor',
    //   text_header: 'center',
    //   text: 'center',
    // },

    {
      type: 'text',
      width: '5rem',
      field: 'cTurnoNombre',
      header: 'Turno',
      text_header: 'center',
      text: 'center',
    },
    // {
    //     type: 'text',
    //     width: '5rem',
    //     field: 'cModalServNombre',
    //     header: 'Servicio',
    //     text_header: 'center',
    //     text: 'center',
    // },

    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
