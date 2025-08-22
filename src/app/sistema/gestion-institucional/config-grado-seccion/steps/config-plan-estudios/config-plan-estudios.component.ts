import { Component, OnInit, inject } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { PrimengModule } from '@/app/primeng.module';
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GeneralService } from '@/app/servicios/general.service';

import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { TypesFilesUploadPrimengComponent } from '../../../../../shared/types-files-upload-primeng/types-files-upload-primeng.component';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { AsignarHorasComponent } from './asignar-horas/asignar-horas.component';

@Component({
  selector: 'app-config-plan-estudios',
  standalone: true,
  imports: [
    StepsModule,
    PrimengModule,
    ContainerPageComponent,
    TablePrimengComponent,
    TypesFilesUploadPrimengComponent,
    AsignarHorasComponent,
  ],
  templateUrl: './config-plan-estudios.component.html',
  styleUrl: './config-plan-estudios.component.scss',
})
export class ConfigPlanEstudiosComponent implements OnInit {
  items: MenuItem[];
  planes: [];
  form: FormGroup;
  formNivelGrado: FormGroup;
  formFiltrado: FormGroup;

  caption: string;
  visible: boolean = false;
  configuracion: any[];
  uploadedFiles: any[] = [];
  typesFiles = {
    //archivos
    file: true,
    url: false,
    youtube: false,
    repository: false,
    image: false,
  };
  filesUrl = []; //archivos
  enlace: string;
  event: string;
  selectedItems = [];

  nivelesCiclos = [];
  niveles = [];
  dynamicColumns = [];
  groupedData = [];
  lista: any = [];

  //Validaro para actualiza plan curricular
  bAgregar: boolean = false;

  private _confirmService = inject(ConfirmationModalService);
  constructor(
    private stepService: AdmStepGradoSeccionService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private query: GeneralService
  ) {
    this.items = this.stepService.itemsStep;
    this.configuracion = this.stepService.configuracion;
  }

  ngOnInit(): void {
    try {
      //bd iiee_ambientes
      //this.visible = true
      this.form = this.fb.group({
        iPlanes: [0], //codigo de tabla_iiee_ambientes
        cPlanes: ['', Validators.required], // tabla_iiee_ambientes (FK)
        cUrlPlanes: ['', Validators.required], // tabla_iiee_ambientes (FK)
        cObsPlanes: [''],

        iYAcadId: [this.configuracion[0].iYAcadId], // tabla_iiee_ambientes (FK)
        iSedeId: [this.configuracion[0].iSedeId], // tabla_iiee_ambientes (FK)

        // ambiente: [''],
        cYAcadNombre: [this.configuracion[0].cYAcadNombre], // campo adicional para la vista
      });
    } catch (error) {
      this.router.navigate(['/gestion-institucional/configGradoSeccion']);
    }

    this.formFiltrado = this.fb.group({
      iGradoId: [0],
      cCurso: [''],
    });

    this.formNivelGrado = this.fb.group({
      //   iNivelGradoId : [0],
      cGradoNombre: [''],
      cCicloNombre: [''],
      cNivelNombre: [''],
      cNivelTipoNombre: [''],

      cDeclaracionJurada: [''],

      cCursoNombre: [''],
      iHorasSemPresencial: [0],
      iHorasSemDomicilio: [0],
      iTotalHoras: [0],
    });
    //  this.getCursosNivelGrado()
  }

