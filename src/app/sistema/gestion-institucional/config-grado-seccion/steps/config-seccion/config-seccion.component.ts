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
  turnos: any[];
  grados: any[] = [];
  ciclos: any[];
  ambientes: any[];
  modalidad: any[];
  secciones: any[];
  seccionesAsignadas: any[];
  uso: any[];
  sede: any[];
  dias: any[] = [];
  diasSelecionados: any[];
  tutores: any[];
  formValues: any[];
  rawData: any[] = [];
  lista: any = {};

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
    this.sede = this.stepService.sede;
  }

  ngOnInit(): void {
    try {
      this.form = this.fb.group({
        iDetConfId: [0],
        iConfigId: [this.configuracion[0].iConfigId],
        iTurnoId: [0, Validators.required],
        iModalServId: [{ value: this.configuracion[0].iModalServId }, Validators.required],
        iIieeAmbienteId: [0, Validators.required],
        iPersIeIdTutor: [0, Validators.required],
        cDetConfNombreSeccion: ['', Validators.required],
        iDetConfCantEstudiantes: [0, Validators.required],
        cDetConfObs: [''],
        iSeccionId: [0, Validators.required],
        iNivelGradoId: [0, Validators.required],

        iDiasLaborables: [{ value: '', disabled: true }],
        cModalServId: [{ value: '', disabled: true }],
        cPrograma: [{ value: 'No APLICA', disabled: true }],
        iServEdId: [{ value: this.configuracion[0].iServEdId, disabled: true }],
        cCicloNombre: [{ value: '', disabled: true }],
        cFase: [{ value: 'FASE REGULAR', disabled: true }],
        cNivelNombre: [{ value: '', disabled: true }],
        cNivelTipoNombre: [{ value: '', disabled: true }],
        cAmbienteDescripcion: [{ value: '', disabled: true }],
        iAmbienteAforo: [{ value: '', disabled: true }],
        iUsoAmbId: [{ value: '', disabled: true }],

        iYAcadId: [{ value: this.configuracion[0].iYAcadId, disabled: true }],
        cYAcadNombre: [
          {
            value: this.configuracion[0].cYAcadNombre,
            disabled: true,
          },
        ], // Control para "Descripcion año"
      });

      console.log(this.form, 'formulario');
    } catch (error) {
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }
    this.getGrado();
    //this.stepService.getFilesPrimaria().then((data) => (this.files = data));
    this.getAmbientes();

    this.getUsoAmbientes();
    this.getServicioAtencion();
    this.getModalidad();
    this.getSecciones();
    this.getSeccionesAsignadas();
    this.getTurnoCalendario();
    this.getDiasCalendario();
    this.getTutor();

    // this.rawData = this.stepService.listaGrados
    //  this.updateData() ;
  }

  accionBtnItemTable({ accion, item }) {
    if (accion === 'agregar') {
      this.visible = true;
      this.caption = 'Configurar grados y secciones';
      console.log(item, 'btnTable');
    }
    if (accion === 'retornar') {
      alert('Desea retornar');
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }

    if (accion === 'editar') {
      console.log(item, 'item modificar');
      this.visible = true;
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

      const found3 = this.turnos.find(item3 => item3.iTurnoId === item.iTurnoId);
      this.form.get('iModalServId')?.setValue(found3.iModalServId);
      this.form.get('cModalServId')?.setValue(found3.iModalServId);

      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++
      this.form.patchValue({
        iDetConfId: item.iDetConfId,
        iConfigId: item.iConfigId,
        iTurnoId: item.iTurnoId,
        iModalServId: item.iModalServId,
        iIieeAmbienteId: item.iIieeAmbienteId,
        iPersIeIdTutor: item.iPersIeIdTutor,
        cDetConfNombreSeccion: item.cDetConfNombreSeccion,
        iDetConfCantEstudiantes: item.iDetConfCantEstudiantes,
        cDetConfObs: item.cDetConfObs,
        iSeccionId: item.iSeccionId,
        iNivelGradoId: item.iNivelGradoId,

        cPrograma: 'No APLICA',
        iServEdId: this.configuracion[0].iServEdId,
        cCicloNombre: item.cCicloNombre,
        cFase: 'FASE REGULAR',

        iYAcadId: this.configuracion[0].iYAcadId,
        cYAcadNombre: this.configuracion[0].cYAcadNombre,
      });
    }
    if (accion === 'eliminar') {
      const id = Number(item.iIieeAmbienteId);
      console.log(item, 'item');
      alert(id);
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

  accionBtnItem(accion) {
    if (accion === 'guardar') {
      if (this.form.valid) {
        this.formValues = this.form.getRawValue();
        //ALMACENAR LA INFORMACION
        console.log(this.formValues, 'formulario para guardar');
        this.query
          .addAmbienteAcademico({
            json: JSON.stringify(this.formValues),
            _opcion: 'addDetGradoSecciones',
          })
          .subscribe({
            next: (data: any) => {
              console.log(data, 'id', data.data[0].id);
              console.log(data.data);
            },
            error: error => {
              console.error('Error fetching ambiente:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Mensaje',
                detail: 'Error. No se proceso petición ',
              });
            },
            complete: () => {
              console.log('Request completed');
              this.getSeccionesAsignadas();
              this.visible = false;
              // this.clearForm()
              this.messageService.add({
                severity: 'success',
                summary: 'Mensaje',
                detail: 'Proceso exitoso',
              });
              console.log('Request completed');
            },
          });
      } else {
        console.log('Formulario no válido', this.form.invalid);
      }
    }
    if (accion === 'actualizar') {
      console.log(this.form.value.iDetConfId);
      console.log(this.form.status);
    }
  }

  //evento del dropdown
  onChange(event: any, cbo: string): void {
    // Captura el valor seleccionado
    console.log(this.grados, 'lista de data grado');
    console.log(event.value, 'id grado');

    const selected = event.value;
    console.log(selected, 'id grado select');

    if (cbo === 'grado') {
      // Encuentra el objeto
      //   const selectGrado = this.grados

      // const found = selectGrado.find(item => item.iNivelGradoId === selected);
      const found = this.grados.find(item => item.iNivelGradoId === selected);
      console.log(found.cCicloNombre);
      // Encuentra el índice del objeto si existe

      this.form.get('cCicloNombre')?.setValue(found.cCicloNombre);
      this.form.get('cNivelNombre')?.setValue(found.cNivelNombre);
      this.form.get('cNivelTipoNombre')?.setValue(found.cNivelTipoNombre);
    }

    if (cbo === 'ambiente') {
      const found = this.ambientes.find(item => item.iIieeAmbienteId === selected);
      //console.log(found.cAmbienteNombre, 'ambientes', found, 'found ambientes')

      // Encuentra el índice del objeto si existe

      this.form.get('iAmbienteAforo')?.setValue(found.iAmbienteAforo);
      this.form.get('cAmbienteDescripcion')?.setValue(found.cAmbienteDescripcion);
      this.form.get('iUsoAmbId')?.setValue(found.iUsoAmbId);
    }

    if (cbo === 'turno') {
      //   console.log(this.turnos[selected], 'data de turnos')

      const found = this.turnos.find(item => item.iTurnoId === selected);
      this.form.get('iModalServId')?.setValue(found.iModalServId);
      this.form.get('cModalServId')?.setValue(found.iModalServId);
    }
    // Puedes agregar más lógica aquí
    if (selected) {
      // Realizar acciones basadas en la selección
    }

    if (cbo === 'dia') {
      console.log(this.form.get('iDiasLaborables')?.value(), ' Dias seleccionados');
    }
    // Puedes agregar más lógica aquí
    if (selected) {
      // Realizar acciones basadas en la selección
    }
  }
  // Evento al seleccionar un nodo
  nodeSelect(event: any) {
    console.log('Nodo seleccionado:', event.node);
    console.log('Nodos seleccionados actualmente:', this.selectedFiles);
  }
  // Evento al deseleccionar un nodo
  nodeUnselect(event: any) {
    console.log('Nodo deseleccionado:', event.node);
    console.log('Nodos seleccionados actualmente:', this.selectedFiles);
  }

  getAmbientes() {
    console.log(this.stepService.perfil, 'getAmbientes');
    const where =
      'iYAcadId =' +
      [this.configuracion[0].iYAcadId] +
      ' and iSedeId =' +
      this.stepService.perfil['iSedeId'];
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'iiee_ambientes',
        campos:
          'iIieeAmbienteId, cAmbienteNombre,  bAmbienteEstado, iAmbienteArea, iEstadoAmbId, iAmbienteAforo,iUsoAmbId, cAmbienteObs,cAmbienteDescripcion',
        condicion: where,
      })
      .subscribe({
        next: (data: any) => {
          this.ambientes = data.data;
          //  this.iServId = this.serv_atencion[0].iServEdId

          console.log(this.ambientes, 'ambientes');
        },
        error: error => {
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }
  getTurnoCalendario() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCalAcadId: this.sede[0].iCalAcadId,
        }),
        _opcion: 'getCalendarioTurnos',
      })
      .subscribe({
        next: (data: any) => {
          this.turnos = data.data;
          //    this.iServId = this.serv_atencion[0].iServEdId

          //console.log(data.data,'turnos calendarios')
        },
        error: error => {
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          //   console.log('Request completed')
        },
      });
  }
  getDiasCalendario() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iCalAcadId: this.sede[0].iCalAcadId,
        }),
        _opcion: 'getCalendarioDiasLaborables',
      })
      .subscribe({
        next: (data: any) => {
          const found = data.data;
          this.dias = JSON.parse(found[0].calDiasDatos);

          this.dias = JSON.parse(found[0].calDiasDatos).map((dia: any) => ({
            iDiaId: dia.iDiaId,
            cDiaNombre: dia.cDiaNombre,
          }));

          // Actualiza el valor seleccionado del formControl
          this.form.get('iDiasLaborables')?.setValue(this.dias.map(dia => dia.iDiaId));

          // console.log( this.dias,'dias calendarios')
        },
        error: error => {
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          //  console.log('Request completed')
          // Asignar los valores iniciales
          //this.form.get('iDiasLaborables')?.setValue(this.dias);
        },
      });
  }
  getSecciones() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'secciones',
        campos: 'iSeccionId, cSeccionNombre,cSeccionDescripcion',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.secciones = data.data;
          //    this.iServId = this.serv_atencion[0].iServEdId

          // console.log(this.secciones,'secciones')
        },
        error: error => {
          console.error('Error fetching secciones:', error);
        },
        complete: () => {
          // console.log('Request completed')
        },
      });
  }
  getSeccionesAsignadas() {
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iConfigId: this.stepService.configuracion[0].iConfigId,
        }),
        _opcion: 'getSeccionesConfig',
      })
      .subscribe({
        next: (data: any) => {
          // this.seccionesAsignadas = data.data
          //    this.iServId = this.serv_atencion[0].iServEdId
          // this.lista = this.extraerSecciones(data.data)
          this.seccionesAsignadas = data.data.map((ambiente: any) => {
            return {
              ...ambiente, // Mantén todos los campos originales
              arrayAmbientes: {
                ciclo: ambiente.cCicloRomanos,
                grado: ambiente.cGradoNombre,
                seccion: ambiente.cSeccionNombre,
                estudiantes: ambiente.iDetConfCantEstudiantes,
                ambiente: ambiente.cAmbienteNombre,
              },
            };
          });

          //   console.log(this.seccionesAsignadas,' seccionesAsignadas')
        },
        error: error => {
          console.error('Error fetching  seccionesAsignadas:', error);
        },
        complete: () => {
          // console.log('Request completed')
          //    setTimeout(() => {
          //    // this.updateData();
          // }, 2000);
          // console.log(this.lista, 'desde getSeccionesAsignadas')
        },
      });
  }
  // extraerSecciones(seccionesPosGrado) {
  //     // Agrupar las secciones por grado
  //     const agruparSeccionesPorGrado = (
  //         datos: any[]
  //     ): Record<string, string[]> => {
  //         return datos.reduce(
  //             (acumulador, item) => {
  //                 const grado = item.cGradoNombre // Nombre del grado
  //                 const seccion = item.cSeccionNombre // Nombre de la sección

  //                 // Si el grado no existe en el acumulador, inicializarlo como un array vacío
  //                 if (!acumulador[grado]) {
  //                     acumulador[grado] = []
  //                 }

  //                 // Agregar la sección al grado (evitando duplicados)
  //                 if (!acumulador[grado].includes(seccion)) {
  //                     acumulador[grado].push(seccion)
  //                 }

  //                 return acumulador
  //             },
  //             {} as Record<string, string[]>
  //         )
  //     }

  //     // Usar la función para agrupar las secciones
  //     const resultado = agruparSeccionesPorGrado(seccionesPosGrado)
  //     return resultado
  // }

  getTutor() {
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iSedeId: this.stepService.configuracion[0].iSedeId,
          iYAcadId: this.stepService.configuracion[0].iYAcadId,
        }),
        _opcion: 'getPersionalSedeYear',
      })
      .subscribe({
        next: (data: any) => {
          this.tutores = data.data.map((docente: any) => {
            return {
              ...docente, // Mantén todos los campos originales
              nombreCompleto:
                `${docente.cPersDocumento}${' - '} ${docente.cPersNombre} ${docente.cPersPaterno} ${docente.cPersMaterno}${' ('} ${docente.cPersCargoNombre}${') '}`.trim(), // Crea el campo con los nombres completos
            };
          });

          // console.log(this.tutores,'tutor')
        },
        error: error => {
          console.error('Error fetching secciones:', error);
        },
        complete: () => {
          // console.log('Request completed')
        },
      });
  }
  getGrado() {
    this.query
      .searchGradoCiclo({
        iNivelTipoId: this.stepService.iNivelTipoId,
      })
      .subscribe({
        next: (data: any) => {
          this.grados = data.data;
          this.rawData = data.data;
          console.log(this.grados, 'grados desde getGrado');
          console.log(this.rawData, ' rawData desde getGrado');
        },
        error: error => {
          console.error('Error fetching grados:', error);
        },
        complete: () => {
          console.log(this.grados, 'grados desde getGrado');
          console.log(this.rawData, ' rawData desde getGrado');

          // Usamos setTimeout para retrasar la ejecución de updateData() por 2 segundos (2000 ms)
          // setTimeout(() => {
          //   //  this.updateData();
          // }, 2000); // 2000 ms = 2 segundos
        },
      });
  }

  getUsoAmbientes() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'uso_ambientes',
        campos: 'iUsoAmbId, cUsoAmbNombre',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.uso = data.data;
        },
        error: error => {
          console.error('Error fetching uso de ambientes:', error);
        },
        complete: () => {
          // console.log('Request completed')
        },
      });
  }
  getServicioAtencion() {
    this.query
      .searchCalAcademico({
        esquema: 'acad',
        tabla: 'servicio_educativos',
        campos: 'iServEdId, iNivelTipoId,cServEdNombre',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.serv_atencion = data.data;
          //console.log(this.serv_atencion)
        },
        error: error => {
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          //console.log('Request completed')
        },
      });
  }
  getModalidad() {
    this.query
      .searchCalAcademico({
        // Atenciones
        esquema: 'acad',
        tabla: 'modalidad_servicios',
        campos: 'iModalServId, cModalServNombre',
        condicion: '1=1',
      })
      .subscribe({
        next: (data: any) => {
          this.modalidad = data.data;
          //console.log(this.modalidad, 'data modalidad')
        },
        error: error => {
          console.error('Error fetching Servicios de Atención:', error);
        },
        complete: () => {
          //  console.log('Request completed')
        },
      });
  }
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
            severity: 'Info',
            summary: 'Mensaje del sistema',
            detail: registro.mensaje,
          });
        }
      },
      error: error => {
        // console.error('Error fetching ambiente:', error)
        this.messageService.add({
          severity: 'error',
          summary: 'Mensaje de error',
          detail: 'NO se pudo eliminar registro' + error,
        });
      },
      complete: () => {
        console.log('Request completed');
        this.getAmbientes();
      },
    });
  }
  // updateData() {
  //     // Actualiza las variables con nuevos datos
  //     this.rawData = this.grados;  // Aquí pones los datos nuevos para treeDataRaw

  //     console.log(this.rawData, 'valor this.rawData')

  //   }
  // rawData = [

  // {
  //     "iNivelGradoId": "3",
  //     "iNivelTipoId": "3",
  //     "iNivelId": "2",
  //     "iNivelTipoEdadInicio": "6",
  //     "cNivelTipoNombre": "Educación Primaria",
  //     "iNivelTipoEdadFin": "11",
  //     "cCicloNombre": "EBR-CICLO III",
  //     "cCicloRomanos": "III",
  //     "iGradoId": "3",
  //     "cGradoNombre": "Primero",
  //     "cGradoAbreviacion": "1ro.",
  //     "cNivelNombre": "Educación Basica Regular",
  //     "cNivelSigla": "EBR",
  //     "cNivelDenominacionTutor": "Tutor"
  // },
  // {
  //     "iNivelGradoId": "4",
  //     "iNivelTipoId": "3",
  //     "iNivelId": "2",
  //     "iNivelTipoEdadInicio": "6",
  //     "cNivelTipoNombre": "Educación Primaria",
  //     "iNivelTipoEdadFin": "11",
  //     "cCicloNombre": "EBR-CICLO III",
  //     "cCicloRomanos": "III",
  //     "iGradoId": "4",
  //     "cGradoNombre": "Segundo",
  //     "cGradoAbreviacion": "2do.",
  //     "cNivelNombre": "Educación Basica Regular",
  //     "cNivelSigla": "EBR",
  //     "cNivelDenominacionTutor": "Tutor"
  // },

  // ]

  // {
  //   iNivelTipoId: 1,
  //   cNivelNombre: 'Educación Primaria',
  //   cCicloNombre: 'EBR-CICLO I',
  //   cCicloRomanos: 'I',
  //   cGradoNombre: '1° Grado',
  //   cGradoAbreviacion: '1ro',
  // },
  // {
  //   iNivelTipoId: 1,
  //   cNivelNombre: 'Educación Primaria',
  //   cCicloNombre: 'EBR-CICLO I',
  //   cCicloRomanos: 'I',
  //   cGradoNombre: '2',
  //   cGradoAbreviacion: '2do',

  // },
  // {
  //   iNivelTipoId: 2,
  //   cNivelNombre: 'Educación Primaria',
  //   cCicloNombre: 'EBR-CICLO II',
  //   cCicloRomanos: 'II',
  //   cGradoNombre: '3° Grado',
  //   cGradoAbreviacion: '3ro',

  // }

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
    {
      labelTooltip: 'Generar reporte',
      text: 'Reporte',
      icon: 'pi pi-file-pdf',
      accion: 'reporte',
      class: 'p-button-danger',
    },
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
      header: 'Foro',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '30%',
      field: 'nombres',
      header: 'Tutor',
      text_header: 'center',
      text: 'center',
    },

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