  getCursosNivelGrado() {
    //alert(this.stepService.iNivelTipoId )
    this.query
      .searchAmbienteAcademico({
        json: JSON.stringify({
          iNivelGradoId: this.stepService.iNivelTipoId,
        }),
        _opcion: 'getCursosNivelGrado',
      })
      .subscribe({
        next: (data: any) => {
          this.lista = this.extraerAsignatura(data.data);
          this.nivelesCiclos = data.data;

          const grouped = this.nivelesCiclos.reduce((acc, item) => {
            const curso = item.cCursoNombre;
            const grado = item.cGradoNombre + '(' + item.cCicloRomanos + ')'; //item.cGradoNombre; // Nombre ded grado
            const hora = item.nCursoTotalHoras; // hora total

            if (!acc[curso]) {
              acc[curso] = {
                iCursoId: item.iCursoId,
                cCursoNombre: item.cCursoNombre,
                cNivelNombre: item.cNivelNombre,
                cNivelTipoNombre: item.cNivelTipoNombre,
                cCicloNombre: item.cCicloNombre,
                grades: {},
              };
            }
            acc[curso].grades[grado] = <number>hora;
            return acc;
          }, {});

          // this.groupedData  = Object.values(grouped);
          this.groupedData = Object.values(grouped);

          // Generar columnas dinámicas (grados únicos)
          const allGrades = this.nivelesCiclos.map(
            item => item.cGradoNombre + '(' + item.cCicloRomanos + ')'
          );
          this.dynamicColumns = Array.from(new Set(allGrades));
        },

        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: 'Petición denegada. ' + error.error.message,
          });
        },
      });
  }

  extraerAsignatura(Asignatura) {
    // Agrupar las secciones por grado
    const agruparSeccionesPorGrado = (datos: any[]): Record<string, string[]> => {
      return datos.reduce(
        (acumulador, item) => {
          const curso = item.cCursoNombre; // Nombre del curso
          const grado = item.cGradoNombre; // Nombre ded grado
          const hora = item.iCursoTotalHoras; // hora total

          // Si el grado no existe en el acumulador, inicializarlo como un array vacío
          if (!acumulador[curso]) {
            acumulador[curso] = [];
          }

          // Agregar la sección al grado (evitando duplicados)
          if (!acumulador[curso].includes(grado)) {
            acumulador[curso].push(grado);
            acumulador[curso].push(hora);
          }

          return acumulador;
        },
        {} as Record<string, string[]>
      );
    };

    // Usar la función para agrupar las secciones
    const resultado = agruparSeccionesPorGrado(Asignatura);
    return resultado;
  }

  confirm() {
    this._confirmService.openConfiSave({
      message: '¿Estás seguro de que deseas guardar y continuar?',
      header: 'Advertencia de autoguardado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.router.navigate(['/gestion-institucional/hora-docente']);
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
  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'close-modal':
        // this.accionBtnItem.emit({ accion, item })
        break;

      case 'subir-file-configuracion-iiee':
        const url = this.query.baseUrlPublic();
        if (this.filesUrl.length < 1) {
          this.filesUrl.push({
            type: 1, //1->file
            nameType: 'file',
            name: item.file.name,
            size: item.file.size,
            ruta: item.name,
          });

          this.form.get('cConfigUrlRslAprobacion')?.setValue(this.filesUrl[0].ruta);

          this.enlace = url + '/' + this.filesUrl[0].ruta;
        } else {
          alert('No puede subir mas de un archivo');
        }

        break;
    }
  }

  accionBtnItemTable(evento: any) {
    this.event = evento.item;
    if (evento.accion === 'retornar') {
      this._confirmService.openConfiSave({
        message: '¿Estás seguro de que deseas regresar al paso anterior?',
        header: 'Advertencia de autoguardado',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Acción para eliminar el registro
          this.router.navigate(['/gestion-institucional/seccion']);
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

    if (evento.accion === 'agregar') {
      this.visible = true;
      this.caption = 'Registrar plan de estudios';
    }
  }

  accionBtnItem(accion) {
    if (accion === 'guardar') {
      if (this.form.valid) {
        this.query
          .addAmbienteAcademico({
            json: JSON.stringify(this.form.value),
            _opcion: 'addConfig',
          })
          .subscribe({
            next: (data: any) => {
              this.form.get('iConfigId')?.setValue(data.data[0].id);
              this.configuracion[0] = this.form.value;
              this.stepService.configuracion[0] = this.configuracion[0];
            },
            error: error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Mensaje',
                detail: 'Error. No se proceso petición. ' + error.error.message,
              });
            },
            complete: () => {
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
          detail: 'llenado incorrecto del formulario.',
        });
      }
    }
  }

  accionesPrincipal: IActionContainer[] = [
    {
      labelTooltip: 'Retornar',
      text: 'Retornar',
      icon: 'pi pi-arrow-circle-left',
      accion: 'retornar',
      class: 'p-button-warning',
    },
    // {
    //     labelTooltip: 'Crear Plan de estudio',
    //     text: 'Crear Plan de estudio',
    //     icon: 'pi pi-plus',
    //     accion: 'agregar',
    //     class: 'p-button-primary',
    // },
  ];

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

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cCursoNombre',
      header: 'Área curricular',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'iHorasSemPresencial',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'iHorasSemDomicilio',
      header: '',
      text_header: 'center',
      text: 'center',
    },
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
